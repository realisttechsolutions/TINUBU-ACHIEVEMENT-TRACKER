# Proguard rules for PTAT Android shell
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
