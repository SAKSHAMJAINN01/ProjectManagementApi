import { query } from '../database/config';
import { User } from '../types';

export const UserModel = {
  async create(name: string, email: string): Promise<User> {
    const result = await query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    return result.rows[0];
  },

  async findById(id: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  async findAll(): Promise<User[]> {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  },

  async exists(id: string): Promise<boolean> {
    const result = await query('SELECT 1 FROM users WHERE id = $1', [id]);
    return result.rows.length > 0;
  }
};
