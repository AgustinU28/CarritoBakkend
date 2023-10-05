import passport from "passport";
import local from "passport-local";
import UserModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2';
import * as dotenv from 'dotenv';
import UsersDTO from '../dto/users.dto.js'

dotenv.config();

 const GITHUB_CLIENT_ID =process.env.GITHUB_CLIENT_ID;
 const GITHUB_CLIENT_SECRET =process.env.GITHUB_CLIENT_SECRET;
 const GITHUB_CALLBACK_URL =process.env.GITHUB_CALLBACK_URL;


const localStrategy = local.Strategy;

const initializePassport = async () =>{
    passport.use('register', new localStrategy(
        {passReqToCallback:true, usernameField: 'email'}, async (req, username, password, done) =>{
            const {first_name, last_name, email, age} = req.body;
            try{
                let user = await UserModel.findOne({email:username});

                if (user) {
                    console.log('user already exists');
                    return done(null, false)
                }

                const newUser = {first_name, last_name, email, age, password:createHash(password)};
                const formatedNewUser = new UsersDTO(newUser);
                formatedNewUser.currentCartID = req.body.currentCartID; 
                let result = await UserModel.create(formatedNewUser);
                console.log({result})
                return done(null, result);

            } catch (error) {
                return done('error al obtener el usuario'+error);
            }
        }
    ))
    passport.use('login', new localStrategy({passReqToCallback:true}, async(req, username, password, done)=>{
        try {
            const user = await UserModel.findOne({email: username})
            if (!user) {
                return done(null,false, {message:"usuario inexistente", status:false})
            } else{
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {message:"bad Password"});
                } else{
                    user.currentCartID = req.body.currentCartID;        
                    return done(null, user)
                }
            }
        } catch (error) {
            console.error("Authentication error:", error);
            return done(error);
        }
    })
    )
    passport.use('github', new GitHubStrategy({clientID: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET, callbackURL: GITHUB_CALLBACK_URL}, 
            async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await UserModel.findOne({email: profile._json.email}) || await UserModel.findOne({email: `${profile._json.login}@mail.com`})
                if (!user) {
                    const newUser = {
                        first_name: profile._json.login,
                        last_name: profile._json.login,
                        age:18,
                        email: profile._json.email ||`${profile._json.login}@mail.com`,
                        password:"[]",
                    }
                    let result = await UserModel.create(newUser);
                    return done(null, result);
                } else {
                    return done(null, user);
                }
            } catch (error) {
                return done(error)
            }
    }))
    
    passport.serializeUser((user,done)=>{
        done(null, user._id);
    })
    passport.deserializeUser(async (id,done)=>{
        let user = await UserModel.findById(id);
        done(null, user);
    })
}

export default initializePassport;