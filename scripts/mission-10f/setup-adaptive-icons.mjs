import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ANDROID_ROOT = 'c:\\Users\\DELL\\Documents\\111 ANTI & CODEX\\TINUBU ACHIEVEMENTS TRACKER-ANTIGRAVITY-M10JD2\\android';

function setupAdaptiveDrawables(appDirName, isAdministrative) {
  const resDir = path.join(ANDROID_ROOT, appDirName, 'app', 'src', 'main', 'res');
  const drawableDir = path.join(resDir, 'drawable');

  // Remove old ic_launcher_foreground.xml vector so the .png is prioritized or wrap in bitmap
  const oldXml = path.join(drawableDir, 'ic_launcher_foreground.xml');
  if (existsSync(oldXml)) unlinkSync(oldXml);

  // Background color XML
  const bgColor = isAdministrative ? '#0a0d18' : '#020617';
  writeFileSync(
    path.join(drawableDir, 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="${bgColor}"
        android:pathData="M0,0h108v108h-108z" />
</vector>
`,
    'utf8'
  );
}

function main() {
  setupAdaptiveDrawables('ptat-public', false);
  setupAdaptiveDrawables('ptat-admin', true);
  console.log('Adaptive icon drawables verified.');
}

main();
