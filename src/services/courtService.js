import { supabase } from '../lib/supabase';

export async function getActiveCourts() {
  const { data, error } = await supabase
    .from('courts')
    .select('id, label, description, status, created_at')
    .eq('status', 'active')
    .order('id');

  if (error) throw error;
  return data ?? [];
}

export async function getCourtById(id) {
  const { data, error } = await supabase
    .from('courts')
    .select('id, label, description, status, created_at')
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle();

  if (error) throw error;
  return data;
}