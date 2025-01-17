'use client';

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { SquareMinus, SquarePlus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area.tsx';
import { cn } from '@nextui-org/theme';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { ObjectType } from '@/features/object-type/types.ts';
import { getContrastColor } from '@/utils/color/get-contrast-color.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';

type ObjectTypeTreeViewElement = {
  object: ObjectType;
  children?: ObjectTypeTreeViewElement[];
};

type TreeContextProperties = {
  selectedId: number | undefined;
  expandedItems: number[] | undefined;
  handleExpand: (id: number) => void;
  selectItem: (id: number) => void;
  setExpandedItems: (items: number[]) => void;
  indicator: boolean;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  getParent: (
    element: ObjectTypeTreeViewElement,
  ) => ObjectTypeTreeViewElement | undefined;
  globalsBlocked: boolean;
};

const TreeContext = createContext<TreeContextProperties | undefined>(undefined);

const useObjectTypeTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};

type TreeViewComponentProperties = React.HTMLAttributes<HTMLDivElement>;

type TreeViewProperties = {
  initialSelectedId?: number;
  indicator?: boolean;
  elements?: ObjectTypeTreeViewElement[];
  initialExpandedItems?: number[];
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  onChange?: (value?: number) => void;
  onCancel?: () => void;
  getParent: (
    element: ObjectTypeTreeViewElement,
  ) => ObjectTypeTreeViewElement | undefined;
  globalsBlocked?: boolean;
} & TreeViewComponentProperties;

const ObjectTypeTreePartial = forwardRef<HTMLDivElement, TreeViewProperties>(
  (properties_, reference) => {
    const {
      className,
      elements,
      initialSelectedId,
      initialExpandedItems,
      children,
      onChange,
      onCancel,
      indicator = true,
      openIcon,
      closeIcon,
      dir,
      getParent,
      globalsBlocked = false,
      ...properties
    } = properties_;

    const [selectedId, setSelectedId] = useState<number | undefined>(
      initialSelectedId,
    );
    const [expandedItems, setExpandedItems] = useState<number[] | undefined>(
      initialExpandedItems,
    );

    const selectItem = useCallback((id: number) => {
      setSelectedId(id);
    }, []);

    const handleUnselect = () => {
      setSelectedId(undefined);
    };

    const handleConfirm = () => {
      if (onChange) {
        onChange(selectedId);
      }
    };

    const handleExpand = useCallback((id: number) => {
      setExpandedItems(previous => {
        if (previous?.includes(id)) {
          return previous.filter(item => item !== id);
        }
        return [...(previous ?? []), id];
      });
    }, []);

    return (
      <TreeContext.Provider
        value={{
          selectedId,
          expandedItems,
          handleExpand,
          selectItem,
          setExpandedItems,
          indicator,
          openIcon,
          closeIcon,
          getParent,
          globalsBlocked,
        }}
      >
        <div className={cn('size-full', className)}>
          <ScrollArea ref={reference} className='h-full relative px-2'>
            <AccordionPrimitive.Root
              {...properties}
              type='multiple'
              defaultValue={expandedItems?.map(id => id.toString())}
              value={expandedItems?.map(id => id.toString())}
              className='flex flex-col gap-1'
              onValueChange={value =>
                setExpandedItems(value.map(v => Number.parseInt(v, 10)))
              }
            >
              {children}
            </AccordionPrimitive.Root>
          </ScrollArea>
        </div>
        <div className='flex flex-row gap-x-4 justify-between mt-4'>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <div className='flex flex-row gap-x-2'>
            <Button variant='outline' onClick={handleUnselect}>
              Unselect
            </Button>
            <Button variant='default' onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </TreeContext.Provider>
    );
  },
);

ObjectTypeTreePartial.displayName = 'ObjectTypeTree';

const TreeIndicator = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...properties }, reference) => {
  return (
    <div
      ref={reference}
      className={cn(
        `h-full w-px bg-muted absolute left-1.5 rtl:right-1.5 py-3 rounded-md
        hover:bg-slate-300 duration-300 ease-in-out`,
        className,
      )}
      {...properties}
    />
  );
});

TreeIndicator.displayName = 'TreeIndicator';

type FolderComponentProperties = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Item
>;

type FolderProperties = {
  expandedItems?: number[];
  element: ObjectTypeTreeViewElement;
  isSelectable?: boolean;
} & FolderComponentProperties;

const Folder = forwardRef<
  HTMLDivElement,
  FolderProperties & React.HTMLAttributes<HTMLDivElement>
>(
  (
    { className, element, isSelectable = true, children, ...properties },
    // @ts-expect-error -- neededd for forwardRef
    reference,
  ) => {
    const {
      handleExpand,
      expandedItems,
      indicator,
      setExpandedItems,
      selectedId,
      selectItem,
      globalsBlocked,
    } = useObjectTypeTree();

    const isSelected = selectedId === element.object.id;

    return (
      <AccordionPrimitive.Item
        {...properties}
        value={element.object.id.toString()}
        className='relative overflow-hidden h-full'
      >
        <div className='flex flex-row gap-x-2 items-center'>
          <Button
            className='p-0 h-4'
            variant='ghost'
            onClick={() => handleExpand(element.object.id)}
            disabled={!isSelectable}
          >
            {expandedItems?.includes(element.object.id) ? (
              <SquareMinus className='h-4 w-4 flex-shrink-0' />
            ) : (
              <SquarePlus className='h-4 w-4 flex-shrink-0' />
            )}
          </Button>

          <AccordionPrimitive.Trigger
            className={cn(
              'flex items-center gap-1 text-sm rounded-md',
              className,
              {
                'bg-default/20 rounded-md': isSelected && isSelectable,
                'cursor-pointer': isSelectable,
                'cursor-not-allowed opacity-50': !isSelectable,
              },
            )}
            onClick={() => selectItem(element.object.id)}
            disabled={
              !isSelectable || (globalsBlocked && element.object.isOnlyGlobal)
            }
          >
            <div className='flex flex-row gap-x-2 items-center'>
              {element.object.isOnlyGlobal ? (
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      className='size-5 rounded-full relative flex items-center justify-center'
                      style={{
                        backgroundColor: element.object.color ?? '#FFFFFF',
                        border: `1px solid ${getContrastColor(element.object.color)}`,
                      }}
                    >
                      <span
                        style={{
                          color: getContrastColor(element.object.color),
                        }}
                      >
                        G
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {globalsBlocked
                        ? 'Global type cannot be assigned to non global thread'
                        : 'This type has global scope'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div
                  className='size-5 rounded-full'
                  style={{
                    backgroundColor: element.object.color ?? '#FFFFFF',
                    border: `1px solid ${getContrastColor(element.object.color)}`,
                  }}
                />
              )}
              <span className='truncate'>{element.object.title}</span>
            </div>
          </AccordionPrimitive.Trigger>
        </div>
        <AccordionPrimitive.Content
          className='text-sm data-[state=closed]:animate-accordion-up
            data-[state=open]:animate-accordion-down relative overflow-hidden h-full'
        >
          {element && indicator && <TreeIndicator aria-hidden='true' />}
          <AccordionPrimitive.Root
            type='multiple'
            className='flex flex-col gap-1 py-1 ml-5 rtl:mr-5'
            defaultValue={expandedItems?.map(id => id.toString())}
            value={expandedItems?.map(id => id.toString())}
            onValueChange={value => {
              setExpandedItems(value.map(v => Number.parseInt(v, 10)));
            }}
          >
            {children}
          </AccordionPrimitive.Root>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    );
  },
);

Folder.displayName = 'Folder';

const File = forwardRef<
  HTMLButtonElement,
  {
    element: ObjectTypeTreeViewElement;
    className?: string;
    handleSelect?: (id: number) => void;
    isSelectable?: boolean;
    fileIcon?: React.ReactNode;
    children?: React.ReactNode;
  }
>(({ element, className, isSelectable = true }, reference) => {
  const { selectedId, selectItem, globalsBlocked } = useObjectTypeTree();
  const isSelected = selectedId === element.object.id;

  return (
    <AccordionPrimitive.Item
      value={element.object.id.toString()}
      className='relative'
    >
      <Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <AccordionPrimitive.Trigger
              ref={reference}
              className={cn(
                'flex items-center gap-1 text-sm rounded-md transition-200 transition-colors pr-4',
                className,
                {
                  'bg-default/40 rounded-md': isSelected && isSelectable,
                  'cursor-pointer': isSelectable,
                  'cursor-not-allowed opacity-50':
                    !isSelectable ||
                    (globalsBlocked && element.object.isOnlyGlobal),
                },
              )}
              onClick={() => selectItem(element.object.id)}
              disabled={
                !isSelectable || (globalsBlocked && element.object.isOnlyGlobal)
              }
            >
              <div className='flex flex-row gap-x-2 items-center'>
                {element.object.isOnlyGlobal ? (
                  globalsBlocked ? (
                    <div
                      className='size-5 rounded-full relative flex items-center justify-center'
                      style={{
                        backgroundColor: element.object.color ?? '#FFFFFF',
                        border: `1px solid ${getContrastColor(element.object.color)}`,
                      }}
                    >
                      <span
                        style={{
                          color: getContrastColor(element.object.color),
                        }}
                      >
                        G
                      </span>
                    </div>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className='size-5 rounded-full relative flex items-center justify-center'
                          style={{
                            backgroundColor: element.object.color ?? '#FFFFFF',
                            border: `1px solid ${getContrastColor(element.object.color)}`,
                          }}
                        >
                          <span
                            style={{
                              color: getContrastColor(element.object.color),
                            }}
                          >
                            G
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This type has global scope</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                ) : (
                  <div
                    className='size-5 rounded-full'
                    style={{
                      backgroundColor: element.object.color ?? '#FFFFFF',
                      border: `1px solid ${getContrastColor(element.object.color)}`,
                    }}
                  />
                )}
                <span className='truncate'>{element.object.title}</span>
              </div>
            </AccordionPrimitive.Trigger>
          </TooltipTrigger>
          {globalsBlocked && element.object.isOnlyGlobal && (
            <TooltipContent>
              <p>Global type cannot be assigned to non global thread</p>
            </TooltipContent>
          )}
        </Tooltip>

        {globalsBlocked && element.object.isOnlyGlobal && (
          <TooltipContent>
            <p>Global type cannot be assigned to non global thread</p>
          </TooltipContent>
        )}
      </Tooltip>
    </AccordionPrimitive.Item>
  );
});

File.displayName = 'File';

const CollapseButton = forwardRef<
  HTMLButtonElement,
  {
    elements: ObjectTypeTreeViewElement[];
    expandAll?: boolean;
  } & React.HTMLAttributes<HTMLButtonElement>
>(
  (
    { className, elements, expandAll = false, children, ...properties },
    reference,
  ) => {
    const { expandedItems, setExpandedItems } = useObjectTypeTree();

    const expendAllTree = useCallback(
      (elements: ObjectTypeTreeViewElement[]) => {
        const newExpandedItems: number[] = [];

        const expandTree = (element: ObjectTypeTreeViewElement) => {
          if (element.object.hasChildren) {
            newExpandedItems.push(element.object.id);
          }

          if (element.children?.length) {
            for (const child of element.children) {
              expandTree(child);
            }
          }
        };

        for (const element of elements) {
          expandTree(element);
        }

        setExpandedItems([...(expandedItems ?? []), ...newExpandedItems]);
      },
      [expandedItems],
    );

    const closeAll = useCallback(() => {
      setExpandedItems?.([]);
    }, []);

    useEffect(() => {
      if (expandAll) {
        expendAllTree(elements);
      }
    }, [expandAll]);

    return (
      <Button
        variant={'ghost'}
        className='h-8 w-fit p-1 absolute bottom-1 right-2'
        onClick={
          expandedItems && expandedItems.length > 0
            ? closeAll
            : () => expendAllTree(elements)
        }
        ref={reference}
        {...properties}
      >
        {children}
        <span className='sr-only'>Toggle</span>
      </Button>
    );
  },
);

CollapseButton.displayName = 'CollapseButton';

export {
  CollapseButton,
  useObjectTypeTree,
  File,
  Folder,
  ObjectTypeTreePartial,
  type ObjectTypeTreeViewElement,
};
