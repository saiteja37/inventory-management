const jwt=require("jsonwebtoken")
module.exports=function(req,res,next){
    try{
        let token=req.header('x-token')
        if(!token){
            return res.json("token not found")
        }
        else{
            let decode=jwt.verify(token,'jwtsecret');
            req.user=decode.user
            next();
        }
    }
    catch(err){

    }
}