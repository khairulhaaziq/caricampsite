type TextareaTextFieldAttributes = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface FormTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  textarea?: boolean;
}



export default function FormTextField({ label, textarea, ...props }: FormTextFieldProps = {}) {
  return (
    <div className="flex flex-col gap-1">
      {
        textarea ? (
          <textarea
            {...props as TextareaTextFieldAttributes}
            placeholder={label ? label : props.placeholder}
            className="rounded-xl bg-[#EDEDED] h-32 pl-5 pt-3.5"
          />
        ) : (
          <input
            {...props}
            placeholder={label ? label : props.placeholder}
            className="rounded-xl bg-[#EDEDED] h-14 pl-5"
          />
        )
      }
    </div>
  );
}
