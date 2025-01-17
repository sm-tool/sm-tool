import R500 from '@/app/errors/500/index.tsx';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'app/errors/R500',
  component: R500,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Error page displayed when encountered critical error on page',
      },
    },
  },
  tags: ['error-pages'],
} satisfies Meta<typeof R500>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Story: Story = {
  args: {},
};
