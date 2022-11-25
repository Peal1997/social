import jwt from 'jsonwebtoken'

export const makeToken = (payload , exp = 86400000) => {
     const token = jwt.sign(payload, process.env.SECRET_KEY , {
        expiresIn : exp
     })
     return token
}

//verify token
export const verifyToken = (token) => {
  return  jwt.verify(token, process.env.SECRET_KEY)
}
