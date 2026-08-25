import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ANDROID_ROOT = 'c:\\Users\\DELL\\Documents\\111 ANTI & CODEX\\TINUBU ACHIEVEMENTS TRACKER-ANTIGRAVITY-M10JD2\\android';

function generateIconsForApp(appDirName, isAdministrative) {
  const resDir = path.join(ANDROID_ROOT, appDirName, 'app', 'src', 'main', 'res');
  const anydpiDir = path.join(resDir, 'mipmap-anydpi-v26');
  const drawableDir = path.join(resDir, 'drawable');

  if (!existsSync(anydpiDir)) mkdirSync(anydpiDir, { recursive: true });
  if (!existsSync(drawableDir)) mkdirSync(drawableDir, { recursive: true });

  // 1. Adaptive Icon definition
  writeFileSync(
    path.join(anydpiDir, 'ic_launcher.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`,
    'utf8'
  );

  writeFileSync(
    path.join(anydpiDir, 'ic_launcher_round.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`,
    'utf8'
  );

  // 2. Background
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

  // 3. Foreground Emblem
  const primaryBrandColor = isAdministrative ? '#a855f7' : '#10b981';
  const secondaryColor = '#eab308'; // Gold

  writeFileSync(
    path.join(drawableDir, 'ic_launcher_foreground.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <!-- Emblem Shield Outer Ring -->
    <path
        android:strokeColor="${primaryBrandColor}"
        android:strokeWidth="3.5"
        android:fillColor="#00000000"
        android:pathData="M54,20 L80,32 L80,60 C80,76 68,88 54,92 C40,88 28,76 28,60 L28,32 Z" />

    <!-- Inner Gold Accents -->
    <path
        android:strokeColor="${secondaryColor}"
        android:strokeWidth="1.5"
        android:fillColor="#00000000"
        android:pathData="M54,26 L74,36 L74,58 C74,71 64,82 54,85 C44,82 34,71 34,58 L34,36 Z" />

    <!-- Center Emblem Star / Eagle Crest -->
    <path
        android:fillColor="${secondaryColor}"
        android:pathData="M54,38 L57,47 L66,47 L59,53 L61,62 L54,56 L47,62 L49,53 L42,47 L51,47 Z" />
</vector>
`,
    'utf8'
  );
}

function main() {
  console.log('Generating adaptive Android icons for PTAT Public and Admin apps...');
  generateIconsForApp('ptat-public', false);
  generateIconsForApp('ptat-admin', true);
  console.log('Adaptive launcher icons generated successfully!');
}

main();
