import { createContext } from 'react';
import type { SourceCta } from '../types/funnel';

export interface WaitlistContextValue {
  openWaitlist: (source: SourceCta) => void;
}

export const WaitlistContext = createContext<WaitlistContextValue | null>(null);
