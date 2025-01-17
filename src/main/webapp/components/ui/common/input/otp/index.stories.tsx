import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  OTPGroup,
  OTPInput,
  OTPSeparator,
  OTPSlot,
} from '@/components/ui/common/input/otp/otp.tsx';

const OTPStory = () => {
  const [value, setValue] = React.useState('000000');

  return (
    <OTPInput value={value} onChange={setValue}>
      <OTPGroup>
        <OTPSlot index={0} />
        <OTPSlot index={1} />
      </OTPGroup>
      <OTPSeparator>:</OTPSeparator>
      <OTPGroup>
        <OTPSlot index={2} />
        <OTPSlot index={3} />
      </OTPGroup>
      <OTPSeparator>:</OTPSeparator>
      <OTPGroup>
        <OTPSlot index={4} />
        <OTPSlot index={5} />
      </OTPGroup>
    </OTPInput>
  );
};

const meta = {
  title: 'Components/ui/OTPInput',
  component: OTPStory,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof OTPStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
