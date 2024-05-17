'use client';

import * as React from 'react';
import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';
import { Check, ChevronsUpDown } from 'lucide-react';

export interface ComboboxProps<T> {
  placeholder: string;
  items: {
    value: T;
    label: string;
    disabled?: boolean;
  }[];
  value: T | null | undefined;
  onChange: (value: T) => void;
  children?: React.ReactNode;
  onCreate?: (value: T) => void;
  className?: string;
  searchable?: boolean;
  icon?: LucideIcon;
  size?: ButtonProps['size'];
  label?: string;
  align?: 'start' | 'end' | 'center';
  portal?: boolean;
  error?: string;
}

export type ExtendedComboboxProps<T> = Omit<
  ComboboxProps<T>,
  'items' | 'placeholder'
> & {
  placeholder?: string;
};

export function Combobox<T extends string>({
  placeholder,
  items,
  value,
  onChange,
  children,
  onCreate,
  className,
  searchable,
  icon: Icon,
  size,
  align = 'start',
  portal,
  error,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  function find(value: string) {
    return items.find(
      (item) => item.value.toLowerCase() === value.toLowerCase()
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ?? (
          <Button
            size={size}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'justify-between',
              !!error && 'border-destructive',
              className
            )}
          >
            <div className="flex min-w-0 items-center">
              {Icon ? <Icon size={16} className="mr-2 shrink-0" /> : null}
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {value ? find(value)?.label ?? 'No match' : placeholder}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-full max-w-md p-0"
        align={align}
        portal={portal}
      >
        <Command>
          {searchable === true && (
            <CommandInput
              placeholder="Search item..."
              value={search}
              onValueChange={setSearch}
            />
          )}
          {typeof onCreate === 'function' && search ? (
            <CommandEmpty className="p-2">
              <Button
                onClick={() => {
                  onCreate(search as T);
                  setSearch('');
                  setOpen(false);
                }}
              >
                Create &quot;{search}&quot;
              </Button>
            </CommandEmpty>
          ) : (
            <CommandEmpty>Nothing selected</CommandEmpty>
          )}
          <div className="over-x-hidden max-h-[300px] overflow-y-auto">
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    const value = find(currentValue)?.value ?? currentValue;
                    onChange(value as T);
                    setOpen(false);
                  }}
                  {...(item.disabled && { disabled: true })}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 flex-shrink-0',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
