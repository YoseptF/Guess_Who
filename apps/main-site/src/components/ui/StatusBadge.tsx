interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1.5">
    <span className="size-1.5 rounded-full bg-green-400 animate-pulse"></span>
    {status}
  </span>
);
