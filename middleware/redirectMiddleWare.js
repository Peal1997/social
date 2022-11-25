import parser from 'cookie-parser'
import User from '../models/User.js'
import { verifyToken } from '../utility/jwt.js'
import { validate } from '../utility/validate.js'

export const redirectMiddleWare = async (req , res ,next) => {
      try {
       const token = req.cookies.authtoken
       if(token){
            const userToken = verifyToken(token)
            if(userToken){
                
               const userData = await User.findById(userToken.id)
                 if(userData){
                     next()
                 }else {
                     delete req.session.user;
                     res.clearCookie('authtoken')
                      validate('session out' , '/login' , req, res)
                         
                 }
               
            
              }
       }else{
              delete req.session.user;
              res.clearCookie('authtoken')
               validate('You are not authorised' , '/login' , req, res)
       }
    
      } catch (error) {
       delete req.session.user;
       res.clearCookie('authtoken')
       validate('Invalid Token' , '/login' , req, res)
      }

}


