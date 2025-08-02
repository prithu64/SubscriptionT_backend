import express from 'express';
import { makeSubscription,updateSubscription,getSubscriptions,deleteSubscription } from '../controllers/subs.controller.js';
import { authMiddleware } from '../middlewares/middleware.js';

const router = express.Router();

router.route("/makesub").post(
  authMiddleware, 
  makeSubscription
)

router.route("/updatesub/:id").post(
   updateSubscription
)

router.route("/getsubs").get(
   authMiddleware,
   getSubscriptions
)

router.route("/deletesub/:id").delete(
   deleteSubscription
)

export default router;