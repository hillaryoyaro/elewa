import  express  from "express";
import { getUser,getUserFriends,addRemoveFriend } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
//create our router
const router = express.Router();

//Creating the READ routes
router.get("/:id",verifyToken,getUser);
router.get("/:id/friends",verifyToken,getUserFriends);

//Creating update route
router.patch("/:id/friendId",verifyToken,addRemoveFriend);


export default router;