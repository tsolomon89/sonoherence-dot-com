import { supabase } from '../lib/supabase';
import type {
  SupportSubmissionInput,
  SupportSubmissionResponse,
} from '../types/funnel';

export async function submitSupportInquiry(
  input: SupportSubmissionInput,
): Promise<SupportSubmissionResponse> {
  if (!supabase) {
    return { inquiryId: `demo-${Date.now()}` };
  }

  const { data, error } = await supabase.functions.invoke<SupportSubmissionResponse>(
    'support-submit',
    {
      body: input,
    },
  );

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to submit inquiry.');
  }

  return data;
}
