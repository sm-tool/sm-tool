import { QdsObjectTemplate } from '@/features/object/entity';
import { cn } from '@nextui-org/theme';

export interface ObjectTemplateProperties {
  templates: QdsObjectTemplate[];
  className?: string;
}

const ObjectTemplate = ({ templates, className }: ObjectTemplateProperties) => {
  return (
    <div
      className='grid-cols-3 grid-rows-1 gap-3 max-h-[1.5rem] group-hover/wrapper:max-h-[1000px]
        text-sm text-center animate-in fade-in grid group-hover/wrapper:grid
        group-hover/wrapper:grid-rows-none transition-all
        [&:has(>:nth-child(1):last-child)]:grid-cols-1
        [&:has(>:nth-child(2):last-child)]:grid-cols-2'
    >
      {templates.map((template, index) => (
        <p
          key={index}
          className={cn(
            `max-w-[6rem] border-1 z-10 rounded-xl overflow-hidden min-h-[1.5rem]
            group-hover/wrapper:overflow-visible break-words hyphens-auto
            group-hover/wrapper:max-h-[1000px] px-2 border-default-300/60 bg-content2`,
            className,
            index > 2 ? 'hidden group-hover/wrapper:block' : '',
          )}
        >
          {template.title}
        </p>
      ))}
    </div>
  );
};

export default ObjectTemplate;
