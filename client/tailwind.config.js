/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#090d16',
                card: 'rgba(17, 24, 39, 0.7)',
                accent: '#6366f1',
            }
        },
    },
    plugins: [],
}