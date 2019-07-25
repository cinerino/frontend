/**
 * ルーティングAPI
 */

import * as express from 'express';
import * as mail from '../controllers/mail/mail.controller';
const router = express.Router();

router.post('/completeTemplate', mail.getCompleteTemplate);
router.post('/returnTemplate', mail.getReturnTemplate);

export default router;
