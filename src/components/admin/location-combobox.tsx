'use client';

import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';

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
import { cn } from '@/lib/utils';

type LocationOption = {
  value: string;
  label: string;
  city: string | null;
  country: string;
  type: 'city' | 'country';
};

export function LocationCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setOptions([]);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/admin/locations?q=${encodeURIComponent(trimmedQuery)}`
        );
        const payload = (await response.json()) as LocationOption[] | {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(
            'error' in payload && payload.error
              ? payload.error
              : 'Failed to search locations.'
          );
        }

        setOptions(payload as LocationOption[]);
      } catch {
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [open, query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-2xl"
        >
          <span className="truncate text-left">
            {value || 'Select city or country'}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search city or country..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading
                ? 'Searching locations...'
                : 'Type at least 2 characters to search.'}
            </CommandEmpty>
            <CommandGroup heading="Suggestions">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setQuery(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <MapPin className="size-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {option.type === 'city' ? 'City' : 'Country'}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
