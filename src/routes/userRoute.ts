import express from "express";
import { Login, RegisterUser } from "../controller/userController";
const router = express.Router();

router.get('/', function(req, res){
    res.send("Welcome to AllGreenIVY company")
})
router.post('/sign-up', RegisterUser)
router.post('/login', Login)
export default router;
