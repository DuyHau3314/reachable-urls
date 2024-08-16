import { Router } from 'express';
import { URLController } from '../controllers/urlController';
import { validateURLs } from '../middlewares/validateUrls';

const router = Router();
const urlController = new URLController();

router.post('/urls/reachable', validateURLs, urlController.getReachableURLs);
router.post('/urls/reachable/:priority', validateURLs, urlController.getReachableURLsByPriority);

export default router;
