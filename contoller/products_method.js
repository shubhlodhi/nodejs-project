import { productlistmodel , newcartitemsdb, useregister } from "../model/product_model.js";
import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken"

// add product function is used to add
// product on productmodel mongodb

export async function addproduct(req ,res) {
    // req the data from the body (thunderbolt)
    try {
    const {id , name , stock , price} = req.body
    

    // add the data to the product item model into mongo data base
    const productitem = await productlistmodel.create({
        id:id,
        name:name,
        stock :stock,
        price:price 
    })
    // check error if id is not found
    if(!productitem){
        return res.status(404).json({message: "data contains error"})
    }
    // save the item which si added on to the database 

    await productitem.save().then(data=>{
        res.send(data)
    })
}
catch{
    res.send("item is not added")
}
}

// show product is used to show the product items
export async function showproduct(req ,res){
    // find function work if any key is not passed then it shows
    // the whole items on productmodel
    try {
        await productlistmodel.find().then(data=>{
        res.send(data)
    })
} catch (err){
    res.send(res.json({message : "data is not found"}))

}
}
// show product by its id 
export async function showproductbyid(req ,res) {
    try{
    const id = req.params.id
    const findid = await productlistmodel.findById(id)
    if (!findid){
        res.status(404).json({message:"id is not found"})
    }
    res.send(findid)
    }

    catch{
        res.send("error occured in code")
    }
    
    
}
// edit product
export async  function editproduct(req ,res){
    // take the id of an item which is nedd to be edit
    try{
    const id =  req.params.id
    // find the id on the product model database
    const productid = await productlistmodel.findById(id)
    // if id not found then show the rror status and message
    if( !productid){
        return res.status(404).json({message: "id is not found"})
    }
    // Object.keys function is used to take the keys of key-value pair
    // request the keys from the body
    const keys = Object.keys(req.body)
    if(!keys){
        return res.status(400).json({message: "body is not defined is  ont properly "})    }
    keys.forEach(data=>{
        productid[data] = req.body[data]
    })
    // save the item on database
    productid.save().then(data=>{
        res.send(data)
    })
}
    catch {
        res.send("error is found on call")

    }

    
} 
// delete the item from the db
export async function deleteproduct(req ,res){
    // request the item id
    const id  = req.params.id
    // if not found return error
    if(!id){
        return res.status(404).json({message:"is is not found"})
    }
    // check the id in product model database and delete by using
    // the function findnyidandelete
    const prod_id = await productlistmodel.findByIdAndDelete(id)
    if(!prod_id){
        return res.status(404).json({message:"in products item id is not found"})
    }
    res.status(200).json({prod_id})



}
// add item on cart 
export async function addcart( req , res ){
    // request the id of an item which is used to be added on the 
    // cartmodel on database
    try{
    const {id} = req.body
    // find the id on the product model
    const findid = await productlistmodel.findById(id)
    // if not found return the status message 
    if(!findid){
        return res.status(404).json({message:"id is not found"})
    }
    // if found
    // create the newcartdb model import from the product_model.js
    // and check if its empty
    // push the id of the prduct item into the cart and increment the item
    // if not create the new one cartmodel on database

    let cartsaman = await newcartitemsdb.findOne()
    if (!cartsaman){
        cartsaman =  new newcartitemsdb()

    }
    cartsaman.products.push(findid)
    cartsaman.total += 1
    // and save the cart item on database

    await cartsaman.save().then(data=>{
        res.send(data)
    })
    }
    catch{
        res.json(404).json({message:"error found please check the code"})
    }
    
    
    
}
// show the cart item : async fucntion is used to prveent from callback error
export async function showcart(req ,res){
    // take id of cart from the request.body 
    // and id of cartitem 
    try{
    const {id , dataid} = req.body
    // find the id in new cart database
    // and populate the id :products array 
    // populate method is used to show the cartitem id's
    // full information  , products is an array on cart item database
    // which stores the id of an product items in a form array 
    // elements 
    const findid = await newcartitemsdb.findById(id).populate('products')
    if (!findid){
        return res.status(404).json({message:"id is not found"})
    }
    // const datainjson = findid.populate("productlist")
    // console.log("helo")
    // res.send(findid)
    const finddata = findid.products.filter(data => data._id == dataid)
       
    res.status(200).json({message:"data" , data:finddata})

    }
    catch{
        res.send("error occured on code")
    }
}
export async function editcartitems(req , res){
    // take the id of the cart 
    // and the id of an item want to update in cart
    const id = req.params.id
    const dataid = req.params.ids
    // find the cart id in cart model database 
    // populate the ids store in the cart item products array
    const cartid = await newcartitemsdb.findById(id).populate("products") 
    if (!cartid){
        return res.status(404).json({mesaage : " cart id is not found"})
    }
    // use find function in the product array of cart model db
    // to find the data object id
    const productid = cartid.products.find(data=>data._id.toString() === dataid)
    // if not found return not found message
    if(!productid){
        return res.status(404).json({mesaage:"prodcut id is not found"})
    }
    // if found the object id 
    // object.keys function is used to track the body keys 

    const keys = Object.keys(req.body)
    
    keys.forEach(data => {
        productid[data] = req.body[data]
        
    });
    // save the update keys

    await cartid.save()
    res.send(productid)
    

  

}

// delete cart
export async function deletecartitem(req ,res){

    const id = req.params.id
    const dataid = req.params.ids
    // const {id ,ids} = req.body
    // const cartId = mongoose.Types.ObjectId(id);

    const findid = await newcartitemsdb.findById(id).populate("products")
    if(!findid){
        return res.status(404).json({message:" cartid is not found"})
    }
    // use splice function to remove the id which is need to be deleted
    const dataui = findid.products.splice(dataid , 1)
    const total = findid.products.length

    // const dataids = await newcartitemsdb.findByIdAndUpdate(id , {$pull:{products: { _id:dataid } }},
    // {new:true}
    // )
    // if (!dataids){
        // return res.status(404).json({message:"data id is not found"})
    // }

    // save the update list on db
    await findid.save()
    res.send(dataui)
    // res.send(findid)


    
}
// register user function
export async function register_user(req ,res){
    // take the payload form the request body
    const {payload} = req.body

    // and import the json webtoken
    // and use the sign function to create the json web token 
    // for security reasons
    const jwt = jsonwebtoken.sign(payload , "secretkey")
    // and store the jwt token which is generated 
    // in the database
    const jew = await useregister.create({
        userdetails:jwt
    })
    // save the token on databse
    jew.save()
    res.send(jew)
}

// verify the user create the middle ware and use it for the cart item
export function verifysl(req ,res ,next){
    // this function is need to be verify the user 
    // if user registered or not

    // request from header of authorization in localhost calls
    // at authorization secrect key is available
    const verifieduser = req.headers["authorization"]

    // split the authorization value for only take 2 index 
    const verifiedusers = verifieduser && verifieduser.split(" ")[1]
    // if secretkey or sign is found then verify the sign else addcart
    // return error message
    if(!verifiedusers){
        return res.send({mesaage:"user is not registered , please sign up first"})
    }
// on verify function there is 3 arguments pass the payload , secretkey , header
    jsonwebtoken.verify(verifiedusers , "secretkey" , (err , payload)=>{
        if (err){
            res.json({message:"user is not registered"})
        }
        req.payload = payload
        
    })
    next()

}
