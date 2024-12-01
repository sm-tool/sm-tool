import { Meta } from '@storybook/react';
import ScenarioTemplateHighlight from './index';

const meta = {
  title: 'Scenario/Panels/Template-Highlight',
  component: ScenarioTemplateHighlight,
  argTypes: {
    template: { control: 'object' },
  },
} satisfies Meta<typeof ScenarioTemplateHighlight>;

export default meta;
