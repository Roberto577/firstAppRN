const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const { expressjwt: jwt } = require('express-jwt');

//middleware
const requireSingIn = jwt({
    secret: process.env.JWT_SECRET, algorithms: ['HS256']
})

//REGISTER
const registerController = async (req,res) => {
    try {
        const {name,email,password} = req.body;
        //validation
        if(!name){
            return res.status(400).send({
                success: false,
                message: 'name is required'
            });
        }
        if(!email){
            return res.status(400).send({
                success: false,
                message: 'email is required'
            });
        }
        if(!password || password.length < 6){
            return res.status(400).send({
                success: false,
                message: 'password is required and 6 character long'
            });
        }

        //Existing user
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(500).send({
                success: false,
                message: 'User already Register with this Email'
            })
        }

        //hashed password
        const hashedPassword = await hashPassword(password);

        //save user
        const user = await userModel({
            name,
            email,
            password: hashedPassword,
        }).save();

        return res.status(201).send({
            success: true,
            message: 'Registration Successfull, please Login'
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in register API',
            error,
        });
    }
};

//LOGIN
const loginController = async (req,res) => {
    try {
        const {email,password} = req.body;

        //validation
        if(!email || !password){
            console.log('vacio')
            return res.status(500).send({
                success: false,
                message: 'Please provide Email or Password'
            })
        }
        //find user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(500).send({
                success: false,
                message: 'User Not Found'
            })
        }
        //match password
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(500).send({
                success: false,
                message: 'Invalid username or password'
            })
        }

        //TOKEN JWT
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{
            expiresIn: '7d',
        });

        //Password undefined
        user.password = undefined;
        //Si todas las validaciones son exitosas login successfully
        res.status(200).send({
            success: true,
            message: 'login successfully',
            token,
            user,
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message:'error in login api',
            error
        })
    }
}

//UpdateUser
const updateUserController = async (req,res) => {
    try {
        const {name,password,email} = req.body;
        //user find
        const user = await userModel.findOne({email});
        //password validate
        if(password && password.length < 6){
            return res.status(400).send({
                success: false,
                message: 'Password is required and should be 6 character long'
            })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        //updated user
        const updatedUser = await userModel.findOneAndUpdate({email}, {
            name: name || user.name,
            password: hashedPassword || user.password
        },{new:true})
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: 'Profile updated please Login',
            updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error In User Update Api',
            error
        })
    }
}

module.exports = { requireSingIn, registerController, loginController, updateUserController };