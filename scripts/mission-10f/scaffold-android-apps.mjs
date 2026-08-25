import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ANDROID_ROOT = 'c:\\Users\\DELL\\Documents\\111 ANTI & CODEX\\TINUBU ACHIEVEMENTS TRACKER-ANTIGRAVITY-M10JD2\\android';

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function scaffoldApp({
  appDirName,
  applicationId,
  appName,
  startUrl,
  primaryColor,
  accentColor,
  iconLabel,
  isAdministrative,
}) {
  const appRoot = path.join(ANDROID_ROOT, appDirName);
  const srcMain = path.join(appRoot, 'app', 'src', 'main');
  const javaDir = path.join(srcMain, 'java', ...applicationId.split('.'));
  const resDir = path.join(srcMain, 'res');
  const layoutDir = path.join(resDir, 'layout');
  const valuesDir = path.join(resDir, 'values');
  const drawableDir = path.join(resDir, 'drawable');
  const mipmapDir = path.join(resDir, 'mipmap-xxxhdpi');

  ensureDir(javaDir);
  ensureDir(layoutDir);
  ensureDir(valuesDir);
  ensureDir(drawableDir);
  ensureDir(mipmapDir);

  // 1. Root settings.gradle
  writeFileSync(
    path.join(appRoot, 'settings.gradle'),
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "${appDirName}"
include ':app'
`,
    'utf8'
  );

  // 2. Root build.gradle
  writeFileSync(
    path.join(appRoot, 'build.gradle'),
    `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.2'
    }
}
`,
    'utf8'
  );

  // 3. app/build.gradle
  writeFileSync(
    path.join(appRoot, 'app', 'build.gradle'),
    `plugins {
    id 'com.android.application'
}

android {
    namespace '${applicationId}'
    compileSdk 34

    defaultConfig {
        applicationId "${applicationId}"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "0.9.0-staging"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables.useSupportLibrary = true
    }

    buildTypes {
        release {
            minifyEnabled false
            debuggable false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            debuggable true
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
    implementation 'androidx.webkit:webkit:1.10.0'
}
`,
    'utf8'
  );

  // 4. app/proguard-rules.pro
  writeFileSync(
    path.join(appRoot, 'app', 'proguard-rules.pro'),
    `# Proguard rules for PTAT Android shell
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
`,
    'utf8'
  );

  // 5. AndroidManifest.xml
  writeFileSync(
    path.join(srcMain, 'AndroidManifest.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="false"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.PTAT"
        android:usesCleartextTraffic="false">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize|screenLayout"
            android:launchMode="singleTop"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
    'utf8'
  );

  // 6. res/values/strings.xml
  writeFileSync(
    path.join(valuesDir, 'strings.xml'),
    `<resources>
    <string name="app_name">${appName}</string>
    <string name="start_url">${startUrl}</string>
</resources>
`,
    'utf8'
  );

  // 7. res/values/colors.xml
  writeFileSync(
    path.join(valuesDir, 'colors.xml'),
    `<resources>
    <color name="primary">${primaryColor}</color>
    <color name="accent">${accentColor}</color>
    <color name="background_dark">#020617</color>
    <color name="surface_dark">#0f172a</color>
    <color name="gold">#eab308</color>
</resources>
`,
    'utf8'
  );

  // 8. res/values/themes.xml
  writeFileSync(
    path.join(valuesDir, 'themes.xml'),
    `<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.PTAT" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorSecondary">@color/accent</item>
        <item name="android:statusBarColor">@color/background_dark</item>
        <item name="android:navigationBarColor">@color/background_dark</item>
        <item name="android:windowLightStatusBar" tools:targetApi="m">false</item>
    </style>
</resources>
`,
    'utf8'
  );

  // 9. res/layout/activity_main.xml
  writeFileSync(
    path.join(layoutDir, 'activity_main.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/background_dark">

    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipeRefreshLayout"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <WebView
            android:id="@+id/webView"
            android:layout_width="match_parent"
            android:layout_height="match_parent" />

    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>

    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="3dp"
        android:indeterminate="false"
        android:max="100"
        android:progressDrawable="@drawable/progress_bar_custom"
        android:visibility="gone"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
`,
    'utf8'
  );

  // 10. res/drawable/progress_bar_custom.xml
  writeFileSync(
    path.join(drawableDir, 'progress_bar_custom.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:id="@android:id/background">
        <shape>
            <solid android:color="#00000000" />
        </shape>
    </item>
    <item android:id="@android:id/progress">
        <clip>
            <shape>
                <solid android:color="@color/accent" />
            </shape>
        </clip>
    </item>
</layer-list>
`,
    'utf8'
  );

  // 11. MainActivity.java
  writeFileSync(
    path.join(javaDir, 'MainActivity.java'),
    `package ${applicationId};

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private SwipeRefreshLayout swipeRefreshLayout;
    private ProgressBar progressBar;
    private static final String START_URL = "${startUrl}";
    private static final String HOST_DOMAIN = "tat-staging--tinubu-achievement-stg.us-central1.hosted.app";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        progressBar = findViewById(R.id.progressBar);

        configureWebViewSettings();
        configureClients();

        swipeRefreshLayout.setColorSchemeResources(R.color.accent, R.color.primary);
        swipeRefreshLayout.setOnRefreshListener(() -> webView.reload());

        // Android OnBackPressed dispatcher for modern Android back-navigation
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                }
            }
        });

        if (savedInstanceState == null) {
            webView.loadUrl(START_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    private void configureWebViewSettings() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        // User-Agent marker for PTAT Android packaging identification
        String defaultUa = settings.getUserAgentString();
        settings.setUserAgentString(defaultUa + " PTAT-Android/${isAdministrative ? 'Admin' : 'Public'}/0.9.0");

        // Enable Cookies (including 3rd-party auth session persistence)
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            cookieManager.setAcceptThirdPartyCookies(webView, true);
        }
    }

    private void configureClients() {
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost();

                if (host != null && (host.equals(HOST_DOMAIN) || host.endsWith("firebaseapp.com") || host.endsWith("google.com"))) {
                    return false; // Load inside WebView
                }

                // External URLs open in default Android browser
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                    startActivity(intent);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                if (newProgress >= 100) {
                    progressBar.setVisibility(View.GONE);
                }
            }
        });
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }
}
`,
    'utf8'
  );
}

async function main() {
  console.log('Scaffolding Android Projects for PTAT Public and PTAT Admin...');

  // 1. App A — Public
  await scaffoldApp({
    appDirName: 'ptat-public',
    applicationId: 'com.realisttech.ptat',
    appName: 'PTAT',
    startUrl: 'https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app/',
    primaryColor: '#059669', // Emerald
    accentColor: '#10b981',
    iconLabel: 'PTAT',
    isAdministrative: false,
  });
  console.log(' - ptat-public project scaffolded.');

  // 2. App B — Admin
  await scaffoldApp({
    appDirName: 'ptat-admin',
    applicationId: 'com.realisttech.ptat.admin',
    appName: 'PTAT Admin',
    startUrl: 'https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app/admin/login',
    primaryColor: '#7e22ce', // Purple
    accentColor: '#a855f7',
    iconLabel: 'PTAT ADMIN',
    isAdministrative: true,
  });
  console.log(' - ptat-admin project scaffolded.');

  console.log('\nBoth Android projects scaffolded successfully!');
}

main().catch(console.error);
