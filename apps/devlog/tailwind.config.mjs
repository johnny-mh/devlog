import typography from '@tailwindcss/typography'
import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'

delete colors.lightBlue
delete colors.warmGray
delete colors.trueGray
delete colors.coolGray
delete colors.blueGray

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  plugins: [typography],
  theme: {
    colors: {
      ...colors,
      'th-bg': 'rgb(var(--color-bg) / <alpha-value>)',
      'th-bg-highlight': 'rgb(var(--color-bg-highlight) / <alpha-value>)',
      'th-bg-secondary': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
      'th-border': 'rgb(var(--color-border) / <alpha-value>)',
      'th-highlight': 'rgb(var(--color-highlight) / <alpha-value>)',
      'th-text': 'rgb(var(--color-text) / <alpha-value>)',
      'th-text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
    },

    container: {
      center: true,
      screens: {
        lg: '1000px',
        md: '100%',
        sm: '100%',
      },
    },

    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
      },
      fontFamily: {
        sans: ['Pretendard', ...defaultTheme.fontFamily.sans],
      },
    },

    fontFamily: {
      sans: ['Pretendard', 'sans-serif'],
      sg: ['Space Grotesk', 'sans-serif'],
    },

    screens: {
      lg: '1200px',
      md: '810px',
      sm: '390px',
    },
  },
}
