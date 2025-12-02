import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ProjectModel } from '../models/project.model';
import { UserModel } from '../models/user.model';

export const ProjectController = {
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, owner_id } = req.body;

      const ownerExists = await UserModel.exists(owner_id);
      if (!ownerExists) {
        return res.status(400).json({ error: 'Owner user does not exist' });
      }

      const project = await ProjectModel.create(name, description, owner_id);
      return res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const projects = await ProjectModel.findAll();
      return res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await ProjectModel.findById(id);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      return res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
