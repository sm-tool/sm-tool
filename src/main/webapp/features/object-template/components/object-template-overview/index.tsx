import { ObjectTemplate } from '@/features/object-template/types.ts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card.tsx';
import Separator from '@/components/ui/shadcn/separator.tsx';
import { AttributeButtonFormOnGlobalPage } from '@/features/attribute-template/components/attribute-template-button-form/attribute-template-button-form.tsx';
import AttributeTemplateGroupCard from '@/features/attribute-template/components/attribute-template-group-card';
import ObjectTypeLink from '@/features/object-type/components/object-type-link';
import ObjectTemplateDialogs from '@/features/object-template/components/object-template-overview/object-template-dialogs.tsx';

const ObjectTemplateOverview = ({ data }: { data: ObjectTemplate }) => {
  return (
    <div className='w-full h-full space-y-4 @container'>
      <Card className='h-full'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div className='flex-1 truncate'>
            <div className='grid grid-cols-[1fr_auto] gap-4 items-start w-full'>
              <CardTitle
                className='text-xl sm:text-2xl flex items-center gap-2 border-l-4 pl-2 truncate'
                style={{
                  borderColor: data.color,
                }}
              >
                {data.title}
              </CardTitle>

              <ObjectTemplateDialogs data={data} />
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <h3
              className='text-sm font-medium text-default-500 @[300px]:text-sm @[200px]:text-xs
                @[100px]:text-xs'
            >
              Description
            </h3>
            <p className='mt-1 line-clamp-2 @[300px]:text-sm @[200px]:text-xs @[100px]:text-xs'>
              {data.description || 'No description provided'}
            </p>
          </div>
          <Separator />
          <div className='grid grid-cols-3 gap-4'>
            <div>
              <h3 className='text-sm font-medium text-default-500'>
                Object Type
              </h3>
              <ObjectTypeLink
                objectTypeId={data.objectTypeId}
                className='max-w-2xl'
              />
            </div>
          </div>
          <div className='flex flex-row justify-between items-center'>
            <h3 className='text-xl font-bold @[300px]:text-lg @[200px]:text-base @[100px]:text-sm'>
              Template Attributes
            </h3>
            <AttributeButtonFormOnGlobalPage objectTemplateId={data.id} />
          </div>
          <Card className='bg-content3 p-4'>
            <AttributeTemplateGroupCard templateId={data.id} />
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectTemplateOverview;
