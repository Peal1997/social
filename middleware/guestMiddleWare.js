import parser from 'cookie-parser'
import { validate } from '../utility/validate.js'


export const guestMiddleWare = (req , res ,next) => {
    const token = req.cookies.authtoken
    if(token){
        validate('You are not allowed' , '/' , req, res)
    }else{
        next()
    }
 

}