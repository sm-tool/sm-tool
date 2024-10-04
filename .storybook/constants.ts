export const STORYBOOK_MODES = {
  'dark desktop': {
    background: 'dark',
    theme: 'dark',
    viewport: 'large',
    locale: 'pl',
    reducedMotion: false,
  },
  'light desktop': {
    background: 'light',
    theme: 'light',
    viewport: 'large',
    locale: 'en',
    reducedMotion: false,
  },
  'dark desktop no-motion': {
    background: 'light',
    theme: 'light',
    viewport: 'large',
    locale: 'en',
    reducedMotion: true,
  },
};

export const STORYBOOK_SIZES = {
  small: { name: 'Small', styles: { width: '414px', height: '896px' } },
  large: { name: 'Large', styles: { width: '1024px', height: '768px' } },
};
