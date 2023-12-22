const crud=require("./model.js")
const crypto = require('crypto');
const validator=require("validator")
exports.signup=async(req,res)=>{
 
    const {mobile,password,DOB,email}=req.body;
    const{ confirmPassword ,...datastore}=req.body;
    const duplicate=await crud.findOne({mobile})
    if(duplicate){
        return res.status(200).json({message:"Mobile already existing"})
    }
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    req.body.password = hash;
    const currentDate = new Date();
    const birthDate = new Date(DOB);
  
    // Calculate the difference in years
    let age = currentDate.getFullYear() - birthDate.getFullYear();
  
    // Check if the birthday has occurred this year
    const currentMonth = currentDate.getMonth();
    const birthMonth = birthDate.getMonth();
  
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    if(age<18){
        return res.status(400).json({message:"You should anter an age above 18"})
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!validator.isEmail(email) && !emailRegex.test(email)){
        return res.status(400).json({message:"Enter a valid Email ID"})
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
      }
      
        try {
            const user = await crud.create(datastore)
        res.status(200).json({
          success: true,
          user
      })
        } catch (error) {
            res.status(400).json({error:error.message})
        }
}
exports.signin=async(req,res)=>{
    const{mobile,password}=req.body
    const hashedpassword=crypto.createHash('sha256').update(password).digest('hex');
    if(!mobile){
        return res.status(400).json({message:"Mobile number is necessary"})
    }
    if(!password){
        return res.status(400).json({message:"Password is necessary"})
    }
    const user= await crud.findOne({mobile})
    
    if(!user){
        return res.status(400).json({message:"User not existing"})
    }
    if(user.password!=hashedpassword){
        return res.status(400).json({message:"Password is not valid"})
    }
  
    return res.status(200).json({message:"User logged in successfully"})
}
exports.fetchuser=async(req,res)=>{
    const{mobile}=req.body
    const user= await crud.findOne({mobile})
    if(!user){
        return res.status(400).json({message:"User not found"})
    }
    try {
        return res.status(200).json({user})
    } catch (error) {
        return res.status(400).json({error:error.message})
    }

}
exports.fetchallusers=async(req,res)=>{
    const users= await crud.find()
    if(!users){
        return res.status(400).json({message:"No users registered"})
    }
    try {
        return res.status(200).json({users})
    } catch (error) {
        return res.status(400).json({error:error.message})
    }

}
exports.deleteUser=async(req,res)=>{
    await crud.findOneAndDelete(req.params.id)
    return res.status(200).json({
        message:"User deleted successfully"
    })

}
exports.updateUser=async(req,res)=>{
        try {
            const{email,DOB,firstName,middleName,lastName,aadhar,password,address,state,city,pincode}=req.body
            const currentProfile=await crud.findById(req.params.id)
            const data={
                email:email||currentProfile.email,
                DOB:DOB||currentProfile.DOB,
                firstName:firstName||currentProfile.firstName,
                middleName:middleName||currentProfile.middleName,
                lastName:lastName||currentProfile.lastName,
                aadhar:aadhar||currentProfile.aadhar,
                password:crypto.createHash('sha256').update(password).digest('hex')||crypto.createHash('sha256').update(currentProfile.password).digest('hex'),
                address:address||currentProfile.address,
                state:state||currentProfile.state,
                city:city||currentProfile.city,
                pincode:pincode||currentProfile.pincode
            }
            const profileUpdate=await crud.findByIdAndUpdate(req.params.id,data,{new:true})
            return  res.status(200).json({success:true,profileUpdate})
        } catch (error) {
            return res.status(400).json({error:error.message})
        } 
        
}