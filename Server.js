const express=require('express')
const app=express()
const mongoose=require('mongoose')
const bodyparser=require("body-parser")
app.use(bodyparser.json())
require("dotenv").config()

const port=3000
const routes=require("./router.js")
mongoose.connect(process.env.DATABASE).then(()=>{console.log("Database connected successfully")}).catch((err)=>{console.log(err)})
app.use('/api',routes)
app.listen(port,()=>console.log(`App listening on ${port}`));