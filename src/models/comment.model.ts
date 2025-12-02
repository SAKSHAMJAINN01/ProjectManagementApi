import { query } from '../database/config';
import { Comment } from '../types';

export const CommentModel = {
  async create(task_id: string, user_id: string, message: string): Promise<Comment> {
    const result = await query(
      'INSERT INTO comments (task_id, user_id, message) VALUES ($1, $2, $3) RETURNING *',
      [task_id, user_id, message]
    );
    return result.rows[0];
  },

  async findByTaskId(task_id: string): Promise<Comment[]> {
    const result = await query(
      `SELECT c.*, u.name as user_name, u.email as user_email 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.task_id = $1 
       ORDER BY c.created_at DESC`,
      [task_id]
    );
    return result.rows;
  }
};
