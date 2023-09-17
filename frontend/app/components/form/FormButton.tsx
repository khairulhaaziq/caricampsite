import { useIsSubmitting } from 'remix-validated-form';

interface FormButtonProps extends
React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function FormButton({ label, ...props }: FormButtonProps = {}) {
  const isSubmitting = useIsSubmitting();

  return (
    <button {...props} disabled={isSubmitting} className="rounded-xl bg-[#31B5FF] text-white font-semibold h-14 px-6 disabled:opacity-60">
      {isSubmitting ? 'Loading...' : label ?? 'Button'}
    </button>
  );
}
