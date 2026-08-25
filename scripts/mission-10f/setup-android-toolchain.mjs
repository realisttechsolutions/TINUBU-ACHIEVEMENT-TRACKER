import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const TOOLS_DIR = 'C:\\Users\\DELL\\tools';
if (!existsSync(TOOLS_DIR)) {
  mkdirSync(TOOLS_DIR, { recursive: true });
}

async function downloadFile(url, destPath) {
  console.log(`Downloading ${url} -> ${destPath}...`);
  const res = await fetch(url, { headers: { 'User-Agent': 'Node-Fetch' } });
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status} ${res.statusText}`);
  const fileStream = createWriteStream(destPath);
  await pipeline(res.body, fileStream);
  console.log(`Downloaded ${destPath} successfully.`);
}

async function extractZip(zipPath, outDir) {
  console.log(`Extracting ${zipPath} -> ${outDir}...`);
  return new Promise((resolve, reject) => {
    const ps = spawn('powershell.exe', [
      '-NoProfile',
      '-Command',
      `Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${outDir}' -Force`,
    ], { stdio: 'inherit' });
    ps.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Expand-Archive exited with code ${code}`));
    });
  });
}

async function main() {
  console.log('=== Setting up Standalone Android Build Toolchain in User Space ===\n');

  // 1. Download & Extract OpenJDK 17
  const jdkZip = path.join(TOOLS_DIR, 'openjdk-17.zip');
  const jdkExtractDir = path.join(TOOLS_DIR, 'jdk');
  if (!existsSync(jdkExtractDir)) {
    mkdirSync(jdkExtractDir, { recursive: true });
  }

  const jdkUrl = 'https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.12+7/OpenJDK17U-jdk_x64_windows_hotspot_17.0.12_7.zip';
  if (!existsSync(jdkZip)) {
    await downloadFile(jdkUrl, jdkZip);
  }
  await extractZip(jdkZip, jdkExtractDir);

  // 2. Download & Extract Android Commandline Tools
  const cmdToolsZip = path.join(TOOLS_DIR, 'cmdline-tools.zip');
  const sdkDir = path.join(TOOLS_DIR, 'android-sdk');
  const cmdToolsDir = path.join(sdkDir, 'cmdline-tools', 'latest');
  if (!existsSync(cmdToolsDir)) {
    mkdirSync(cmdToolsDir, { recursive: true });
  }

  const cmdToolsUrl = 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip';
  if (!existsSync(cmdToolsZip)) {
    await downloadFile(cmdToolsUrl, cmdToolsZip);
  }
  
  const cmdExtractTemp = path.join(TOOLS_DIR, 'cmd-temp');
  if (!existsSync(cmdExtractTemp)) {
    mkdirSync(cmdExtractTemp, { recursive: true });
  }
  await extractZip(cmdToolsZip, cmdExtractTemp);

  // Move cmdline-tools content into sdk/cmdline-tools/latest
  return new Promise((resolve, reject) => {
    const ps = spawn('powershell.exe', [
      '-NoProfile',
      '-Command',
      `Copy-Item -Path '${path.join(cmdExtractTemp, 'cmdline-tools', '*')}' -Destination '${cmdToolsDir}' -Recurse -Force`,
    ], { stdio: 'inherit' });
    ps.on('close', (code) => {
      if (code === 0) {
        console.log('SDK cmdline-tools set up successfully in latest.');
        resolve();
      } else {
        reject(new Error(`Copy commandline tools failed with code ${code}`));
      }
    });
  });
}

main().catch(console.error);
