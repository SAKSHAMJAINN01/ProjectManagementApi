import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CommentModel } from '../models/comment.model';
import { TaskModel } from '../models/task.model';
import { UserModel } from '../models/user.model';

export const CommentController = {
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id: task_id } = req.params;
      const { user_id, message } = req.body;

      const taskExists = await TaskModel.exists(task_id);
      if (!taskExists) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const userExists = await UserModel.exists(user_id);
      if (!userExists) {
        return res.status(400).json({ error: 'User does not exist' });
      }

      const comment = await CommentModel.create(task_id, user_id, message);
      return res.status(201).json(comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getByTaskId(req: Request, res: Response) {
    try {
      const { id: task_id } = req.params;

      const taskExists = await TaskModel.exists(task_id);
      if (!taskExists) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const comments = await CommentModel.findByTaskId(task_id);
      return res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
