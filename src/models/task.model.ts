import { query } from '../database/config';
import { Task, TaskWithDetails, TaskFilters, PaginationParams } from '../types';

export const TaskModel = {
  async create(
    project_id: string,
    title: string,
    description: string,
    assigned_to?: string
  ): Promise<Task> {
    const result = await query(
      `INSERT INTO tasks (project_id, title, description, assigned_to, status) 
       VALUES ($1, $2, $3, $4, 'todo') RETURNING *`,
      [project_id, title, description, assigned_to || null]
    );
    return result.rows[0];
  },

  async findById(id: string): Promise<Task | null> {
    const result = await query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async exists(id: string): Promise<boolean> {
    const result = await query('SELECT 1 FROM tasks WHERE id = $1', [id]);
    return result.rows.length > 0;
  },

  async findWithFilters(
    filters: TaskFilters,
    pagination: PaginationParams
  ): Promise<{ tasks: TaskWithDetails[]; total: number }> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.project_id) {
      conditions.push(`t.project_id = $${paramIndex++}`);
      params.push(filters.project_id);
    }
    if (filters.status) {
      conditions.push(`t.status = $${paramIndex++}`);
      params.push(filters.status);
    }
    if (filters.assigned_to) {
      conditions.push(`t.assigned_to = $${paramIndex++}`);
      params.push(filters.assigned_to);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (pagination.page - 1) * pagination.limit;

    const countQuery = `SELECT COUNT(*) FROM tasks t ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    const dataQuery = `
      SELECT 
        t.*,
        p.name as project_name,
        p.description as project_description,
        u.name as assigned_user_name,
        u.email as assigned_user_email,
        lc.message as latest_comment,
        lc.user_name as latest_comment_user,
        lc.created_at as latest_comment_at
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN LATERAL (
        SELECT c.message, c.created_at, cu.name as user_name
        FROM comments c
        JOIN users cu ON c.user_id = cu.id
        WHERE c.task_id = t.id
        ORDER BY c.created_at DESC
        LIMIT 1
      ) lc ON true
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    
    params.push(pagination.limit, offset);
    const result = await query(dataQuery, params);

    return {
      tasks: result.rows,
      total
    };
  }
};
