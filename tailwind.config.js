/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            colors: {
                brand: {
                    50: '#F4F3FF', // Very light purple
                    100: '#EBE9FE',
                    200: '#D9D6FE',
                    300: '#BDB4FE',
                    400: '#9B8AFB',
                    500: '#7B57FB',
                    600: '#593CFB', // Primary "Comfort Purple" (Turo-ish)
                    700: '#4926D8',
                    800: '#3D22AE',
                    900: '#101828', // Rich Black for headings
                },
                gray: {
                    900: '#101828', // Untitled UI Black
                    800: '#1D2939',
                    700: '#344054',
                    600: '#475467',
                    50: '#667085',
                    400: '#98A2B3',
                    300: '#D0D5DD', // Border colors
                    200: '#EAECF0',
                    100: '#F2F4F7',
                    50: '#F9FAFB',
                }
            },
            boxShadow: {
                'xs': '0px 1px 2px rgba(16, 24, 40, 0.05)',
                'sm': '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)',
                'md': '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
                'lg': '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
                'xl': '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
            }
        },
    },
    plugins: [],
}
