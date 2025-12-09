import { supabase } from '../../../lib/supabaseClient';
export default async function handler(req, res) {
const user = (await supabase.auth.getUser()).data.user;
if (!user) return res.status(401).json({ error: 'Unauthorized' });


const { data, error } = await supabase
.from('flashcard_sets')
.select('*, flashcard_cards(*)')
.eq('owner', user.id)
.order('created_at', { ascending: false });


if (error) return res.status(500).json({ error });
return res.status(200).json(data);
}