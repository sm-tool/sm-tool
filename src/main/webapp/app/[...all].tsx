import AttributeNode from '@/components/feature/entity/object/attriubute/attribute-node';
import ScenarioDescription from '@/components/feature/page/scenario/description';
import FormTabs from '@/components/feature/page/scenario/form-tabs';
import ScenarioHighlight from '@/components/feature/page/scenario/highlight';
import ScenarioLayout from '@/components/layout/scenario';
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import useDarkMode from 'use-dark-mode';

// TODO zamienić to potem na page scenario

const ScenarioPage = () => {
  const { value } = useDarkMode();

  return (
    <ScenarioLayout
      bottomContent={<ScenarioHighlight />}
      leftContent={<ScenarioDescription />}
      rightContent={<FormTabs />}
    >
      <div className='flex size-full items-center justify-center'>
        <ReactFlow
          attributionPosition='top-right'
          colorMode={value ? 'dark' : 'light'}
          nodes={[
            {
              id: '1',
              position: { x: 0, y: 0 },
              type: 'attribute',
              data: {
                attribute: {
                  id: 0,
                  name: 'Pismo Kozaków zaporoskich do sułtana Mehmeda IV',
                  value: 'Zaporoscy Kozacy do sułtana tureckiego!\n',
                },
              },
            },
          ]}
          nodeTypes={{
            attribute: AttributeNode,
          }}
        >
          <MiniMap zoomable pannable />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </ScenarioLayout>
  );
};

export default ScenarioPage;
