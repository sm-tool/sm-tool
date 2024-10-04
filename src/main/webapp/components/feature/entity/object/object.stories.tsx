import EntityObject, {
  EntityObjectProperties,
} from '@/components/feature/entity/object/index.tsx';
import { Meta, StoryFn as Story } from '@storybook/react';

export default {
  title: 'Features/Object',
  component: EntityObject,
  argTypes: {
    object: { control: 'object' },
  },
} as Meta;

const Template: Story<EntityObjectProperties> = arguments_ => (
  <EntityObject {...arguments_} />
);

export const Default = Template.bind({});
Default.args = {
  object: {
    id: 0,
    name: 'Drużyna Jeżyce',
    template: {
      id: 0,
      title: 'actor',
      attributeNames: [],
    },
    type: {
      id: 0,
      title: 'actor',
      color: 'bg-red-200/40',
      isGlobal: false,
    },
    attributes: [],
  },
};
