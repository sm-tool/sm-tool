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

export const Vehicle = Template.bind({});
Vehicle.args = {
  object: {
    id: 0,
    name: 'Limuzyna 1',
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
    type: {
      id: 0,
      title: 'vehicle',
    },
    attributes: [],
  },
};

export const Actor = Template.bind({});
Actor.args = {
  object: {
    id: 0,
    name: 'Drużyna strażacka - Jeżyce',
    templates: [
      {
        id: 1,
        title: 'drużyna strażacka',
        attributeNames: [],
      },
      {
        id: 2,
        title: 'wyszkolenie ',
        attributeNames: [],
      },
    ],
    type: {
      id: 0,
      title: 'actor',
    },
    attributes: [],
  },
};

export const Building = Template.bind({});
Building.args = {
  object: {
    id: 0,
    name: 'Budynek',
    templates: [
      {
        id: 1,
        title: 'Laur dewelopera',
        attributeNames: [],
      },
      {
        id: 2,
        title: 'whopping 8m kwadratowych ',
        attributeNames: [],
      },
    ],
    type: {
      id: 0,
      title: 'building',
      isGlobal: true,
    },
    attributes: [],
  },
};

export const Resource = Template.bind({});
Resource.args = {
  object: {
    id: 0,
    name: 'Gaśnica',
    templates: [
      {
        id: 1,
        title: '4 lata gwarancji',
        attributeNames: [],
      },
    ],
    type: {
      id: 0,
      title: 'resource',
    },
    attributes: [],
  },
};

export const Place = Template.bind({});
Place.args = {
  object: {
    id: 0,
    name: 'Odległe miejsce',
    templates: [
      {
        id: 1,
        title: 'Daleko stąd',
        attributeNames: [],
      },
    ],
    type: {
      id: 0,
      title: 'place',
      isGlobal: true,
    },
    attributes: [],
  },
};

export const Custom = Template.bind({});
Custom.args = {
  object: {
    id: 0,
    name: 'Specjalna gaśnica',
    templates: [
      {
        id: 1,
        title: 'Super++',
        attributeNames: [],
      },
    ],
    type: {
      id: 0,
      title: 'custom',
    },
    attributes: [],
  },
};
