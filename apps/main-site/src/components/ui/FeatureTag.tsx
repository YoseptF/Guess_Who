interface FeatureTagProps {
  feature: string;
}

export const FeatureTag = ({ feature }: FeatureTagProps) => (
  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50">
    {feature}
  </span>
);
