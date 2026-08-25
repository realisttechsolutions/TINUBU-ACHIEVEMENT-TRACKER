import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ANDROID_ROOT = 'c:\\Users\\DELL\\Documents\\111 ANTI & CODEX\\TINUBU ACHIEVEMENTS TRACKER-ANTIGRAVITY-M10JD2\\android';

function configureSplash(appDirName, isAdministrative) {
  const resDir = path.join(ANDROID_ROOT, appDirName, 'app', 'src', 'main', 'res');
  const drawableDir = path.join(resDir, 'drawable');
  const valuesDir = path.join(resDir, 'values');

  if (!existsSync(drawableDir)) mkdirSync(drawableDir, { recursive: true });
  if (!existsSync(valuesDir)) mkdirSync(valuesDir, { recursive: true });

  // 1. res/drawable/splash_layer.xml
  writeFileSync(
    path.join(drawableDir, 'splash_layer.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item>
        <color android:color="@color/background_dark" />
    </item>
    <item
        android:width="180dp"
        android:height="180dp"
        android:gravity="center"
        android:drawable="@drawable/splash_logo" />
</layer-list>
`,
    'utf8'
  );

  // 2. res/values/themes.xml
  const primaryColor = isAdministrative ? '@color/primary' : '@color/primary';
  writeFileSync(
    path.join(valuesDir, 'themes.xml'),
    `<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.PTAT" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">${primaryColor}</item>
        <item name="colorSecondary">@color/accent</item>
        <item name="android:statusBarColor">@color/background_dark</item>
        <item name="android:navigationBarColor">@color/background_dark</item>
        <item name="android:windowLightStatusBar" tools:targetApi="m">false</item>
        <item name="android:windowBackground">@drawable/splash_layer</item>
    </style>
</resources>
`,
    'utf8'
  );

  // 3. Update MainActivity.java to switch window background to solid after webView attaches
  // The layout activity_main.xml already has android:background="@color/background_dark"
}

function main() {
  console.log('Configuring native splash screens for PTAT Public and Admin...');
  configureSplash('ptat-public', false);
  configureSplash('ptat-admin', true);
  console.log('Native splash screens configured successfully.');
}

main();
