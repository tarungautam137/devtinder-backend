const validator=require("validator")

const validate=(req)=>{
        
    const {firstName,lastName,email,password} = req.body;
    

    if(!firstName || !lastName || !email || !password){
        throw new Error("All fields are required")
    }
    if(firstName.length<4 || lastName.length<4){
        throw new Error("Name must be atleast 4 characters long")
    }
    if(!validator.isEmail(email)) throw new Error("Invalid email address")
    if(!validator.isStrongPassword(password)) throw new Error("Password must be atleast 8 characters long and must contain a number and a special character")
}

const validateDataToBeUpdated = (data)=>{

    const allowedFields=["firstName", "lastName", "age","gender","photoUrl","about"];

    const canProceed=Object.keys(data).every(field=>allowedFields.includes(field))

    return canProceed
}
const validatePassword=(newpassword)=>{

    return validator.isStrongPassword(newpassword);
}
module.exports={validate, validateDataToBeUpdated, validatePassword}