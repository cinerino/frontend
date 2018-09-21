/**
 * ルーティングAPI
 */

import * as express from 'express';
import * as authorize from '../controllers/authorize/authorize.controller';
const router = express.Router();

router.post('/getCredentials', authorize.getCredentials);
router.get('/signIn', authorize.signIn);
router.get('/signOut', authorize.signOut);

export default router;
