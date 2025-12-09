import { supabase } from '../../../lib/supabaseClient';


export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).end();
const { set_id, term, definition, extra } = req.body;
const user = (await supabase.auth.getUser()).data.user;
if (!user) return res.status(401).json({ error: 'Unauthorized' });


// Optional: verify ownership of set
const { data: set, error: setErr } = await supabase
.from('flashcard_sets')
.select('owner')
.eq('id', set_id)
.single();
if (setErr) return res.status(500).json({ error: setErr });
if (set.owner !== user.id) return res.status(403).json({ error: 'Forbidden' });


const { data, error } = await supabase
.from('flashcard_cards')
.insert([{ set_id, term, definition, extra }])
.select()
.single();


if (error) return res.status(500).json({ error });
return res.status(200).json(data);
}