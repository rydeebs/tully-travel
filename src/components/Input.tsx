import { useId } from "react";
import type {
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Eyebrow } from "./Eyebrow";

export type InputVariant = "underline" | "box";
export type InputElement = "input" | "textarea" | "select";

type NativeFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement> &
    TextareaHTMLAttributes<HTMLTextAreaElement> &
    SelectHTMLAttributes<HTMLSelectElement>,
  "as" | "children" | "className" | "id" | "style"
>;

export type InputProps = {
  as?: InputElement;
  children?: ReactNode;
  className?: string;
  hint?: ReactNode;
  id?: string;
  label?: ReactNode;
  style?: CSSProperties;
  variant?: InputVariant;
} & NativeFieldProps;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Input({
  as = "input",
  children,
  className,
  hint,
  id,
  label,
  style,
  variant = "underline",
  ...rest
}: InputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const fieldClassName = cx(
    "t-input__field",
    `t-input__field--${variant}`,
    as === "select" && "t-input__field--select",
  );
  const fieldProps = {
    ...rest,
    id: fieldId,
    className: fieldClassName,
  };

  return (
    <div className={cx("t-input", `t-input--${variant}`, className)} style={style}>
      {label ? (
        <Eyebrow as="label" className="t-input__label" tone="muted" htmlFor={fieldId}>
          {label}
        </Eyebrow>
      ) : null}
      {as === "textarea" ? (
        <textarea {...(fieldProps as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : as === "select" ? (
        <div className="t-input__select-wrap">
          <select {...(fieldProps as SelectHTMLAttributes<HTMLSelectElement>)}>
            {children}
          </select>
        </div>
      ) : (
        <input {...(fieldProps as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {hint ? <span className="t-input__hint">{hint}</span> : null}
    </div>
  );
}
