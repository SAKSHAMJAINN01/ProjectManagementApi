import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validators } from '../middleware/validators';

const router = Router();

router.post('/', validators.createUser, UserController.create);
router.get('/', UserController.getAll);
router.get('/:id', validators.uuidParam, UserController.getById);

export default router;
