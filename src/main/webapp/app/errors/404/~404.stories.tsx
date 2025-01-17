import R404 from '@/app/errors/404/index.tsx';
import { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';

const meta = {
  title: 'app/errors/R404',
  component: R404,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Error page displayed when requested resource cannot be found',
      },
    },
    controls: {
      disabled: true,
    },
  },
  tags: ['error-pages'],
} satisfies Meta<typeof R404>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('404')).toBeInTheDocument();
    await expect(
      canvas.getByText('It looks like this page does not exists'),
    ).toBeInTheDocument();

    const homeLink = canvas.getByRole('link', {
      name: /Go back to main page/i,
    });
    await expect(homeLink).toBeInTheDocument();
    await expect(homeLink).toHaveAttribute('href', '/home/scenarios');
  },
};
