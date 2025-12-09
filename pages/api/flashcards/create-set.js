import { supabase } from '../../../lib/supabaseClient';


export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).end();
const { title, description } = req.body;
const user = (await supabase.auth.getUser()).data.user;
if (!user) return res.status(401).json({ error: 'Unauthorized' });


const { data, error } = await supabase
.from('flashcard_sets')
.insert([{ title, description, owner: user.id }])
.select()
.single();


if (error) return res.status(500).json({ error });
return res.status(200).json(data);
}