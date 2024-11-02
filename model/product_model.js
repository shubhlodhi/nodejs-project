import mongoose from "mongoose";
// with the help of mongoose

// create a schema to store the data inot database
// in a proper format
const productlist = new mongoose.Schema({
    id:String,
    name:String,
    stock:String,
    price:String,

})
// to show on the database use the model function to define the name and db format
// export the model module
export const productlistmodel = mongoose.model("productlistmodel" , productlist) 

// in the cart schema create a new schema which takes the another schema
// as a refrence and also able to store the id of an product schema
// as an array elements , it stores objectid of produttlist schema
const newcartitems = new mongoose.Schema({
    products:[{ type: mongoose.Schema.Types.ObjectId  , ref:"productlistmodel" }],
    total:{type:Number ,default:0 }
})
export const newcartitemsdb = mongoose.model("newcartitemsdb" , newcartitems)

// schema for a new user registration
const regitseruser = new mongoose.Schema({
    userdetails : {
        type:String,
        required :true


    } 
})

export const useregister = mongoose.model("verifyuser" , regitseruser)