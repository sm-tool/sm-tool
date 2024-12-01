import ObjectTemplate, {
  ObjectTemplateProperties,
} from '@/components/feature/entity/object/object-template/index.tsx';
import { Meta, StoryFn as Story } from '@storybook/react';

export default {
  title: 'Features/Object/Template',
  component: ObjectTemplate,
  argTypes: {
    templates: [{ control: 'object' }],
  },
} as Meta;

const Template: Story<ObjectTemplateProperties> = arguments_ => (
  <ObjectTemplate {...arguments_} />
);

export const Actor = Template.bind({});
Actor.args = {
  templates: [
    {
      id: 1,
      title: 'limuzyna',
      attributeNames: [],
    },
    {
      id: 2,
      title: 'opancerzony',
      attributeNames: [],
    },
    {
      id: 2,
      title: 'na benzynę',
      attributeNames: [],
    },
    {
      id: 2,
      title: 'lorem ipsum',
      attributeNames: [],
    },
  ],
};
