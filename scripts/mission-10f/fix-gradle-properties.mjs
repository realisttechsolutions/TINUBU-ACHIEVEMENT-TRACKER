import { writeFileSync } from 'node:fs';
import path from 'node:path';

const ANDROID_ROOT = 'c:\\Users\\DELL\\Documents\\111 ANTI & CODEX\\TINUBU ACHIEVEMENTS TRACKER-ANTIGRAVITY-M10JD2\\android';

const gradlePropsContent = `# Project-wide Gradle settings.
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
`;

writeFileSync(path.join(ANDROID_ROOT, 'ptat-public', 'gradle.properties'), gradlePropsContent, 'utf8');
writeFileSync(path.join(ANDROID_ROOT, 'ptat-admin', 'gradle.properties'), gradlePropsContent, 'utf8');

console.log('gradle.properties created for ptat-public and ptat-admin with android.useAndroidX=true.');
