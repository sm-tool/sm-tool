import { ObjectType } from '@/features/object-type/types.ts';
import ObjectTypeLink from '@/features/object-type/components/object-type-link';

const ObjectTypeDetails = ({ data }: { data: ObjectType }) => {
  return (
    <div className='grid grid-cols-3 gap-4'>
      <div>
        <h3 className='text-sm font-medium text-default-500'>Parent Type</h3>
        {data.parentId ? (
          <ObjectTypeLink objectTypeId={data.parentId} />
        ) : (
          'No parent type'
        )}
      </div>
      <div className='sm:col-span-2'>
        <h3 className='text-sm font-medium text-default-500'>Status</h3>
        <div className='flex gap-4 mt-1'>
          <div className='flex items-center gap-2'>
            <div
              className={`w-2 h-2 rounded-full ${data.hasChildren ? 'bg-success' : 'bg-default-200'}`}
            />
            <span>{data.hasChildren ? 'Has subtypes' : 'No subtypes'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectTypeDetails;
