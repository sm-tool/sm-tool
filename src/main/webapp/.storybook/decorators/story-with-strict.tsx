import { Decorator } from '@storybook/react';
import { StrictMode } from 'react';

export const storyWithStrict: Decorator = Story => (
  <StrictMode>
    <Story />
  </StrictMode>
);
