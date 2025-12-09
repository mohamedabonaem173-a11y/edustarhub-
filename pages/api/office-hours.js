import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  const { method } = req;
  const { student_id, teacher_id, requested_time, topic, notes, status } = req.body;

  switch (method) {
    case 'GET':
      // Fetch requests for a user (student or teacher)
      const { userId, role } = req.query;
      try {
        let query = supabase
          .from('office_hours_requests')
          .select('*')
          .order('requested_time', { ascending: true });

        if (role === 'student') query = query.eq('student_id', userId);
        if (role === 'teacher') query = query.eq('teacher_id', userId);

        const { data, error } = await query;

        if (error) throw error;
        return res.status(200).json({ data });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }

    case 'POST':
      // Create a new office hour request
      try {
        const { data, error } = await supabase
          .from('office_hours_requests')
          .insert({ student_id, teacher_id, requested_time, topic, notes });

        if (error) throw error;
        return res.status(200).json({ data });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }

    case 'PATCH':
      // Update status (accept/reject/complete)
      try {
        const { id } = req.body;
        const { data, error } = await supabase
          .from('office_hours_requests')
          .update({ status })
          .eq('id', id);

        if (error) throw error;
        return res.status(200).json({ data });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
