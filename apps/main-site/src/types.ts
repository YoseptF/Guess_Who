import type { LucideIcon } from 'lucide-react';

export interface Game {
  name: string;
  description: string;
  url: string;
  status: 'Live' | 'Beta' | 'Coming Soon';
  icon: LucideIcon;
  color: string;
  features: string[];
}
