import {
  File,
  Folder,
  ObjectTypeTreeViewElement,
  useObjectTypeTree,
} from '@/features/object-type/components/object-type-tree/object-type-tree-partial.tsx';
import { useObjectTypeChildren } from '@/features/object-type/queries.ts';
import React from 'react';

const ObjectTypeTreeNode = ({
  element,
}: {
  element: ObjectTypeTreeViewElement;
}) => {
  const { expandedItems } = useObjectTypeTree();
  const isExpanded = expandedItems?.includes(element.object.id);

  const { data: children, isLoading } = useObjectTypeChildren(
    element.object.id,
    (isExpanded && element.object.hasChildren) ?? false,
  );
  const mappedChildren: ObjectTypeTreeViewElement[] = React.useMemo(
    () =>
      children?.map(object => ({
        object,
        children: undefined,
      })) ?? [],
    [children],
  );

  if (element.object.hasChildren) {
    return (
      <Folder element={element} value={element.object.id.toString()}>
        {isLoading ? (
          <div className='pl-4'>Loading...</div>
        ) : (
          mappedChildren.map(child => (
            <ObjectTypeTreeNode key={child.object.id} element={child} />
          ))
        )}
      </Folder>
    );
  }

  return <File element={element} />;
};

export default ObjectTypeTreeNode;
