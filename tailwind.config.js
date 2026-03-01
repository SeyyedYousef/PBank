/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--bg-background) / <alpha-value>)",
                surface: "rgb(var(--bg-surface) / <alpha-value>)",
                'surface-light': "rgb(var(--bg-surface-light) / <alpha-value>)",
                primary: {
                    DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
                    glow: "#BF55EC",
                    dark: "#4B0096",
                },
                success: {
                    DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
                    dark: "#00C070",
                },
                error: {
                    DEFAULT: "rgb(var(--color-error) / <alpha-value>)",
                    glow: "rgba(255, 46, 99, 0.5)",
                },
                warning: {
                    DEFAULT: "#FFC700", // Neon Yellow
                    glow: "rgba(255, 199, 0, 0.5)",
                },
                glass: {
                    stroke: "rgba(255, 255, 255, 0.1)",
                    surface: "rgba(255, 255, 255, 0.05)",
                    highlight: "rgba(255, 255, 255, 0.2)",
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Fallback
                persian: ['Vazirmatn', 'sans-serif'], // Primary for Persian
            },
            boxShadow: {
                'glow-primary': '0 0 20px rgba(127, 0, 255, 0.3)',
                'glow-success': '0 0 20px rgba(0, 255, 148, 0.3)',
                'glow-error': '0 0 20px rgba(255, 46, 99, 0.3)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'glass-inset': 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #7F00FF 0deg, #BF55EC 180deg, #7F00FF 360deg)',
            },
            borderRadius: {
                'squircle': '32px',
                'item': '20px',
            },
            blur: {
                'huge': '100px',
                'mega': '150px',
                'ultra': '200px',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'shimmer': 'shimmer 2.5s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'shake': 'shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', filter: 'blur(10px)' },
                    '100%': { opacity: '1', filter: 'blur(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-4px)' },
                    '75%': { transform: 'translateX(4px)' },
                }
            }
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                '.text-glow': {
                    'text-shadow': '0 0 10px rgba(127, 0, 255, 0.5), 0 0 20px rgba(127, 0, 255, 0.3)',
                },
                '.text-glow-success': {
                    'text-shadow': '0 0 10px rgba(0, 255, 148, 0.5), 0 0 20px rgba(0, 255, 148, 0.3)',
                },
                '.text-glow-error': {
                    'text-shadow': '0 0 10px rgba(255, 46, 99, 0.5), 0 0 20px rgba(255, 46, 99, 0.3)',
                },
                '.glass-panel': {
                    'background': 'rgba(255, 255, 255, 0.05)',
                    'backdrop-filter': 'blur(16px)',
                    '-webkit-backdrop-filter': 'blur(16px)',
                    'border': '1px solid rgba(255, 255, 255, 0.1)',
                },
                '.glass-heavy': {
                    'background': 'rgba(18, 11, 31, 0.7)',
                    'backdrop-filter': 'blur(24px)',
                    '-webkit-backdrop-filter': 'blur(24px)',
                    'border': '1px solid rgba(255, 255, 255, 0.08)',
                }
            })
        }
    ],
}
