interface ButtonProps {
  onClick: () => void;
  variant?: "create" | "join" | "reset";
  children: React.ReactNode;
  disabled?: boolean;
}

const getVariantClasses = (variant: "create" | "join" | "reset") => {
  const baseClasses =
    "py-4 px-10 text-lg font-bold border-none rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider shadow-[0_4px_15px_rgba(0,0,0,0.2)] text-white hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none";

  switch (variant) {
    case "create":
      return `${baseClasses} bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] hover:shadow-[0_6px_20px_rgba(255,107,107,0.4)]`;
    case "join":
      return `${baseClasses} bg-gradient-to-r from-[#4ecdc4] to-[#44a08d] hover:shadow-[0_6px_20px_rgba(78,205,196,0.4)]`;
    case "reset":
      return `${baseClasses} bg-gradient-to-r from-[#f093fb] to-[#f5576c] hover:shadow-[0_6px_20px_rgba(245,87,108,0.4)] text-sm py-3 px-6`;
    default:
      return baseClasses;
  }
};

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
      className={getVariantClasses(variant)}
    >
      {children}
    </button>
  );
}