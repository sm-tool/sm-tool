import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@nextui-org/theme';
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  HTMLAttributes,
} from 'react';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...properties }, reference) => (
  <DialogPrimitive.Overlay
    ref={reference}
    className={cn(
      `fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in
      data-[state=closed]:animate-out data-[state=closed]:fade-out-0
      data-[state=open]:fade-in-0`,
      className,
    )}
    {...properties}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

export const dialogContentStaticClasses =
  'grid gap-4 border bg-background text-card-foreground p-7 shadow-lg rounded-3xl';

export const dialogPrimitiveCloseStaticClasses =
  'absolute right-4 top-4 rounded-2xl opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-default-200 data-[state=open]:text-default-600';

const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...properties }, reference) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={reference}
      className={cn(
        `fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%]
        translate-y-[-50%] duration-200 data-[state=open]:animate-in
        data-[state=closed]:animate-out data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95
        data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2
        data-[state=closed]:slide-out-to-top-[48%]
        data-[state=open]:slide-in-from-left-1/2
        data-[state=open]:slide-in-from-top-[48%]`,
        dialogContentStaticClasses,
        className,
      )}
      {...properties}
    >
      {children}
      <DialogPrimitive.Close className={dialogPrimitiveCloseStaticClasses}>
        <XIcon className='h-4 w-4' />
        <span className='sr-only'>Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = 'DialogContent';

export const dialogHeaderStaticClasses =
  'flex flex-col space-y-1.5 text-center sm:text-left';

const DialogHeader = ({
  className,
  ...properties
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(dialogHeaderStaticClasses, className)} {...properties} />
);

export const dialogFooterStaticClasses =
  'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2';

const DialogFooter = ({
  className,
  ...properties
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(dialogFooterStaticClasses, className)} {...properties} />
);

export const dialogTitleStaticClasses =
  'text-4xl font-semibold tracking-normal font-display';

const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...properties }, reference) => {
  return (
    <DialogPrimitive.Title
      ref={reference}
      className={cn(dialogTitleStaticClasses, className)}
      {...properties}
    />
  );
});
DialogTitle.displayName = 'DialogTitle';

export const dialogDescriptionStaticClasses = 'text-sm text-default-600';

const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...properties }, reference) => (
  <DialogPrimitive.Description
    ref={reference}
    className={cn(dialogDescriptionStaticClasses, className)}
    {...properties}
  />
));
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
