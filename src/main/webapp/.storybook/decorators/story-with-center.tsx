import { Decorator } from '@storybook/react';

export const storyWithCenter: Decorator = Story => {
  return (
    <div className='h-fit w-fit flex items-center justify-center p-24'>
      <div className='w-full'>
        <Story />
      </div>
    </div>
  );
};
