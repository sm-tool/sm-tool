type ObjectTypeId = 1 | 2 | 3 | 4 | 5 | 6;
type ObjectTypeName =
  | 'building'
  | 'actor'
  | 'resource'
  | 'vehicle'
  | 'place'
  | 'observer'
  | 'custom';

const mapIdToObjectType = (id: number): ObjectTypeName => {
  const typeMap: Record<ObjectTypeId, ObjectTypeName> = {
    1: 'actor',
    2: 'observer',
    3: 'building',
    4: 'vehicle',
    5: 'resource',
    6: 'place',
  };

  return typeMap[id as ObjectTypeId] || 'custom';
};

export const getObjectTypeStyle = (id: number) => {
  const typeName = mapIdToObjectType(id);
  return objectTypeStyles[typeName];
};

export const objectTypeStyles: Record<
  string,
  { className: string; clipPath?: string; tooltipPadding: string }
> = {
  custom: { className: `bg-default-200/40`, tooltipPadding: 'left-4' },
  actor: {
    className: `rounded-full !bg-red-200/40`,
    tooltipPadding: 'left-12',
  },
  vehicle: {
    className: `rounded-tr-full !bg-purple-200/40`,
    tooltipPadding: 'left-4',
  },
  resource: {
    clipPath: 'polygon(90%_0%,100%_50%,90%_100%,10%_100%,0%_50%,0%_0%)',
    className: `!bg-green-200/40`,
    tooltipPadding: 'left-16',
  },
  place: {
    clipPath: 'polygon(100%_0%,100%_50%,90%_100%,10%_100%,0_50%,0_0%)',
    className: `!bg-fuchsia-200/40`,
    tooltipPadding: 'left-4',
  },
  building: {
    clipPath: 'polygon(0%_10%,10%_0%,90%_0%,100%_10%,100%_100%,0%_100%)',
    className: `!bg-amber-200/40`,
    tooltipPadding: 'left-16',
  },
  observer: {
    className: `rounded-md !bg-sky-200/40`,
    tooltipPadding: 'left-12',
  },
};
