import {
  createElement,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
} from "react";

type EditableTag = "h1" | "h2" | "h3" | "p" | "span" | "div";

export type EditableProps = {
  value: string;
  onCommit: (next: string) => void;
  as?: EditableTag;
  multiline?: boolean;
  label: string;
  className?: string;
  disabled?: boolean;
};

export function Editable({
  as = "span",
  className,
  disabled = false,
  label,
  multiline = false,
  onCommit,
  value,
}: EditableProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;

    if (element === null) {
      return;
    }

    if (document.activeElement === element) {
      return;
    }

    if (element.textContent === value) {
      return;
    }

    element.textContent = value;
  });

  const restoreValue = () => {
    const element = ref.current;

    if (element === null) {
      return;
    }

    element.textContent = value;
  };

  const commit = () => {
    const element = ref.current;

    if (element === null) {
      return;
    }

    const next = (element.textContent ?? "").trim();

    if (next === value) {
      element.textContent = value;
      return;
    }

    onCommit(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      restoreValue();
      event.currentTarget.blur();
      return;
    }

    if (event.key === "Enter" && multiline === false) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  return createElement(as, {
    "aria-label": label,
    "aria-multiline": multiline,
    className: cx("app-editable", className),
    contentEditable: disabled ? false : "plaintext-only",
    onBlur: commit,
    onKeyDown: handleKeyDown,
    ref,
    role: "textbox",
    spellCheck: true,
    suppressContentEditableWarning: true,
    tabIndex: disabled ? undefined : 0,
  });
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter((className) => Boolean(className)).join(" ");
}
