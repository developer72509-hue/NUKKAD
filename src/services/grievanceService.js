import { supabase } from '../lib/supabaseClient';

export async function getMyGrievances() {
  const { data, error } = await supabase
    .from('grievances')
    .select('id, subject, description, status, created_at, resolved_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fileGrievance({ userId, subject, description }) {
  const { data, error } = await supabase
    .from('grievances')
    .insert({ user_id: userId, subject, description })
    .select('id, subject, description, status, created_at')
    .single();
  if (error) throw error;
  return data;
}
