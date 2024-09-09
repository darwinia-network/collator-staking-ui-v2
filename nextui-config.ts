import type { NextUIPluginConfig } from '@nextui-org/react';

export const nextUIConfig: NextUIPluginConfig = {
  layout: {
    radius: {
      small: '0.3125rem', // rounded-small
      medium: '0.625rem', // rounded-medium
      large: '1.25rem' // rounded-large
    },
    fontSize: {
      tiny: '0.75rem', // text-tiny
      small: '0.875rem', // text-small
      medium: '0.875rem', // text-medium
      large: '1.125rem' // text-large
    },
    lineHeight: {
      tiny: '1rem', // text-tiny
      small: '1.5rem', // text-small
      medium: '1.5rem', // text-medium
      large: '1.75rem' // text-large
    },
    borderWidth: {
      small: '1px', // border-small
      medium: '1px', // border-medium (default)
      large: '2px' // border-large
    }
  },
  themes: {
    light: {
      colors: {
        // default: {
        //   DEFAULT: '#F2F3F5'
        // },
        secondary: {
          DEFAULT: '#F2F3F5'
        },
        content3: {
          DEFAULT: '#F2F3F5'
        },
        focus: {
          DEFAULT: '#ff58c3'
        },
        primary: {
          DEFAULT: '#FF0083',
          100: '#ffc6ed',
          200: '#ff98dc',
          300: '#ff58c3',
          400: '#ff27a8',
          500: '#FF0083',
          600: '#df0066',
          700: '#b80055',
          800: '#980349',
          900: '#5f0028'
        },
        success: {
          DEFAULT: '#5ED62A'
        },
        background: {
          DEFAULT: '#fff'
        },
        foreground: {
          DEFAULT: '#121619'
        },
        divider: '#1216191A'
      }
    },
    dark: {
      colors: {
        default: {
          100: '#333'
        },
        secondary: {
          DEFAULT: '#121619'
        },
        content3: {
          DEFAULT: '#F2F3F5'
        },
        focus: {
          DEFAULT: '#ff58c3'
        },
        primary: {
          DEFAULT: '#FF0083',
          100: '#ffc6ed',
          200: '#ff98dc',
          300: '#ff58c3',
          400: '#ff27a8',
          500: '#FF0083',
          600: '#df0066',
          700: '#b80055',
          800: '#980349',
          900: '#5f0028'
        },
        success: {
          DEFAULT: '#5ED62A'
        },
        background: {
          DEFAULT: '#242A2E'
        },
        foreground: {
          DEFAULT: '#ffffff'
        },
        divider: '#ffffff1A'
      }
    }
  }
};
