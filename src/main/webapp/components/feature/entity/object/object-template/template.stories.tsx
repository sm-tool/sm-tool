import ObjectTemplate, {
  ObjectTemplateProperties,
} from '@/components/feature/entity/object/object-template/index.tsx';
import { Meta, StoryFn as Story } from '@storybook/react';

export default {
  title: 'Features/Object/Template',
  component: ObjectTemplate,
  argTypes: {
    template: { control: 'object' },
  },
} as Meta;

const Template: Story<ObjectTemplateProperties> = arguments_ => (
  <ObjectTemplate {...arguments_} />
);

export const Actor = Template.bind({});
Actor.args = {
  template: {
    id: 1,
    title: 'actor',
    attributeNames: [],
  },
};

export const Building = Template.bind({});
Building.args = {
  template: {
    id: 1,
    title: 'building',
    attributeNames: [],
  },
};

export const Vehicle = Template.bind({});
Vehicle.args = {
  template: {
    id: 1,
    title: 'vehicle',
    attributeNames: [],
  },
};

export const Resource = Template.bind({});
Resource.args = {
  template: {
    id: 1,
    title: 'resource',
    attributeNames: [],
  },
};

export const Place = Template.bind({});
Place.args = {
  template: {
    id: 1,
    title: 'place',
    attributeNames: [],
  },
};
