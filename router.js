const express=require('express')
const {signup,signin, fetchuser, fetchallusers, deleteUser, updateUser}=require("./CONTROL.js")
const router=express.Router()
router.post("/signup",signup)
router.post("/signin",signin)
router.get("/fetchuser",fetchuser)
router.get("/fetchallusers",fetchallusers)
router.delete("/delete/:id",deleteUser)
router.put("/update/:id",updateUser)
module.exports=router