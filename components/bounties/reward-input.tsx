import { Input } from '@/components/ui/input';
import { ShineBorder } from '@/components/magicui/shine-border';
import { cn } from '@/lib/utils';

interface RewardInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RewardInput({
  value,
  onChange,
  placeholder = 'e.g., 500',
  className,
  disabled = false
}: RewardInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and a single decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(e.target.value)) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div className='relative flex items-center w-full'>
        <Input
          type='text' // Using text to allow decimal formatting, validation handles numbers
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'border-border focus:ring-orange-500 focus:border-orange-500 pr-12 rounded-md',
            'dark:bg-background dark:text-foreground'
          )}
          required
        />
        <span className='absolute right-3 text-muted-foreground pointer-events-none'>
          XLM
        </span>
      </div>
      <ShineBorder
        className='rounded-md'
        borderWidth={1}
        shineColor='hsl(var(--primary))' // Using primary color for the shine
      />
    </div>
  );
} 