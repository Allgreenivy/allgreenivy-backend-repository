import express from "express";
const router = express.Router();


router.get('/test', function(req, res){
    res.status(200).send("Hello world")
})

export default router;
