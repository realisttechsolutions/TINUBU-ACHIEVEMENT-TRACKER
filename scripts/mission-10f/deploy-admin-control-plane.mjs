import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const apiv2 = require('../../node_modules/firebase-tools/lib/apiv2');
const { Client } = require('../../node_modules/firebase-tools/lib/apiv2');

const PROJECT = 'tinubu-achievement-stg';
const REGION = 'us-central1';
const SERVICE_NAME = 'tat-admin-api-staging';
const SERVICE_ACCOUNT = `tat-admin-api-staging@${PROJECT}.iam.gserviceaccount.com`;
const APP_HOSTING_SA = `firebase-app-hosting-compute@${PROJECT}.iam.gserviceaccount.com`;

const headers = { 'x-goog-user-project': PROJECT };
const cloudBuild = new Client({ urlPrefix: 'https://cloudbuild.googleapis.com', apiVersion: 'v1', auth: true });
const cloudRun = new Client({ urlPrefix: 'https://run.googleapis.com', apiVersion: 'v2', auth: true });

async function waitForBuild(buildId) {
  console.log(`Waiting for Cloud Build ${buildId}...`);
  const deadline = Date.now() + 10 * 60 * 1000;
  while (Date.now() < deadline) {
    const res = await cloudBuild.get(`/projects/${PROJECT}/locations/global/builds/${buildId}`, { headers });
    const status = res.body.status;
    if (status === 'SUCCESS') {
      console.log(' - Cloud Build succeeded!');
      return;
    }
    if (status === 'FAILURE' || status === 'INTERNAL_ERROR' || status === 'TIMEOUT' || status === 'CANCELLED') {
      throw new Error(`Cloud Build failed with status: ${status}. Failure details: ${JSON.stringify(res.body.failureInfo)}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 5_000));
  }
  throw new Error('Cloud Build exceeded 10 minutes.');
}

async function waitForRunOperation(opName) {
  console.log(`Waiting for Cloud Run operation ${opName}...`);
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    const res = await cloudRun.get(`/${opName}`, { headers });
    if (res.body.done) {
      if (res.body.error) throw new Error(`Cloud Run deployment failed: ${JSON.stringify(res.body.error)}`);
      return res.body.response;
    }
    await new Promise((resolve) => setTimeout(resolve, 3_000));
  }
  throw new Error('Cloud Run operation exceeded 5 minutes.');
}

async function main() {
  console.log('============================================================');
  console.log('MISSION 10F-B: DEPLOYING DEDICATED ADMIN CONTROL PLANE');
  console.log('============================================================\n');

  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });
  const token = await apiv2.getAccessToken();

  // 1. Build Bundle
  console.log('[1/5] Building standalone admin service bundle...');
  execSync('node scripts/mission-10f/build-admin-bundle.mjs', { stdio: 'inherit' });

  // 2. Tar source
  console.log('\n[2/5] Creating deployment archive...');
  execSync('tar -czf dist-admin.tar.gz dist-admin Dockerfile.admin', { stdio: 'inherit' });

  // 3. Upload to Cloud Storage staging bucket
  console.log('\n[3/5] Uploading to Google Cloud Storage source bucket...');
  const bucketName = `${PROJECT}_cloudbuild`;
  const objectName = `source-admin-${Date.now()}.tar.gz`;

  const uploadRes = await fetch(`https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${objectName}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/gzip',
      'x-goog-user-project': PROJECT,
    },
    body: readFileSync('dist-admin.tar.gz'),
  });

  if (uploadRes.status >= 400) {
    throw new Error(`Upload failed: ${uploadRes.status} ${await uploadRes.text()}`);
  }
  console.log(` - Uploaded source to gs://${bucketName}/${objectName}`);

  // 4. Submit Cloud Build
  console.log('\n[4/5] Submitting Cloud Build for container image...');
  const imageName = `gcr.io/${PROJECT}/${SERVICE_NAME}:${Date.now()}`;
  const buildRes = await cloudBuild.post(`/projects/${PROJECT}/builds`, {
    source: {
      storageSource: {
        bucket: bucketName,
        object: objectName,
      },
    },
    steps: [
      {
        name: 'gcr.io/cloud-builders/docker',
        args: ['build', '-f', 'Dockerfile.admin', '-t', imageName, '.'],
      },
    ],
    images: [imageName],
  }, { headers });

  const buildId = buildRes.body.metadata.build.id;
  await waitForBuild(buildId);

  // 5. Deploy / Update Cloud Run Service
  console.log(`\n[5/5] Deploying Cloud Run service ${SERVICE_NAME}...`);
  const servicePath = `projects/${PROJECT}/locations/${REGION}/services/${SERVICE_NAME}`;

  let serviceExists = false;
  try {
    const existing = await cloudRun.get(`/${servicePath}`, { headers });
    if (existing.status === 200) serviceExists = true;
  } catch (err) {}

  const servicePayload = {
    template: {
      serviceAccount: SERVICE_ACCOUNT,
      containers: [
        {
          image: imageName,
          env: [
            { name: 'INSTANCE_CONNECTION_NAME', value: `${PROJECT}:${REGION}:tat-db-staging` },
            { name: 'DB_NAME', value: 'tat_staging' },
            { name: 'ADMIN_IAM_DB_USER', value: `tat-admin-api-staging@${PROJECT}.iam` },
            { name: 'GOOGLE_CLOUD_PROJECT', value: PROJECT },
            { name: 'NODE_ENV', value: 'production' },
          ],
          resources: {
            limits: {
              cpu: '1',
              memory: '512Mi',
            },
          },
        },
      ],
      scaling: {
        minInstanceCount: 0,
        maxInstanceCount: 2,
      },
    },
    traffic: [
      {
        type: 'TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST',
        percent: 100,
      },
    ],
  };

  let deployOp;
  if (serviceExists) {
    console.log(' - Updating existing Cloud Run service...');
    deployOp = await cloudRun.patch(`/${servicePath}`, servicePayload, { headers });
  } else {
    console.log(' - Creating new Cloud Run service...');
    deployOp = await cloudRun.post(`/projects/${PROJECT}/locations/${REGION}/services`, servicePayload, {
      headers,
      queryParams: { serviceId: SERVICE_NAME },
    });
  }

  const deployedService = await waitForRunOperation(deployOp.body.name);
  const serviceUri = deployedService.uri || `https://${SERVICE_NAME}-${REGION}.a.run.app`;
  console.log(` - Cloud Run service deployed: ${serviceUri}`);

  // 6. Restrict Invoker Permissions (App Hosting compute SA & Operator ONLY)
  console.log('\n[6/6] Restricting Cloud Run invocation policy (Zero anonymous access)...');
  const runIamClient = new Client({ urlPrefix: 'https://run.googleapis.com', apiVersion: 'v1', auth: true });
  const invokerPolicy = {
    bindings: [
      {
        role: 'roles/run.invoker',
        members: [
          `serviceAccount:${APP_HOSTING_SA}`,
          `user:${account.user.email}`,
        ],
      },
    ],
  };

  await runIamClient.post(`/projects/${PROJECT}/locations/${REGION}/services/${SERVICE_NAME}:setIamPolicy`, {
    policy: invokerPolicy,
  }, { headers });

  console.log(' - Invocation policy set: App Hosting compute and Operator only. Anonymous access DENIED.');
  console.log(`\nCONTROL PLANE URL: ${serviceUri}`);
}

main().catch(console.error);
