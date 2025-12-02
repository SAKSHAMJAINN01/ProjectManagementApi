import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { CommentController } from '../controllers/comment.controller';
import { validators } from '../middleware/validators';

const router = Router();

router.post('/', validators.createTask, TaskController.create);
router.get('/', TaskController.getAll);
router.get('/:id', validators.uuidParam, TaskController.getById);

router.post('/:id/comments', validators.createComment, CommentController.create);
router.get('/:id/comments', validators.uuidParam, CommentController.getByTaskId);

export default router;
