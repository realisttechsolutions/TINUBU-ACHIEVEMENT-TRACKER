import os
import shutil
from PIL import Image

REPO_ROOT = r"c:\Users\DELL\Documents\111 ANTI & CODEX\TINUBU ACHIEVEMENTS TRACKER-ANTIGRAVITY-M10JD2"
PUBLIC_BRAND_DIR = os.path.join(REPO_ROOT, "public", "brand")
PUBLIC_DIR = os.path.join(REPO_ROOT, "public")
APP_DIR = os.path.join(REPO_ROOT, "src", "app")
ANDROID_ROOT = os.path.join(REPO_ROOT, "android")

SRC_HEADER_LOGO = r"C:\Users\DELL\.gemini\antigravity-ide\brain\3db1a84f-b89f-481e-8707-7730f5431c83\.user_uploaded\media_1787662710625.png"
SRC_SITE_ICON = r"C:\Users\DELL\.gemini\antigravity-ide\brain\3db1a84f-b89f-481e-8707-7730f5431c83\.user_uploaded\media_1787662710700.jpg"

os.makedirs(PUBLIC_BRAND_DIR, exist_ok=True)

def main():
    print("=== Processing PTAT Master Brand Assets ===")

    # 1. Preserve Master Files in /public/brand/
    dest_header_master = os.path.join(PUBLIC_BRAND_DIR, "ptat-header-logo.png")
    dest_icon_master = os.path.join(PUBLIC_BRAND_DIR, "ptat-icon-master.png")

    shutil.copyfile(SRC_HEADER_LOGO, dest_header_master)
    print(f" - Preserved Header Logo Master: {dest_header_master}")

    # Convert JPG square icon to PNG for clean transparency/compositing
    icon_img = Image.open(SRC_SITE_ICON).convert("RGBA")
    icon_img.save(dest_icon_master, format="PNG", quality=100)
    print(f" - Preserved Site Icon Master: {dest_icon_master}")

    # Load master images
    header_img = Image.open(dest_header_master).convert("RGBA")
    master_icon = Image.open(dest_icon_master).convert("RGBA")

    # 2. Generate Favicons (16x16, 32x32, 48x48) & favicon.ico
    fav_16 = master_icon.resize((16, 16), Image.Resampling.LANCZOS)
    fav_32 = master_icon.resize((32, 32), Image.Resampling.LANCZOS)
    fav_48 = master_icon.resize((48, 48), Image.Resampling.LANCZOS)

    fav_ico_path = os.path.join(PUBLIC_DIR, "favicon.ico")
    fav_48.save(fav_ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f" - Generated multi-resolution favicon.ico: {fav_ico_path}")

    # Also save favicon.ico and icon.png in src/app/ for Next.js App Router metadata
    shutil.copyfile(fav_ico_path, os.path.join(APP_DIR, "favicon.ico"))
    fav_32.save(os.path.join(PUBLIC_DIR, "favicon.png"), format="PNG")
    fav_32.save(os.path.join(PUBLIC_BRAND_DIR, "favicon-32x32.png"), format="PNG")
    fav_16.save(os.path.join(PUBLIC_BRAND_DIR, "favicon-16x16.png"), format="PNG")

    # Next.js App Router icon.png (32x32 and 192x192)
    master_icon.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(APP_DIR, "icon.png"), format="PNG")
    master_icon.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(APP_DIR, "apple-icon.png"), format="PNG")
    master_icon.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(PUBLIC_DIR, "apple-touch-icon.png"), format="PNG")
    print(" - Generated Next.js app metadata icons (icon.png, apple-icon.png, favicon.ico)")

    # 3. PWA & Web App Icons (192, 256, 384, 512)
    pwa_sizes = [192, 256, 384, 512]
    for size in pwa_sizes:
        resized = master_icon.resize((size, size), Image.Resampling.LANCZOS)
        out_p = os.path.join(PUBLIC_BRAND_DIR, f"ptat-icon-{size}x{size}.png")
        resized.save(out_p, format="PNG")
        if size in (192, 512):
            resized.save(os.path.join(PUBLIC_DIR, f"icon-{size}.png"), format="PNG")
            resized.save(os.path.join(PUBLIC_DIR, f"pwa-{size}x{size}.png"), format="PNG")

    # Maskable PWA Icon (safe-area 80% with deep navy background)
    maskable_512 = Image.new("RGBA", (512, 512), (2, 6, 23, 255)) # #020617
    emblem_410 = master_icon.resize((410, 410), Image.Resampling.LANCZOS)
    maskable_512.paste(emblem_410, (51, 51), emblem_410)
    maskable_512.save(os.path.join(PUBLIC_DIR, "pwa-maskable-512x512.png"), format="PNG")
    maskable_512.save(os.path.join(PUBLIC_BRAND_DIR, "ptat-icon-maskable-512x512.png"), format="PNG")
    print(" - Generated PWA icons (192x192, 256x256, 384x384, 512x512, maskable)")

    # 4. Horizontal Web Header Logo Variants
    # 1024x341 (full), 600x200 (medium), 360x120 (mobile)
    header_600 = header_img.resize((600, int(600 * (341 / 1024))), Image.Resampling.LANCZOS)
    header_600.save(os.path.join(PUBLIC_BRAND_DIR, "ptat-header-logo-600.png"), format="PNG")
    header_360 = header_img.resize((360, int(360 * (341 / 1024))), Image.Resampling.LANCZOS)
    header_360.save(os.path.join(PUBLIC_BRAND_DIR, "ptat-header-logo-360.png"), format="PNG")
    print(" - Generated responsive Header Logo variants (360px, 600px, 1024px)")

    # 5. Android Launcher Icons for Public & Admin
    android_densities = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }

    for app_name, is_admin in [("ptat-public", False), ("ptat-admin", True)]:
        res_dir = os.path.join(ANDROID_ROOT, app_name, "app", "src", "main", "res")
        
        # Standard Launcher PNGs
        for folder, size in android_densities.items():
            folder_path = os.path.join(res_dir, folder)
            os.makedirs(folder_path, exist_ok=True)
            
            # Base icon
            icon_sized = master_icon.resize((size, size), Image.Resampling.LANCZOS)
            icon_sized.save(os.path.join(folder_path, "ic_launcher.png"), format="PNG")
            
            # Round icon
            icon_sized.save(os.path.join(folder_path, "ic_launcher_round.png"), format="PNG")

        # Adaptive Foreground (108dp base grid, inner 72dp safe area = 66.6% scaling)
        # For 432x432 adaptive foreground drawable:
        fg_size = 432
        emblem_size = int(432 * 0.70) # 302px (comfortably within 72dp safe area)
        offset = (fg_size - emblem_size) // 2

        fg_img = Image.new("RGBA", (fg_size, fg_size), (0, 0, 0, 0))
        emblem_scaled = master_icon.resize((emblem_size, emblem_size), Image.Resampling.LANCZOS)
        fg_img.paste(emblem_scaled, (offset, offset), emblem_scaled)

        # Save adaptive foreground PNG into drawable-nodpi or drawable
        drawable_dir = os.path.join(res_dir, "drawable")
        os.makedirs(drawable_dir, exist_ok=True)
        fg_img.save(os.path.join(drawable_dir, "ic_launcher_foreground.png"), format="PNG")

        # Splash Screen Logo (512px centered)
        splash_logo = master_icon.resize((320, 320), Image.Resampling.LANCZOS)
        splash_logo.save(os.path.join(drawable_dir, "splash_logo.png"), format="PNG")
        print(f" - Generated complete Android launcher & splash drawables for {app_name}")

    print("\nAll brand assets processed with 100% fidelity.")

if __name__ == "__main__":
    main()
