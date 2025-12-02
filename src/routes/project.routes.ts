import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { validators } from '../middleware/validators';

const router = Router();

router.post('/', validators.createProject, ProjectController.create);
router.get('/', ProjectController.getAll);
router.get('/:id', validators.uuidParam, ProjectController.getById);

export default router;
