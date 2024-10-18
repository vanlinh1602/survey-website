import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  placeholder?: string;
  value?: string;
};

export default function SearchableSelect({
  options,
  onSelect,
  placeholder,
  value,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<{
    value: string;
    label: string;
  }>();

  useEffect(() => {
    if (value) {
      const selectedValue = options.find((option) => option.value === value);
      if (selectedValue) {
        setSelectValue(selectedValue);
      }
    } else {
      setSelectValue(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="max-w-full justify-between font-normal"
        >
          {selectValue ? (
            <div className="flex">{selectValue.label}</div>
          ) : (
            <div className="flex opacity-50">{placeholder}</div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-full p-0 text-ellipsis">
        <Command>
          <CommandInput placeholder={'Tìm...'} />
          <CommandList>
            <CommandEmpty>Không có kết quả</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    setSelectValue(option);
                    onSelect(option.value);
                    setOpen(false);
                  }}
                >
                  <span className="text-ellipsis">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
