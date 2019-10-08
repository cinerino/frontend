/**
 * ルーティングAPI
 */

import * as express from 'express';
import * as liny from '../controllers/liny/liny.controller';
const router = express.Router();

router.post('/sendMessage', liny.sendMessage);

export default router;
