import express from 'express'
import { signup,signin,updateuser,deleteuser } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/middleware.js';


const router = express.Router();


router.route("/signup").post(
    signup
)

router.route("/signin").post(
    signin
)

router.route("/updateuser").post(
    authMiddleware,
    updateuser
)

router.route("/deleteuser").post(
   authMiddleware,
   deleteuser
)

export default router;