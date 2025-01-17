import { Meta, StoryObj } from '@storybook/react';
import DateTimePicker2 from '@/components/ui/common/input/date-time-picker2/index.tsx';

const meta = {
  title: 'Components/ui/DateTimePicker',
  component: DateTimePicker2,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'date',
      description: 'Initial date and time value',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DateTimePicker2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // @ts-expect-error -- głupoty gada
  args: {
    value: new Date().toISOString(),
  },
};

export const Empty: Story = {
  // @ts-expect-error -- głupoty gada
  args: {
    value: undefined,
  },
};

export const WithPresetDate: Story = {
  // @ts-expect-error -- głupoty gada
  args: {
    value: new Date(2024, 0, 1, 12, 0, 0).toISOString(), // 1 stycznia 2024, 12:00:00
  },
};
