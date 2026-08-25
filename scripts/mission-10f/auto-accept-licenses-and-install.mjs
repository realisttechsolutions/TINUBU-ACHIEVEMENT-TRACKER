import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';

const SDK_DIR = 'C:\\Users\\DELL\\tools\\android-sdk';
const LICENSES_DIR = path.join(SDK_DIR, 'licenses');
const JDK_DIR = 'C:\\Users\\DELL\\tools\\jdk\\jdk-17.0.12+7';

if (!existsSync(LICENSES_DIR)) {
  mkdirSync(LICENSES_DIR, { recursive: true });
}

// Standard hashes for Android SDK licenses
const LICENSES = {
  'android-sdk-license': '24333f8a63b6825ea9c5514f83c2829b004d1fee\nd56f5187479451eabf01fb78af6dfcb131a6481e\n84831b9409646a918e30573bab4c9c91346d8abd',
  'android-sdk-preview-license': '84831b9409646a918e30573bab4c9c91346d8abd',
  'android-googletv-license': '601085b94cd77f6b54b86e44f33d350491d42120',
  'intel-android-extra-license': 'd975f751698a77b662f1254ddbeed3901e976f5a',
  'mips-android-sysimage-license': 'e9acab5b5fbb560a7251301710c959d4f9b0b753',
  'google-gdk-license': '33b6a2b64607f11b759f320ef9dff4ae5c47d97a',
};

for (const [name, content] of Object.entries(LICENSES)) {
  writeFileSync(path.join(LICENSES_DIR, name), content, 'utf8');
}
console.log('Pre-seeded all Android SDK licenses successfully.');

// Run sdkmanager to install packages non-interactively
const sdkManager = path.join(SDK_DIR, 'cmdline-tools', 'latest', 'bin', 'sdkmanager.bat');
const env = {
  ...process.env,
  JAVA_HOME: JDK_DIR,
  PATH: `${path.join(JDK_DIR, 'bin')};${process.env.PATH}`,
  ANDROID_HOME: SDK_DIR,
};

console.log('Installing platforms;android-34, build-tools;34.0.0, platform-tools...');
const proc = spawn(sdkManager, ['platforms;android-34', 'build-tools;34.0.0', 'platform-tools'], {
  env,
  shell: true,
  stdio: 'inherit',
});

proc.on('close', (code) => {
  if (code === 0) {
    console.log('Android SDK platform 34 and build tools installed successfully!');
  } else {
    console.error(`sdkmanager exited with code ${code}`);
    process.exit(code || 1);
  }
});
