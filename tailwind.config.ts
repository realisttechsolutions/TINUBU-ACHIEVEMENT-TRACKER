
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Official Constitution Design Tokens (Section 5)
				gov: {
					navy: "#081B2E",      // Presidential Navy
					emerald: "#006B3F",   // Nigeria Emerald
					gold: "#C5A059",      // Refined Gold
					canvas: "#F7F8F4",    // Warm Canvas
					surface: "#FFFFFF",   // Pure Surface
					text: "#101828",      // Deep Text
					slate: "#5E6B78",     // Secondary Slate
					border: "#D8DEE6",    // Soft Border
					darkSurface: "#071522", // Dark Surface
				},
				// Controlled Semantic Status Colors (Section 5)
				status: {
					green: "#006B3F",     // Verified positive progress, completed or operational
					blue: "#0284C7",      // Informational, provisional or institutionally reported
					gold: "#C5A059",      // Targets, milestones, featured national achievements
					amber: "#D97706",     // Caution, partial delivery or pending verification
					red: "#DC2626",       // Correction, decline, risk or unavailable
					slate: "#5E6B78",     // Neutral, archived or N/A
				},
				// Backwards compatibility mappings for legacy UI components
				brand: {
					navy: "#081B2E",
					blue: "#081B2E",      // Map legacy blue to Presidential Navy
					gold: "#C5A059",      // Map legacy gold to Refined Gold
					emerald: "#006B3F",   // Nigeria Emerald
					purple: "#081B2E",    // Replaced dominant purple with Presidential Navy
					"light-purple": "#F7F8F4", // Replaced with Warm Canvas
					"dark-blue": "#081B2E",
					"sovereign-green": "#006B3F",
					"sovereign-dark": "#004D25",
					"sovereign-gold": "#C5A059",
					"sovereign-light": "#E6F4EA"
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					"0%": {
						opacity: "0",
						transform: "translateY(10px)"
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)"
					}
				},
				'slide-in-right': {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.6s ease-out',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				display: ['Manrope', 'sans-serif'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
