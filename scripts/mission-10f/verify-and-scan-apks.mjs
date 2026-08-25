import { spawnSync } from 'node:child_process';
import path from 'node:path';

const SDK_DIR = 'C:\\Users\\DELL\\tools\\android-sdk';
const BUILD_TOOLS_DIR = path.join(SDK_DIR, 'build-tools', '34.0.0');
const AAPT_BIN = path.join(BUILD_TOOLS_DIR, 'aapt.exe');
const APKSIGNER_BIN = path.join(BUILD_TOOLS_DIR, 'apksigner.bat');
const OUTPUTS_DIR = 'c:\\Users\\DELL\\Documents\\111 ANTI & CODEX\\TINUBU ACHIEVEMENTS TRACKER-ANTIGRAVITY-M10JD2\\android\\release-outputs';

const PUBLIC_APK = path.join(OUTPUTS_DIR, 'PTAT-Public-Staging-v0.9.0.apk');
const ADMIN_APK = path.join(OUTPUTS_DIR, 'PTAT-Admin-Staging-v0.9.0.apk');
const PUBLIC_AAB = path.join(OUTPUTS_DIR, 'PTAT-Public-Staging-v0.9.0.aab');
const ADMIN_AAB = path.join(OUTPUTS_DIR, 'PTAT-Admin-Staging-v0.9.0.aab');

const JDK_DIR = 'C:\\Users\\DELL\\tools\\jdk\\jdk-17.0.12+7';
const env = {
  ...process.env,
  JAVA_HOME: JDK_DIR,
  PATH: `${path.join(JDK_DIR, 'bin')};${BUILD_TOOLS_DIR};${process.env.PATH}`,
};

function inspectApk(apkPath, label) {
  console.log(`\n========================================`);
  console.log(`INSPECTING: ${label}`);
  console.log(`========================================`);

  const res = spawnSync(`"${AAPT_BIN}"`, ['dump', 'badging', `"${apkPath}"`], { shell: true, encoding: 'utf8', env });
  const out = res.stdout || '';

  const pkgMatch = out.match(/package: name='([^']+)' versionCode='([^']+)' versionName='([^']+)'/);
  const labelMatch = out.match(/application-label:'([^']+)'/);
  const sdkMatch = out.match(/sdkVersion:'([^']+)'/);
  const targetSdkMatch = out.match(/targetSdkVersion:'([^']+)'/);
  const isDebuggable = out.includes("application-debuggable");

  console.log(` - Package Name: ${pkgMatch ? pkgMatch[1] : 'Unknown'}`);
  console.log(` - Version Code: ${pkgMatch ? pkgMatch[2] : 'Unknown'}`);
  console.log(` - Version Name: ${pkgMatch ? pkgMatch[3] : 'Unknown'}`);
  console.log(` - App Label: ${labelMatch ? labelMatch[1] : 'Unknown'}`);
  console.log(` - Min SDK: ${sdkMatch ? sdkMatch[1] : 'Unknown'}`);
  console.log(` - Target SDK: ${targetSdkMatch ? targetSdkMatch[1] : 'Unknown'}`);
  console.log(` - Debuggable: ${isDebuggable ? 'TRUE (FAIL)' : 'FALSE (PASS)'}`);

  // Signature verification
  const sigRes = spawnSync(`"${APKSIGNER_BIN}"`, ['verify', '--verbose', `"${apkPath}"`], { shell: true, encoding: 'utf8', env });
  const sigOut = (sigRes.stdout || '') + (sigRes.stderr || '');
  const isV2V3Signed = sigOut.includes('Verified using v2 scheme (APK Signature Scheme v2): true') &&
                       sigOut.includes('Verified using v3 scheme (APK Signature Scheme v3): true');
  console.log(` - V2/V3 Signature Valid: ${isV2V3Signed ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(` - Signature Details:\n${sigOut.trim().split('\n').map(l => '     ' + l).join('\n')}`);
}

function scanForSecrets(apkPath, label) {
  console.log(`\n--- Secret & Credential Scan: ${label} ---`);
  const listRes = spawnSync(`"${AAPT_BIN}"`, ['list', `"${apkPath}"`], { shell: true, encoding: 'utf8' });
  const files = (listRes.stdout || '').split('\n').map((f) => f.trim()).filter(Boolean);

  const sensitivePatterns = [
    /\.key$/i,
    /\.pem$/i,
    /\.pk8$/i,
    /\.p12$/i,
    /\.keystore$/i,
    /\.jks$/i,
    /service-account.*\.json$/i,
    /google-services\.json$/i,
    /credentials.*\.json$/i,
    /secret/i,
  ];

  let violations = [];
  for (const f of files) {
    for (const pattern of sensitivePatterns) {
      if (pattern.test(f)) {
        violations.push(f);
      }
    }
  }

  if (violations.length === 0) {
    console.log(` - Secret Scan Result: 0 sensitive credentials embedded. PASS`);
  } else {
    console.error(` - WARNING: Sensitive files found in APK:`, violations);
  }
}

function main() {
  console.log('=== PTAT Android Packaging & Artifact Verification ===');
  
  inspectApk(PUBLIC_APK, 'PTAT Public Staging APK');
  scanForSecrets(PUBLIC_APK, 'PTAT Public Staging APK');

  inspectApk(ADMIN_APK, 'PTAT Admin Staging APK');
  scanForSecrets(ADMIN_APK, 'PTAT Admin Staging APK');

  console.log('\n========================================');
  console.log('OUTPUT SUMMARY:');
  console.log(` - Public APK: ${PUBLIC_APK}`);
  console.log(` - Admin APK:  ${ADMIN_APK}`);
  console.log(` - Public AAB: ${PUBLIC_AAB}`);
  console.log(` - Admin AAB:  ${ADMIN_AAB}`);
  console.log('========================================');
}

main();
