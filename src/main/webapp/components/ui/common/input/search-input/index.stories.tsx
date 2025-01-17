import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import SearchInput from '@/components/ui/common/input/search-input/index.tsx';

const SearchInputStory = () => {
  const [value, setValue] = React.useState('');

  return <SearchInput value={value} onChange={setValue} />;
};

const meta = {
  title: 'Components/ui/SearchInput',
  component: SearchInputStory,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SearchInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
