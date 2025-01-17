import { cn } from '@nextui-org/theme';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { BaseMenuProperties } from '@/lib/actions/types.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';
import { Card } from '@/components/ui/shadcn/card.tsx';
import React from 'react';

export interface ActionButtonsProperties<T> extends BaseMenuProperties<T> {
  direction?: 'horizontal' | 'vertical';
  className?: string;
  children?: React.ReactNode;
}
/**
 * Grupa przycisków akcji wyświetlanych w formie karty z tooltipami.
 * Każdy przycisk zawiera ikonę i wyświetla tooltip z opisem akcji po najechaniu.
 *
 * @template T - Typ elementu, na którym wykonywane są akcje
 * @param {Object} props
 * @param {Array<{
 *   label: string,
 *   onClick: (item: T) => void,
 *   Icon: React.ComponentType
 * }>} props.actions - Tablica akcji do wyświetlenia jako przyciski. Każda akcja zawiera:
 *   - label: tekst wyświetlany w tooltipie
 *   - onClick: funkcja wywoływana po kliknięciu, otrzymuje item jako parametr
 *   - Icon: komponent ikony do wyświetlenia na przycisku
 * @param {T} props.item - Element, na którym wykonywane będą akcje
 * @param {'horizontal' | 'vertical'} props.direction - Kierunek układu przycisków (domyślnie: 'horizontal')
 * @param {string} props.className - Dodatkowe klasy CSS dla kontenera
 * @param {boolean} props.disabled - Czy przyciski są wyłączone
 * @param {React.ReactNode} props.children - Opcjonalne dodatkowe przyciski do wyświetlenia na końcu grupy
 *
 * @example
 * const actions = [
 *   {
 *     label: 'Edit',
 *     onClick: (document) => console.log('Edit', document),
 *     Icon: PencilIcon
 *   },
 *   {
 *     label: 'Share',
 *     onClick: (document) => console.log('Share', document),
 *     Icon: ShareIcon
 *   }
 * ];
 *
 * <RudButtonGroup
 *   actions={actions}
 *   item={document}
 *   direction="horizontal"
 *   disabled={false}
 * >
 *   <Button variant="ghost">
 *     <DownloadIcon className="size-4" />
 *   </Button>
 * </RudButtonGroup>
 */
export const RudButtonGroupCard = ({
  direction = 'horizontal',
  className,
  children,
}: {
  direction?: 'horizontal' | 'vertical';
  className?: string;
  children: React.ReactNode;
}) => (
  <Card
    className={cn(
      'bg-content1 w-fit rounded-lg p-2',
      {
        'flex flex-row gap-2': direction === 'horizontal',
        'flex flex-col gap-2': direction === 'vertical',
      },
      className,
    )}
  >
    {children}
  </Card>
);

const RudButtonGroup = <T,>({
  actions,
  item,
  direction = 'horizontal',
  className,
  disabled,
  children: customButtons,
}: ActionButtonsProperties<T>) => {
  return (
    <RudButtonGroupCard className={className} direction={direction}>
      {actions.map((action, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              key={index}
              onClick={() => action.onClick(item)}
              disabled={disabled}
              className='hover:bg-content3'
            >
              <action.Icon className='size-4 flex-shrink-0' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{action.label}</TooltipContent>
        </Tooltip>
      ))}
      {customButtons}
    </RudButtonGroupCard>
  );
};

export default RudButtonGroup;
