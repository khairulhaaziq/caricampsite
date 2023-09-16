interface FormButtonProps extends
React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function FormButton({ label, ...props }: FormButtonProps = {}) {
  return (
    <button {...props} className="rounded-xl bg-[#31B5FF] text-white font-semibold h-14 px-6">
      {label ?? 'Button'}
    </button>
  );
}
