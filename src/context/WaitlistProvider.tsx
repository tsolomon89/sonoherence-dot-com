import type { ReactNode } from 'react';
import type { WaitlistContextValue } from './waitlist-context';
import { WaitlistContext } from './waitlist-context';

export function WaitlistProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: WaitlistContextValue;
}) {
  return <WaitlistContext.Provider value={value}>{children}</WaitlistContext.Provider>;
}
