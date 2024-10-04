import { QdsObjectTemplate } from '@/models/object/entity';
import { cn } from '@nextui-org/theme';

const typeStyles = {
  default: `bg-content2`,
  actor: `bg-red-200 border-red-700/20`,
  building: `bg-amber-200 border-amber-700/20`,
  vehicle: `bg-blue-200 border-amber-700/20`,
  resource: `bg-green-200 border-green-700/20`,
  place: `bg-purple-200 border-purple-700/20`,
};

type ObjectTemplateType = keyof typeof typeStyles;

export interface ObjectTemplateProperties {
  template: QdsObjectTemplate;
  className?: string;
}

const ObjectTemplate = ({ template, className }: ObjectTemplateProperties) => {
  const templateType = (template.title as ObjectTemplateType) || 'default';
  const typeStyle = typeStyles[templateType];

  return (
    <div
      className={cn(
        typeStyle,
        `inline-block max-w-[8rem] border-1 z-10 rounded-xl overflow-hidden
        group-hover/wrapper:overflow-visible break-words transition-all max-h-[2rem]
        group-hover/wrapper:max-h-[1000px] px-4`,
        className,
      )}
    >
      <p>{template.title}</p>
    </div>
  );
};

export default ObjectTemplate;
