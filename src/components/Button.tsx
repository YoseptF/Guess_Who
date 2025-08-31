import "./Button.css";

interface ButtonProps {
  onClick: () => void;
  variant?: "create" | "join" | "reset";
  children: React.ReactNode;
  disabled?: boolean;
}

export default function Button({
  onClick,
  variant = "create",
  children,
  disabled,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}
