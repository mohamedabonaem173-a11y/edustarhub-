import { supabase } from '../../../lib/supabaseClient';
export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).end();
const { id } = req.body;
const user = (await supabase.auth.getUser()).data.user;
if (!user) return res.status(401).json({ error: 'Unauthorized' });


const { error } = await supabase.from('flashcard_cards').delete().eq('id', id);
if (error) return res.status(500).json({ error });
return res.status(200).json({ ok: true });
}