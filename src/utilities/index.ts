import bcrypt from 'bcrypt'
import Jwt, { JwtPayload } from 'jsonwebtoken'
import Joi from 'joi'
import  mongoose  from 'mongoose';
import crypto from 'crypto'


export const registerSchema = Joi.object().keys({
    email: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().regex(/[a-z0-9]{3,30}/),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    // confirm_password: Joi.ref('password')
    confirm_password: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match here" }),
  });

  //To remove the unnecessary character that includes in console.log output of the user error message.
export const option = {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  };
// Generating of salt code

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
  };

export const createPasswordResetToken = async (token:any)=>{
  const resetToken = crypto.randomBytes(32).toString("hex")
  let passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  let passwordResetExpires = Date.now() + 30 * 60 * 1000
  return passwordResetToken
}
  export const validatePassword = async (
    enteredPassword: string,
    savedPassword: string,
    salt: string
  ) => {
    return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
  };

 //generating token or signature for the user.
export const GenerateSignature = async (_id: any) => {
  return Jwt.sign(_id, process.env.SECRET!, { expiresIn: "1d" }); //for week use 'w', for month use 'm', for day use 'd', for minutes use 'min', for hour use 'hour'
};
//Verifying the signature of the user before allowing login
export const verifySignature = async (signature: string) => {
  return Jwt.verify(signature, process.env.SECRET!) as unknown as JwtPayload;
};

export const validateMongoId = (id: string)=>{
    const isValid = mongoose.Types.ObjectId.isValid(id)
    if(!isValid){
        Error ("Invalid ID")
    }
}