import { useContext } from 'react';
import { WaitlistContext } from './waitlist-context';

export function useWaitlist() {
  const context = useContext(WaitlistContext);
  if (!context) {
    throw new Error('useWaitlist must be used within WaitlistProvider.');
  }

  return context;
}
