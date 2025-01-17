import React from 'react';
import { Input } from '@/components/ui/shadcn/input.tsx';

interface OTPContextType {
  value: string;
  onChange: (value: string) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  handleKeyDown: (index: number, event: React.KeyboardEvent) => void;
}

const OTPContext = React.createContext<OTPContextType | undefined>(undefined);

export const OTPInput = ({
  children,
  value,
  onChange,
}: {
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Backspace': {
        event.preventDefault();
        if (value[index]) {
          const newValue = [...value];
          newValue[index] = '';
          onChange(newValue.join(''));
        } else {
          setActiveIndex(Math.max(0, index - 1));
        }
        break;
      }

      case 'ArrowLeft': {
        event.preventDefault();
        setActiveIndex(Math.max(0, index - 1));
        break;
      }

      case 'ArrowRight': {
        event.preventDefault();
        setActiveIndex(Math.min(value.length - 1, index + 1));
        break;
      }
    }
  };

  return (
    <OTPContext.Provider
      value={{ value, onChange, activeIndex, setActiveIndex, handleKeyDown }}
    >
      <div className='flex items-center gap-2'>{children}</div>
    </OTPContext.Provider>
  );
};

export const OTPGroup = ({ children }: { children: React.ReactNode }) => {
  return <div className='flex gap-1'>{children}</div>;
};

export const OTPSeparator = ({ children }: { children: React.ReactNode }) => {
  return <div className='flex items-center text-default-300'>{children}</div>;
};

export const OTPSlot = ({ index }: { index: number }) => {
  const inputReference = React.useRef<HTMLInputElement>(null);
  const context = React.useContext(OTPContext);

  if (!context) throw new Error('OTPSlot must be used within OTPInput');

  React.useEffect(() => {
    if (index === 0) {
      inputReference.current?.focus();
      inputReference.current?.select();
    }
  }, []);

  React.useEffect(() => {
    if (context.activeIndex === index) {
      inputReference.current?.focus();
      inputReference.current?.select();
    }
  }, [context.activeIndex, index]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^\d*$/.test(event.target.value)) return;

    const newValue = [...context.value];
    const inputValue = event.target.value.slice(-1);

    if (inputValue) {
      newValue[index] = inputValue;
      context.onChange(newValue.join(''));
      context.setActiveIndex(index + 1);
    }
  };

  return (
    <Input
      ref={inputReference}
      type='text'
      inputMode='numeric'
      pattern='\d*'
      maxLength={1}
      className='w-10 h-10 text-center border rounded-md focus:outline-none focus:ring-2
        focus:ring-secondary'
      value={context.value[index] || ''}
      onChange={handleChange}
      onKeyDown={event => context.handleKeyDown(index, event)}
      onFocus={() => {
        context.setActiveIndex(index);
        inputReference.current?.select();
      }}
    />
  );
};
