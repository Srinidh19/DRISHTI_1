/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#111315',
          darker: '#0b0c0e',
        },
        surface: {
          DEFAULT: '#181b1f',
          2: '#20242a',
          3: '#282d35',
        },
        border: {
          DEFAULT: '#30353b',
          muted: '#24282e',
          active: '#48505a',
        },
        text: {
          DEFAULT: '#e5e7eb',
          muted: '#8d949d',
          dim: '#636a73',
        },
        critical: {
          DEFAULT: '#c93c3c',
          bg: '#2d1414',
          border: '#6b2020',
          text: '#fca5a5',
        },
        warning: {
          DEFAULT: '#c28a28',
          bg: '#2d2212',
          border: '#6d4e16',
          text: '#fcd34d',
        },
        success: {
          DEFAULT: '#3f8f68',
          bg: '#12261c',
          border: '#22523b',
          text: '#86efac',
        },
        info: {
          DEFAULT: '#477da8',
          bg: '#142330',
          border: '#244863',
          text: '#93c5fd',
        }
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': '0.65rem',
        'xs': '0.75rem',
        'sm': '0.8125rem',
        'base': '0.875rem',
        'md': '0.9375rem',
        'lg': '1.0625rem',
        'xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
