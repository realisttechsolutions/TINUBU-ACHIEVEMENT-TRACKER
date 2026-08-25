import { createWriteStream, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const TOOLS_DIR = 'C:\\Users\\DELL\\tools';
const JDK_DIR = 'C:\\Users\\DELL\\tools\\jdk\\jdk-17.0.12+7';
const SDK_DIR = 'C:\\Users\\DELL\\tools\\android-sdk';
const BUILD_TOOLS_DIR = path.join(SDK_DIR, 'build-tools', '34.0.0');
const GRADLE_DIR = path.join(TOOLS_DIR, 'gradle', 'gradle-8.5');
const KEYSTORE_DIR = path.join(TOOLS_DIR, 'keystores');
const OUTPUTS_DIR = 'c:\\Users\\DELL\\Documents\\111 ANTI & CODEX\\TINUBU ACHIEVEMENTS TRACKER-ANTIGRAVITY-M10JD2\\android\\release-outputs';
const ANDROID_ROOT = 'c:\\Users\\DELL\\Documents\\111 ANTI & CODEX\\TINUBU ACHIEVEMENTS TRACKER-ANTIGRAVITY-M10JD2\\android';

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function runCmd(cmd, args, cwd = process.cwd(), env = process.env) {
  return new Promise((resolve, reject) => {
    console.log(`> [${cwd}] ${cmd} ${args.join(' ')}`);
    const proc = spawn(cmd, args, {
      cwd,
      env,
      shell: true,
      stdio: 'inherit',
    });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with exit code ${code}`));
    });
  });
}

async function downloadFile(url, destPath) {
  console.log(`Downloading ${url} -> ${destPath}...`);
  const res = await fetch(url, { headers: { 'User-Agent': 'Node-Fetch' } });
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  const fileStream = createWriteStream(destPath);
  await pipeline(res.body, fileStream);
  console.log(`Downloaded ${destPath}.`);
}

async function extractZip(zipPath, outDir) {
  console.log(`Extracting ${zipPath} -> ${outDir}...`);
  return runCmd('powershell.exe', [
    '-NoProfile',
    '-Command',
    `Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${outDir}' -Force`,
  ]);
}

async function main() {
  ensureDir(TOOLS_DIR);
  ensureDir(KEYSTORE_DIR);
  ensureDir(OUTPUTS_DIR);

  // 1. Setup Gradle 8.5
  const gradleZip = path.join(TOOLS_DIR, 'gradle-8.5-bin.zip');
  if (!existsSync(GRADLE_DIR)) {
    if (!existsSync(gradleZip)) {
      await downloadFile('https://services.gradle.org/distributions/gradle-8.5-bin.zip', gradleZip);
    }
    await extractZip(gradleZip, path.join(TOOLS_DIR, 'gradle'));
  }
  const gradleBin = path.join(GRADLE_DIR, 'bin', 'gradle.bat');
  console.log(`Gradle binary ready: ${gradleBin}`);

  const buildEnv = {
    ...process.env,
    JAVA_HOME: JDK_DIR,
    ANDROID_HOME: SDK_DIR,
    ANDROID_SDK_ROOT: SDK_DIR,
    PATH: `${path.join(JDK_DIR, 'bin')};${path.join(GRADLE_DIR, 'bin')};${BUILD_TOOLS_DIR};${process.env.PATH}`,
  };

  // 2. Generate Operator Release Keystore
  const keystorePath = path.join(KEYSTORE_DIR, 'ptat-release.keystore');
  const keytoolBin = path.join(JDK_DIR, 'bin', 'keytool.exe');
  if (!existsSync(keystorePath)) {
    console.log('Generating operator release signing keystore...');
    await runCmd(
      `"${keytoolBin}"`,
      [
        '-genkeypair',
        '-v',
        '-keystore', `"${keystorePath}"`,
        '-alias', 'ptat-release-key',
        '-keyalg', 'RSA',
        '-keysize', '2048',
        '-validity', '10000',
        '-storepass', 'PTATStagingRelease2026!SecureKey',
        '-keypass', 'PTATStagingRelease2026!SecureKey',
        '-dname', '"CN=Realist Tech Solutions, OU=PTAT Mobile, O=Federal Republic of Nigeria, L=Abuja, ST=FCT, C=NG"',
      ],
      process.cwd(),
      buildEnv
    );
  }

  // 3. Build & Sign Public App (APK + AAB)
  console.log('\n========================================');
  console.log('BUILDING APP A: PTAT PUBLIC (com.realisttech.ptat)');
  console.log('========================================');
  const publicDir = path.join(ANDROID_ROOT, 'ptat-public');
  await runCmd(`"${gradleBin}"`, ['assembleRelease', 'bundleRelease', '--no-daemon'], publicDir, buildEnv);

  // 4. Build & Sign Admin App (APK + AAB)
  console.log('\n========================================');
  console.log('BUILDING APP B: PTAT ADMIN (com.realisttech.ptat.admin)');
  console.log('========================================');
  const adminDir = path.join(ANDROID_ROOT, 'ptat-admin');
  await runCmd(`"${gradleBin}"`, ['assembleRelease', 'bundleRelease', '--no-daemon'], adminDir, buildEnv);

  // 5. Sign Release APKs with apksigner
  const apksignerBin = path.join(BUILD_TOOLS_DIR, 'apksigner.bat');
  const zipalignBin = path.join(BUILD_TOOLS_DIR, 'zipalign.exe');

  console.log('\n========================================');
  console.log('SIGNING & VERIFYING RELEASE ARTIFACTS');
  console.log('========================================');

  // Public APK
  const unsignedPublicApk = path.join(publicDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk');
  const alignedPublicApk = path.join(OUTPUTS_DIR, 'PTAT-Public-Staging-v0.9.0-aligned.apk');
  const finalPublicApk = path.join(OUTPUTS_DIR, 'PTAT-Public-Staging-v0.9.0.apk');
  const finalPublicAab = path.join(OUTPUTS_DIR, 'PTAT-Public-Staging-v0.9.0.aab');

  // Copy AAB
  copyFileSync(
    path.join(publicDir, 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab'),
    finalPublicAab
  );

  // Zipalign & Sign Public APK
  await runCmd(`"${zipalignBin}"`, ['-v', '-p', '4', `"${unsignedPublicApk}"`, `"${alignedPublicApk}"`], process.cwd(), buildEnv);
  await runCmd(
    `"${apksignerBin}"`,
    [
      'sign',
      '--ks', `"${keystorePath}"`,
      '--ks-key-alias', 'ptat-release-key',
      '--ks-pass', 'pass:PTATStagingRelease2026!SecureKey',
      '--key-pass', 'pass:PTATStagingRelease2026!SecureKey',
      '--out', `"${finalPublicApk}"`,
      `"${alignedPublicApk}"`,
    ],
    process.cwd(),
    buildEnv
  );

  // Admin APK
  const unsignedAdminApk = path.join(adminDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk');
  const alignedAdminApk = path.join(OUTPUTS_DIR, 'PTAT-Admin-Staging-v0.9.0-aligned.apk');
  const finalAdminApk = path.join(OUTPUTS_DIR, 'PTAT-Admin-Staging-v0.9.0.apk');
  const finalAdminAab = path.join(OUTPUTS_DIR, 'PTAT-Admin-Staging-v0.9.0.aab');

  // Copy Admin AAB
  copyFileSync(
    path.join(adminDir, 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab'),
    finalAdminAab
  );

  // Zipalign & Sign Admin APK
  await runCmd(`"${zipalignBin}"`, ['-v', '-p', '4', `"${unsignedAdminApk}"`, `"${alignedAdminApk}"`], process.cwd(), buildEnv);
  await runCmd(
    `"${apksignerBin}"`,
    [
      'sign',
      '--ks', `"${keystorePath}"`,
      '--ks-key-alias', 'ptat-release-key',
      '--ks-pass', 'pass:PTATStagingRelease2026!SecureKey',
      '--key-pass', 'pass:PTATStagingRelease2026!SecureKey',
      '--out', `"${finalAdminApk}"`,
      `"${alignedAdminApk}"`,
    ],
    process.cwd(),
    buildEnv
  );

  // 6. Verify Signatures
  console.log('\nVerifying Public APK Signature:');
  await runCmd(`"${apksignerBin}"`, ['verify', '--verbose', `"${finalPublicApk}"`], process.cwd(), buildEnv);

  console.log('\nVerifying Admin APK Signature:');
  await runCmd(`"${apksignerBin}"`, ['verify', '--verbose', `"${finalAdminApk}"`], process.cwd(), buildEnv);

  console.log('\n========================================');
  console.log('ALL RELEASE ARTIFACTS ASSEMBLED AND SIGNED!');
  console.log(' - ' + finalPublicApk);
  console.log(' - ' + finalAdminApk);
  console.log(' - ' + finalPublicAab);
  console.log(' - ' + finalAdminAab);
  console.log('========================================');
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
