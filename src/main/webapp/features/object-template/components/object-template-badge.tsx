import { ObjectTemplate } from '@/features/object-template/types.ts';
import { Badge } from '@/components/ui/shadcn/badge.tsx';
import { getContrastColor } from '@/utils/color/get-contrast-color.ts';
import { cn } from '@nextui-org/theme';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { useObjectTemplate } from '@/features/object-template/queries.ts';

export const ObjectTemplateBadge = ({
  templateId,
  className,
}: {
  templateId: number;
  className?: string;
}) => (
  <StatusComponent<ObjectTemplate> useQuery={useObjectTemplate(templateId)}>
    {objectTemplate => (
      <Badge
        style={{
          color: getContrastColor(objectTemplate!.color),
          backgroundColor: objectTemplate!.color,
          borderColor: getContrastColor(objectTemplate!.color),
        }}
        className={cn('truncate max-w-full', className)}
      >
        {objectTemplate!.title}
      </Badge>
    )}
  </StatusComponent>
);

export default ObjectTemplateBadge;
