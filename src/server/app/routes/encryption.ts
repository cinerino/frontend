/**
 * 暗号API
 */

import * as express from 'express';
import * as encryption from '../controllers/encryption/encryption.controller';
const router = express.Router();

router.post('/encode', encryption.encode);
router.post('/decode', encryption.decode);

export default router;
