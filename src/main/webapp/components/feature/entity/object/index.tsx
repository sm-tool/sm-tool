import EntityWrapper from '@/components/feature/entity/!shared/entity-wrapper';
import Attribute from '@/components/feature/entity/attriubute';
import ObjectTemplate from '@/components/feature/entity/object/object-template';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { QdsObject } from '@/models/object/entity';
import { cn } from '@nextui-org/theme';

const typeStyles = {
  custom: `bg-[#bdbdbd]`,
  actor: `rounded-full bg-[#fba7a7]`,
  building: `[clip-path:polygon(0%_10%,10%_0%,90%_0%,100%_10%,100%_100%,0%_100%)] bg-[#fbeea7]`,
  vehicle: `rounded-tr-full bg-[#a7b9fb]`,
  resource: `[clip-path:polygon(90%_0,100%_50%,90%_100%,10%_100%,0_50%,10%_0)] bg-[#a7fbaf]`,
  place: `[clip-path:polygon(100%_0,100%_50%,90%_100%,10%_100%,0_50%,0_0)] bg-[#d6a7fb]`,
};

type ObjectType = keyof typeof typeStyles;

export interface EntityObjectProperties {
  object: QdsObject;
}

const EntityObject = ({ object }: EntityObjectProperties) => {
  const objectType = (object.template?.title as ObjectType) || 'custom';
  const typeStyle = typeStyles[objectType];

  const typeIsCustom = objectType === 'custom';

  return (
    <EntityWrapper entity={object} tooltipClassName='right-8'>
      <Card
        className={cn(
          typeStyle,
          'flex flex-col items-center text-center p-2 w-[26rem]',
          object.type.color,
        )}
      >
        <ObjectTemplate
          template={object.template}
          className='hidden group-hover/wrapper:flex'
        />
        <p className='text-xl font-bold'>{object.name}</p>
        {object.attributes.map((attribute, index) => (
          <Attribute key={index} attribute={attribute} />
        ))}
      </Card>
    </EntityWrapper>
  );
};

export default EntityObject;
