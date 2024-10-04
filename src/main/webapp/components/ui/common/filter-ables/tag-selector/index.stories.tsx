import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { TagSelector } from './index';
import { within } from '@storybook/test';
import { Tag } from '@/components/ui/common/filter-ables/tag-selector';

export default {
  title: 'Components/TagSelector',
  component: TagSelector,
  argTypes: {
    onTagToggle: { action: 'tag toggled' },
  },
} as Meta;

const Template: StoryFn = arguments_ => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags(previous =>
      previous.includes(tag)
        ? previous.filter(id => id !== tag)
        : [...previous, tag],
    );
  };

  return (
    <TagSelector
      tags={sampleTags}
      {...arguments_}
      selectedTags={selectedTags}
      onTagToggle={handleTagToggle}
    />
  );
};

const sampleTags = [
  { name: 'React' },
  { name: 'TypeScript' },
  { name: 'JavaScript' },
  { name: 'Node.js' },
  { name: 'Express' },
  { name: 'MongoDB' },
  { name: 'GraphQL' },
  { name: 'Redux' },
  { name: 'Next.js' },
  { name: 'Tailwind CSS' },
];

export const Default = Template.bind({});
Default.args = {
  tags: sampleTags,
};

export const WithPreselectedTags = Template.bind({});
WithPreselectedTags.args = {
  tags: sampleTags,
};
WithPreselectedTags.decorators = [
  Story => {
    const [selectedTags, setSelectedTags] = useState(['1', '3', '5']);
    return <Story args={{ selectedTags, setSelectedTags }} />;
  },
];

export const ManyTags = Template.bind({});
ManyTags.args = {
  tags: [
    ...sampleTags,
    { id: '11', name: 'Vue.js' },
    { id: '12', name: 'Angular' },
    { id: '13', name: 'Svelte' },
    { id: '14', name: 'Docker' },
    { id: '15', name: 'Kubernetes' },
    { id: '16', name: 'AWS' },
    { id: '17', name: 'Firebase' },
    { id: '18', name: 'Jest' },
    { id: '19', name: 'Cypress' },
    { id: '20', name: 'Storybook' },
  ],
};

export const EmptyState = Template.bind({});
EmptyState.args = {
  tags: [],
};

export const LongTagNames = Template.bind({});
LongTagNames.args = {
  tags: [
    { id: '1', name: 'Very Long Tag Name That Might Wrap' },
    { id: '2', name: 'Another Extremely Long Tag Name for Testing Purposes' },
    { id: '3', name: 'Short Tag' },
    { id: '4', name: 'Medium Length Tag Name' },
    { id: '5', name: 'Supercalifragilisticexpialidocious' },
  ],
};

export const WithSearchFocus = Template.bind({});
WithSearchFocus.args = {
  tags: sampleTags,
};
WithSearchFocus.play = ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const searchInput = canvas.getByPlaceholderText('Search tags...');
  searchInput.focus();
};
