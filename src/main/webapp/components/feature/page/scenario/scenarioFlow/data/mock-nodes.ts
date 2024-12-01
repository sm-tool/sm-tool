import { EntityObjectProperties } from '@/components/feature/entity/object';

export const mockNodes = [
  {
    id: '1',
    position: { x: 250, y: 0 },
    type: 'object',
    data: {
      object: {
        id: 1,
        name: 'Limuzyna 2',
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
          title: 'custom',
        },
        attributes: [],
      },
    } as EntityObjectProperties,
  },
  {
    id: '2',
    position: { x: 0, y: 300 },
    type: 'object',
    data: {
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
          title: 'custom',
        },
        attributes: [],
      },
    } as EntityObjectProperties,
  },
];
