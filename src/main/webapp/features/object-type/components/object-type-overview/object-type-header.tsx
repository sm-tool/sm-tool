import { CardTitle } from '@/components/ui/shadcn/card.tsx';
import { ObjectType } from '@/features/object-type/types.ts';
import ObjectTypeDialogs from '@/features/object-type/components/object-type-overview/object-type-dialogs.tsx';

const ObjectTypeHeader = ({ data }: { data: ObjectType }) => {
  const canDelete = !data.hasChildren && !data.isBaseType;

  return (
    <div className='grid grid-cols-[1fr_auto] gap-4 items-start w-full'>
      <CardTitle
        className='text-xl sm:text-2xl flex items-center gap-2 border-l-4 pl-2 truncate'
        style={{
          borderColor: data.color,
        }}
      >
        {data.title}
      </CardTitle>
      <ObjectTypeDialogs values={data} canDelete={canDelete} />
    </div>
  );
};

export default ObjectTypeHeader;
