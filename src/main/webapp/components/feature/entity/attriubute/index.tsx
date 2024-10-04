import EntityWrapper from '@/components/feature/entity/!shared/entity-wrapper';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { QdsAttribute } from '@/models/attribute/entity';

export type AttributeProperties = {
  attribute: QdsAttribute;
};

const EntityAttribute = ({ attribute }: AttributeProperties) => {
  return (
    <EntityWrapper entity={attribute}>
      <Card className='w-[20rem]'>
        <div className='flex flex-col items-center text-center -mt-4'>
          <span
            className='inline-block max-w-[8rem] border-1 z-10 rounded-xl bg-content2 overflow-hidden
              group-hover/wrapper:overflow-visible break-words mb-2 transition-all
              max-h-[2rem] group-hover/wrapper:max-h-[1000px] px-1'
          >
            {attribute.name}
          </span>
          <div className='w-full px-3 pb-3'>
            <p
              className='w-full hyphens-auto transition-all line-clamp-2
                group-hover/wrapper:line-clamp-none'
            >
              {attribute.value}
            </p>
          </div>
        </div>
      </Card>
    </EntityWrapper>
  );
};

export default EntityAttribute;
