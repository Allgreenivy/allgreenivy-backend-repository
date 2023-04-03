import express from "express";
import { Login, RegisterUser } from "../controller/userController";
const router = express.Router();

router.get('/test', function(req, res){
    res.status(200).send("Hello world")
})
router.post('/sign-up', RegisterUser)
router.post('/login', Login)
export default router;
