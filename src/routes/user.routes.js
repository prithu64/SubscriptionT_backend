import express from 'express'
import { signup,signin,updateuser,deleteuser, getUser ,sendresetLink,changepass} from '../controllers/user.controller.js';
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

router.route("/deleteuser").delete(
   authMiddleware,
   deleteuser
)

router.route("/getuser").get(
    authMiddleware,
    getUser
)

router.route("/resetlink").post(
   sendresetLink
)
router.route("/changepass/:token").post(
  changepass
)

export default router;