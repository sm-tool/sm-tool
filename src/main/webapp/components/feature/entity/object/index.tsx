import EntityWrapper from '@/components/feature/entity/!shared/entity-wrapper';
import Attribute from '@/components/feature/entity/attriubute';
import ObjectTemplate from '@/components/feature/entity/object/object-template';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { QdsObject, qdsObjectSchema } from '@/features/object/entity';
import { cn } from '@nextui-org/theme';

const typeStyles: Record<
  string,
  { className: string; clipPath?: string; tooltipPadding: string }
> = {
  custom: { className: `bg-default-200/40`, tooltipPadding: 'left-4' },
  actor: { className: `rounded-full bg-red-200/40`, tooltipPadding: 'left-12' },
  vehicle: {
    className: `rounded-tr-full bg-purple-200/40`,
    tooltipPadding: 'left-4',
  },
  resource: {
    clipPath: 'polygon(90%_0%,100%_50%,90%_100%,10%_100%,0%_50%,0%_0%)',
    className: `bg-green-200/40`,
    tooltipPadding: 'left-16',
  },
  place: {
    clipPath: 'polygon(100%_0%,100%_50%,90%_100%,10%_100%,0_50%,0_0%)',
    className: `bg-fuchsia-200/40`,
    tooltipPadding: 'left-4',
  },
  building: {
    clipPath: 'polygon(0%_10%,10%_0%,90%_0%,100%_10%,100%_100%,0%_100%)',
    className: `bg-amber-200/40`,
    tooltipPadding: 'left-16',
  },
};

export type EntityObjectProperties = {
  object: QdsObject;
};

const EntityObject = ({ object }: EntityObjectProperties) => {
  const objectType = object.type.title || 'custom';
  const typeStyle = typeStyles[objectType];

  return (
    <EntityWrapper
      entity={object}
      schema={qdsObjectSchema}
      tooltipClassName={typeStyle.tooltipPadding}
    >
      <div
        className={cn(
          `absolute inset-0 scale-[1.005] bg-black/20 [clip-path:${typeStyle.clipPath}] `,
          typeStyle.className,
        )}
      />
      <Card
        className={cn(
          typeStyle.className,
          `flex flex-col items-center text-center p-2 w-[32rem] border-none
          [clip-path:${typeStyle.clipPath}]`,
          object.type.color,
        )}
      >
        <p
          className='absolute -top-[40px] mx-auto transition-all animate-in slide-in-from-bottom
            hidden group-hover/wrapper:flex rounded-t-xl p-2 bg-[inherit]'
        >
          {object.type.title}
        </p>
        <ObjectTemplate templates={object.templates} />
        <p className='text-xl font-bold'>{object.name}</p>
        {object.attributes.map((attribute, index) => (
          <Attribute key={index} attribute={attribute} />
        ))}
      </Card>
    </EntityWrapper>
  );
};

export default EntityObject;
