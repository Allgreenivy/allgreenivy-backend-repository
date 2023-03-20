import express, { Request, Response } from "express";
import { UserAttributes, userModel } from "../model/userModel";
import bcrypt from "bcrypt";
import {
  GeneratePassword,
  GenerateRefreshToken,
  GenerateSalt,
  GenerateSignature,
  loginSchema,
  option,
  registerSchema,
  validatePassword,
} from "../utils";

export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      phoneNumber,
      password,
      firstName,
      lastName,
      confirm_password,
    } = req.body;
    const validateResult = registerSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    //Generate Salt
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    //Check if the user exist.
    const User = await userModel.findOne({ where: { email: email } });

    if (!User) {
      const user = await userModel.create({
        email,
        password: userPassword,
        firstName,
        lastName,
        salt,
        phoneNumber,
      });

      //Check if the user exist.
      const User = (await userModel.find({
        email: email,
      })) as unknown as UserAttributes;

      //Generate a signature
      const signature = await GenerateSignature({
        id: User._id,
        email: User.email,
      });
      console.log(signature);

      return res.status(201).json({
        messsage: "User successfully created",
        signature,
      });
    }
    return res.status(400).json({
      message: "User already exit",
    });

    //console.log(userPassword)
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/user/signup",
    });
    console.log(error);
  }
};

/**==========================Login User ================================ */

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    //Check if the user exist
    const User = await userModel.findOne({ email });
    console.log(User?._id);

    if (User) {
      const refreshToken = await GenerateRefreshToken(User?._id);

      const updateUser = await userModel.findOneAndUpdate(
        User?._id,
        {
          refreshToen: refreshToken,
        },
        {
          new: true,
        }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      console.log(refreshToken);
    }

    const validation = await bcrypt.compare(password, User!.password);
    if (validation) {
      const signature = await GenerateSignature({
        _id: User?._id,
        email: User?.email,
      });
      // const validation = await bcrypt.compare(password, User?.password)
      return res.status(200).json({
        message: "You have successfully logged in",
        email: User?.email,
        signature,
      });
    }
    return res
      .status(400)
      .json({ message: "Wrong Username or password / not varified user" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Error: `Internal Server ${error}`,
      route: "/user/signup",
    });
  }
};
