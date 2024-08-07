import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '~/utils';

import ChevronDown from '~/assets/icons/ChevronDownIcon';
import ChevronUp from '~/assets/icons/ChevronUpIcon';
import Tick from '~/assets/icons/TickIcon';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    selectIcon?: React.ReactNode;
  }
>(
  (
    {
      className,
      children,
      selectIcon = (
        <ChevronDown className="size-4 opacity-50 transition duration-200 group-data-[state=open]:rotate-180" />
      ),
      ...props
    },
    ref,
  ) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'group flex h-10 w-full items-center justify-between gap-3 rounded-medium border-2 border-default bg-transparent !px-3 !py-2 text-sm hover:bg-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:bg-default data-[placeholder]:text-default-foreground',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="flex items-center justify-center">
        {selectIcon}
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  ),
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    container?: HTMLElement;
  }
>(
  (
    { className, children, container, position = 'item-aligned', align = 'center', ...props },
    ref,
  ) => (
    <SelectPrimitive.Portal container={container}>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          'relative z-[9999] min-w-32 overflow-hidden rounded-medium border border-divider bg-content1 text-default-foreground shadow-xl shadow-default/10  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper'
            ? 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'
            : '!p-1.5',
          className,
        )}
        position={position}
        align={align}
        {...props}
      >
        {position === 'item-aligned' ? (
          <SelectPrimitive.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-content1 text-default-foreground">
            <ChevronUp className="size-4" />
          </SelectPrimitive.ScrollUpButton>
        ) : null}
        <SelectPrimitive.Viewport
          className={cn(
            '!p-1',
            position === 'popper'
              ? 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
              : '',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        {position === 'item-aligned' ? (
          <SelectPrimitive.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-content1 text-default-foreground">
            <ChevronDown className="size-4" />
          </SelectPrimitive.ScrollDownButton>
        ) : null}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('!py-1.5 !pl-8 !pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-small !py-1.5 !pl-8 !pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-default data-[highlighted]:text-default-foreground data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Tick className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-primary-700', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
