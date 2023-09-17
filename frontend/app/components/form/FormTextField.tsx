import { useField } from 'remix-validated-form';

type TextareaTextFieldAttributes = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface FormTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  textarea?: boolean;
  name: string;
}

export default function FormTextField({
  label,
  textarea,
  name,
  ...props
}: FormTextFieldProps) {
  const { error, getInputProps } = useField(name);

  return (
    <div className="space-y-2 flex-grow">
      <div className="flex flex-col gap-1">
        {
          textarea ? (
            <textarea
              {...getInputProps({ id: name })}
              {...props as TextareaTextFieldAttributes}
              placeholder={label ? label : props.placeholder}
              className={`rounded-xl ${error ? 'bg-red-50' : 'bg-[#EDEDED]'} h-32 pl-5 pt-3.5`}
            />
          ) : (
            <input
              {...getInputProps({ id: name })}
              {...props}
              placeholder={label ? label : props.placeholder}
              className={`rounded-xl ${error ? 'bg-red-50' : 'bg-[#EDEDED]'} h-14 pl-5`}
            />
          )
        }
      </div>
      {error && (
        <p className="text-danger flex gap-1 items-center">
          {error}
        </p>
      )}
    </div>
  );
}
