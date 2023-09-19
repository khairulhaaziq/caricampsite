import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon, DividerHorizontalIcon } from '@radix-ui/react-icons';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { tv, type VariantProps } from 'tailwind-variants';

const choiceboxVariantsClass = tv({
  variants: {
    variant: {
      default: '',
    },
  },
  slots: {
    root: 'group relative flex gap-2 items-end h-20 px-4 py-4 bg-white shadow-[0_0_0_1px_inset_var(--outline)] hover:shadow-[0_0_0_1px_inset_var(--outline-hover)] rounded-lg w-full data-[state=checked]:shadow-[0_0_0_2px_inset_var(--black)] data-[state=checked]:focus:shadow-[0_0_0_2px_inset_var(--black),0_0_0_2px_rgba(0,0,0,0.2)] box-border transition-all duration-200  focus:shadow-[0_0_0_2px_rgba(0,0,0,0.3)] outline-none ',
    indicatorBox:
      'absolute right-3 top-3 bg-white flex flex-none h-5 w-5 appearance-none items-center justify-center rounded-full group-data-[state=unchecked]:border-2 border-outline group-data-[state=checked]:bg-black text-white shadow-[0_2px_10px] outline-none',
    indicator: '',
    radioIndicatorBox:
      'absolute right-3 top-3 flex flex-none h-5 w-5 appearance-none items-center justify-center rounded-full box-border border-2 border-outline group-data-[state=checked]:border-black group-data-[state=checked]:bg-white text-white shadow-[0_2px_10px] outline-none',
    radioIndicator: 'h-2.5 w-2.5 bg-black rounded-full',
    labelClass: 'text-left font-semibold',
    descriptionClass: 'text-dim text-left',
  },
  defaultVariants: {
    variant: 'default',
  },
});
export type ChoiceboxVariantsClassProps = VariantProps<
  typeof choiceboxVariantsClass
>;

export interface ChoiceboxItemProps extends ChoiceboxVariantsClassProps {
  label?: string;
  description?: string;
  multiple?: boolean;
}

const ChoiceboxCheckboxItem = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  ChoiceboxItemProps &
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ checked, variant, label, description, className, children, ...props }, ref) => {
  const { root, indicatorBox, indicator, labelClass, descriptionClass } =
    choiceboxVariantsClass({ variant });

  return (
    <CheckboxPrimitive.Root
      className={twMerge([root(), className])}
      checked={checked}
      {...props}
      ref={ref}
    >
      {children ?
        (<div className="flex-grow">{children}</div>) :
        (<div className="space-y-1 flex-grow">
          {label ? <p className={labelClass()}>{label}</p> : null}
          {description ? (
            <p className={descriptionClass()}>{description}</p>
          ) : null}
        </div>)}
      <div className={indicatorBox()}>
        <CheckboxPrimitive.Indicator className={indicator()}>
          <CheckboxPrimitive.Indicator>
            {checked === 'indeterminate' ? (
              <DividerHorizontalIcon />
            ) : (
              <CheckIcon />
            )}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Indicator>
      </div>
    </CheckboxPrimitive.Root>
  );
});

export const ChoiceboxItem = React.forwardRef<
  | React.ElementRef<typeof RadioGroupPrimitive.Item>
  | React.ElementRef<typeof CheckboxPrimitive.Root>,
  (
    | React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
    | React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
  ) &
    ChoiceboxItemProps
    >(({ multiple = false, ...props }, ref) => {
      return multiple ? (
        <ChoiceboxCheckboxItem {...props} ref={ref} />
      ) : (
        <ChoiceboxRadioItem {...props} ref={ref} />
      );
    });

const ChoiceboxRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  ChoiceboxItemProps &
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ variant, label, description, className, children, ...props }, ref) => {
  const {
    root,
    radioIndicatorBox,
    radioIndicator,
    labelClass,
    descriptionClass,
  } = choiceboxVariantsClass({ variant });

  return (
    <RadioGroupPrimitive.Item
      className={twMerge([root(), className])}
      {...props}
      ref={ref}
    >
      {children ?
        (<div className="flex-grow">{children}</div>) :
        (<div className="flex flex-col gap-1 flex-grow">
          {label ? <p className={labelClass()}>{label}</p> : null}
          {description ? (
            <p className={descriptionClass()}>{description}</p>
          ) : null}
        </div>)}
      <div className={radioIndicatorBox()}>
        <RadioGroupPrimitive.Indicator
          className={radioIndicator()}
        ></RadioGroupPrimitive.Indicator>
      </div>
    </RadioGroupPrimitive.Item>
  );
});

export const ChoiceboxGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={twMerge('contents', className)}
      {...props}
      ref={ref}
    >
      {children}
    </RadioGroupPrimitive.Root>
  );
});
