import { Meta, StoryObj } from '@storybook/react';
import ColorPicker from '@/components/ui/common/input/color-picker/index.tsx';

const meta = {
  title: 'components/ui/ColorPicker',
  component: ColorPicker,
  argTypes: {
    value: {
      control: 'text',
      description: 'HEX color value',
    },
    name: {
      control: 'text',
      description: 'Input field name',
    },
  },
  tags: ['component'],
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorPickerStory: Story = {
  name: 'Default',
  args: {
    value: '#FF0000',
    name: 'color',
  },
};

export const EmptyColorPicker: Story = {
  name: 'Empty',
  args: {
    name: 'color',
  },
};
