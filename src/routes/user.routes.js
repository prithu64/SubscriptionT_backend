import express from 'express'
import { signup } from '../controllers/user.controller.js';

const router = express.Router();


router.route("/signup").post(
    signup
)


export default router;