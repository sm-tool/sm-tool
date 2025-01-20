// import React from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/shadcn/dialog.tsx';
// import { Button } from '@/components/ui/shadcn/button.tsx';
// import { Plus } from 'lucide-react';
//
// interface ReferencePickerProperties<T> {
//   value?: T;
//   renderItem: (item: T) => React.ReactNode;
//   getItemId: (item: T) => number;
//   children: React.ReactNode;
// }
//
// const ReferencePickerWithQuery = <T,>({
//   value,
//   renderItem,
//   getItemId,
//   children,
// }: ReferencePickerProperties<T>) => {
//   const [selectedItem, setSelectedItem] = React.useState<T | undefined>(value);
//   const [isOpen, setIsOpen] = React.useState(false);
//
//   // const handleSelect = (item: T) => {
//   //   const id = getItemId(item);
//   //   setSelectedItem(item);
//   //   setIsOpen(false);
//   // };
//
//   // TODO PRZEKAZAĆ CHILDREN
//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button variant='outline'>
//           {selectedItem ? (
//             <>{renderItem(selectedItem)}</>
//           ) : (
//             <>
//               <Plus className='mr-2 h-4 w-4' />
//               Select Object
//             </>
//           )}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className='max-w-2xl'>
//         <DialogHeader>
//           <DialogTitle>Select Object</DialogTitle>
//         </DialogHeader>
//         <div className='space-y-4'>
//           <div className='h-[500px] overflow-y-auto'>{children}</div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
//
// export default ReferencePickerWithQuery;
