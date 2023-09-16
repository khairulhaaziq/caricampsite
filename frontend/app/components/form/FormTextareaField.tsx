interface FormTextFieldProps extends
React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function FormTextField({ label, ...props }: FormTextFieldProps = {}) {
  return (
    <div className="flex flex-col gap-1">
      <textarea
        {...props}
        placeholder={label ? label : props.placeholder}
        className="rounded-xl bg-[#EDEDED] h-24 pl-5"
      />

    </div>
  );
}
