import express from 'express';
import { makeSubscription,updateSubscription,getSubscription,deleteSubscription } from '../controllers/subs.controller.js';

const router = express.Router();

router.route("/makesub").post(
  makeSubscription
)

router.route("/updatesub/:id").post(
   updateSubscription
)

router.route("/getsubs").get(
   getSubscription
)

router.route("/deletesub/:id").delete(
   deleteSubscription
)

export default router;