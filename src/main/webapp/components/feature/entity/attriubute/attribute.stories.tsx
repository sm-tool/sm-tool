import Attribute, {
  AttributeProperties,
} from '@/components/feature/entity/attriubute/index.tsx';
import { Meta, StoryFn as Story } from '@storybook/react';

export default {
  title: 'Features/Attribute',
  component: Attribute,
  argTypes: {
    attribute: { control: 'object' },
    className: { control: 'text' },
  },
} as Meta;

const Template: Story<AttributeProperties> = arguments_ => (
  <Attribute {...arguments_} />
);

export const Default = Template.bind({});
Default.args = {
  attribute: {
    id: 0,
    name: 'Stan osobowy drużyny',
    value: '12 osób',
  },
};

export const WithLongValues = Template.bind({});
WithLongValues.args = {
  attribute: {
    id: 0,
    name: 'asdasjkdmajksmdkamsdkamsdkmaskdma-oksdm-oakmdskamsd-kamsdkmaoskdmoaiksd',
    value:
      'asmdamsdamsokdma oskmdoakmsdkamsdkmaoskdm askmd-kasmd-okamsodkmas-ikdmasmdamsda msokdmaoskmdoakmsdkamsdkmaoskdmaskmd-kasmd-okamsodkmas-ikdmasmdamsdamsokdmaoskmdoakmsdkamsdkmaoskdmaskmd-kasmd-okamsodkmas-ikdmasmdamsdamsokdmaoskmdoakmsdkamsdkmaoskdmaskmd-kasmd-okamsodkmas-ikdmasmdamsdamsokdmaoskmdoakmsdkamsdkmaoskdmaskmd-kasmd-okamsodkmas-ikdmasmdamsdamsokdmaoskmdoakmsdkamsdkmaoskdmaskmd-kasmd-okamsodkmas-ikdm',
  },
};
