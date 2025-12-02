import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { TaskModel } from '../models/task.model';
import { ProjectModel } from '../models/project.model';
import { UserModel } from '../models/user.model';
import { TaskStatus } from '../types';

export const TaskController = {
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { project_id, title, description, assigned_to } = req.body;

      const projectExists = await ProjectModel.exists(project_id);
      if (!projectExists) {
        return res.status(400).json({ error: 'Project does not exist' });
      }

      if (assigned_to) {
        const userExists = await UserModel.exists(assigned_to);
        if (!userExists) {
          return res.status(400).json({ error: 'Assigned user does not exist' });
        }
      }

      const task = await TaskModel.create(project_id, title, description, assigned_to);
      return res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const { project_id, status, assigned_to, page = '1', limit = '10' } = req.query;

      const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'done'];
      if (status && !validStatuses.includes(status as TaskStatus)) {
        return res.status(400).json({ 
          error: 'Invalid status. Must be one of: todo, in_progress, done' 
        });
      }

      const filters = {
        project_id: project_id as string | undefined,
        status: status as TaskStatus | undefined,
        assigned_to: assigned_to as string | undefined
      };

      const pagination = {
        page: Math.max(1, parseInt(page as string) || 1),
        limit: Math.min(100, Math.max(1, parseInt(limit as string) || 10))
      };

      const { tasks, total } = await TaskModel.findWithFilters(filters, pagination);

      return res.json({
        data: tasks,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          total_pages: Math.ceil(total / pagination.limit)
        }
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await TaskModel.findById(id);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      return res.json(task);
    } catch (error) {
      console.error('Error fetching task:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
