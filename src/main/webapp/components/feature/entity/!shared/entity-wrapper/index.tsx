import { todoToast } from '@/components/ui/shadcn/toaster.tsx';
import useFormStore from '@/stores/form';
import useInterfaceStore, { QdsSelectables } from '@/stores/interface';
import { cn } from '@nextui-org/theme';
import { Pencil, Trash2 } from 'lucide-react';
import { z } from 'zod';

interface EntityWrapperProperties {
  entity: QdsSelectables;
  schema: z.ZodObject<z.ZodRawShape>;
  children: React.ReactNode;
  tooltipClassName?: string;
}

const EntityWrapper = ({
  entity,
  schema,
  children,
  tooltipClassName,
}: EntityWrapperProperties) => {
  const { setSelectedElement } = useInterfaceStore();
  const { createEditForm } = useFormStore();

  return (
    <div
      className='group/wrapper relative min-w-[16rem] w-fit mt-12 cursor-pointer'
      onClick={() => {
        setSelectedElement(entity);
      }}
    >
      <div
        className={cn(
          `absolute -top-[40px] left-3 transition-all animate-in slide-in-from-bottom
          hidden group-hover/wrapper:flex`,
          tooltipClassName,
        )}
      >
        {[
          {
            icon: Pencil,
            className:
              'bg-blue-200/60 border-blue-700/20 text-blue-700 rounded-tl-xl',
            onClick: () => {
              createEditForm(schema, entity!);
              todoToast('Edytowanie do forma, czyli formy');
            },
          },
          {
            icon: Trash2,
            className:
              'bg-red-200/60 border-red-700/20 text-red-700 rounded-tr-xl',
            onClick: () => {
              todoToast('usuwanie z promptami');
            },
          },
        ].map((button, index) => (
          <button role='button' className='flex w-8' key={index}>
            <button.icon
              className={cn(
                `flex-shrink-0 px-[2px] py-[6px] h-fit w-[inherit] hover:border-3 transition-all
                duration-75 `,
                button.className,
              )}
              onClick={button.onClick}
            />
          </button>
        ))}
      </div>
      {children}
    </div>
  );
};

export default EntityWrapper;
