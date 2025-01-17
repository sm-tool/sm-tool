// import { useAllTemplateAttributes } from '@/features/attribute-template/queries.ts';
// import StatusComponent from '@/components/ui/common/data-load-states/status-component';
// import { AttributeTemplate } from '@/features/attribute-template/types.ts';
// import { Card } from '@/components/ui/shadcn/card.tsx';
// import AttributeCardValue from '@/features/attribute/components/attribute-card-value';
//
// const InitialAttributeSetter = ({
//   typeId,
//   templateId,
// }: {
//   typeId: number;
//   templateId: number;
// }) => {
//   const attributeTemplatesQuery = useAllTemplateAttributes(templateId);
//
//   return (
//     <StatusComponent<AttributeTemplate[]> useQuery={attributeTemplatesQuery}>
//       {attributes => (
//         <div className='w-full h-full p-4 space-y-4'>
//           <div className='flex flex-row justify-between'>
//             <h3 className='text-lg font-medium text-default-500'>
//               Starting attributes values
//             </h3>
//           </div>
//           <Card className='bg-content3 p-4'>
//             <div className='grid grid-cols-3 gap-4'>
//               {attributes!.map(template => {
//                 const attributeValue = attributesMap[templateId]?.initialValue;
//                 return (
//                   <AttributeCardValue
//                     attributeTemplateId={template.id}
//                     key={template.id}
//                     value={attributeValue}
//                   />
//                 );
//               })}
//             </div>
//           </Card>
//         </div>
//       )}
//     </StatusComponent>
//   );
// };
//
// export default InitialAttributeSetter;
