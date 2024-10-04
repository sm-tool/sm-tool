import { cn } from '@nextui-org/theme';
import {
  forwardRef,
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...properties }, reference) => (
    <div className='relative w-full overflow-auto'>
      <table
        ref={reference}
        className={cn('w-full caption-bottom text-sm', className)}
        {...properties}
      />
    </div>
  ),
);
Table.displayName = 'Table';

const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...properties }, reference) => (
  <thead
    ref={reference}
    className={cn('[&_tr]:border-b', className)}
    {...properties}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...properties }, reference) => (
  <tbody
    ref={reference}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...properties}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...properties }, reference) => (
  <tfoot
    ref={reference}
    className={cn(
      'border-t bg-neutral-200/50 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...properties}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(({ className, ...properties }, reference) => (
  <tr
    ref={reference}
    className={cn(
      `border-b transition-colors hover:bg-neutral-200/50
      data-[state=selected]:bg-neutral-200`,
      className,
    )}
    {...properties}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...properties }, reference) => (
  <th
    ref={reference}
    className={cn(
      `h-12 px-4 text-left align-middle font-medium text-neutral-600
      [&:has([role=checkbox])]:pr-0`,
      className,
    )}
    {...properties}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...properties }, reference) => (
  <td
    ref={reference}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...properties}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...properties }, reference) => (
  <caption
    ref={reference}
    className={cn('mt-4 text-sm text-neutral-600', className)}
    {...properties}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
