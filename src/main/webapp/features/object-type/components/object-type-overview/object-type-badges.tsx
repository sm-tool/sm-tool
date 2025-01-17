import { ObjectType } from '@/features/object-type/types.ts';
import { Badge } from '@/components/ui/shadcn/badge.tsx';

const ObjectTypeBadges = ({ data }: { data: ObjectType }) => (
  <div className='flex flex-wrap gap-2 mt-2'>
    {data.isBaseType && <Badge variant='secondary'>Base Type</Badge>}
    {data.isOnlyGlobal && (
      <Badge className='text-default-100'>Global Only</Badge>
    )}
    {data.canBeUser && <Badge variant='outline'>Can Be User</Badge>}
  </div>
);
export default ObjectTypeBadges;
