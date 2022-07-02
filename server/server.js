const cors=require("cors")
const express=require("express")
const mongoose=require("mongoose")
const alert=require("alert")
const jwt=require("jsonwebtoken")
const middleware = require("./middleware")
const app=express();
app.use(express.json());
app.use(cors());
app.listen("1000",(req,res)=>{
    console.log("ok")
})
mongoose.connect("mongodb://localhost:27017/inventory",{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
    if(!err){console.log("connected")}
    else{console.log("noit connected")}
})
const schem=mongoose.Schema({
    "name":String,
    "email":String,
    "pass":String,
})
const User=mongoose.model("user",schem)
const ca=mongoose.Schema({
    "cate":String,
    "img":String
})
const Cate=mongoose.model("categorie",ca)
const pr=mongoose.Schema({
    "ca":
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"categorie"
    },
    "pro":String,
    "image":String,
    "price":String
})
const Pro=mongoose.model("product",pr)
app.post("/reg",async(req,res)=>{
    const {name,email,pass}=req.body;
    const use=new User({
        name,email,pass
    })
    let exist=await User.findOne({email:email});
    if(exist){

        alert("user exist")
    }
    else{
       await  use.save();
        alert("user registered")
    }
})
app.post("/login",async(req,res)=>{
    const {email,pass}=req.body;
    let exist=await User.findOne({email:email});
    if(exist){
        if(exist.pass===pass){
            let payload={
                user:{
                    id:exist.id
                }
            }
            jwt.sign(payload,'jwtsecret',{expiresIn:3600000},
            (err,token)=>{
                if(!err){
                    return res.json(token)
                }
            })

            alert("logged in successfully")
        }
        else{
            alert("wrong password")
        }
    }
    else{
        alert("user not exist")
    }
})

app.get("/profile",middleware,async(req,res)=>{
    const exist=await User.findById(req.user.id)
    return res.json(exist)
})
app.post("/upd",middleware,async(req,res)=>{
    const {name,email}=req.body
    const _id=req.user.id
    const result=await User.updateOne({_id},{
        $set:{
            name:name,
            email:email
        }
    })
})
app.post("/cate",middleware,async(req,res)=>{
    const{cate,img}=req.body
    const use=new Cate({
        cate,img
    })
    let exist=await Cate.findOne({cate:cate})
    if(exist)
    alert("Category already exist")
    else
    {
        use.save();
        alert("category saved successfully")
    }
    const result=await Cate.find()
    return res.json(result)
})
app.get("/list",middleware,async(req,res)=>{
    let exist=await Cate.find();
    return res.json(exist)
})
app.post("/delc",middleware,async(req,res)=>{
    const {_id}=req.body
    let result=await Cate.findByIdAndDelete({_id:_id});
})
app.post("/pro",middleware,async(req,res)=>{
    const {ca,pro,image,price}=req.body;

    const us=new Pro({
        ca,pro,image,price
    })
    let exist=await Pro.findOne({pro:pro})
    if(exist)
    return res.json(exist)
    
    else
    {
        us.save();
        alert("product saved")
    }
})
app.post("/info",middleware,async(req,res)=>{
    const {cate}=req.body;
    let exist=await Cate.findOne({cate:cate})
    return res.json(exist._id)
})
app.post("/dep",middleware,async(req,res)=>{
    const {ca}=req.body;
    let exist=await Pro.find({ca:ca})
    return res.json(exist)
})
app.post("/delp",middleware,async(req,res)=>{
    const {_id}=req.body
    await Pro.findByIdAndDelete({_id:_id})
})
app.post("/updp",middleware,async(req,res)=>{
    const {_id,ca,pro,price,image}=req.body
    const result=await Pro.updateOne({_id},{
        $set:{
            ca:ca,
            pro:pro,
            price:price,
            image:image
        }
    })
})