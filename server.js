import express from "express"
import mongoose from "mongoose"
import { routes } from "./routes/routers.js"
// use express by creating the const variable
const app = express()
// connect the mongo db to the server.js file
mongoose.connect("mongodb://localhost:27017")
// check if the connection is successfully established
const db = mongoose.connection
// express router is used to create the specific route 
const router  = express.Router()
db.on("open" , ()=>
{
    console.log("connection is sucessfuly")
})

// app .listen is used to create the port and activate the server
app.listen(5100 , ()=>{
    console.log("port listen on 5100")
})
// express.json  is used to convert the data into json format
app.use(express.json())
app.use("/" , router)

routes(app)

