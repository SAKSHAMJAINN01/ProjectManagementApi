import { query } from '../database/config';
import { Project } from '../types';

export const ProjectModel = {
  async create(name: string, description: string, owner_id: string): Promise<Project> {
    const result = await query(
      'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, owner_id]
    );
    return result.rows[0];
  },

  async findById(id: string): Promise<Project | null> {
    const result = await query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findAll(): Promise<Project[]> {
    const result = await query('SELECT * FROM projects ORDER BY created_at DESC');
    return result.rows;
  },

  async exists(id: string): Promise<boolean> {
    const result = await query('SELECT 1 FROM projects WHERE id = $1', [id]);
    return result.rows.length > 0;
  }
};
