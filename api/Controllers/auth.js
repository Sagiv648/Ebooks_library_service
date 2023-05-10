import jwt from 'jsonwebtoken'
import userModel from '../Models/user.js'

export const auth = async (req,res, next) => {
    if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer "))
        return res.status(401).json({error: "unauthorized"})
    const authorization = req.headers.authorization.split(' ')
    if(authorization.length != 2)
        return res.status(401).json({error: "unauthorized"})

    try {
        jwt.verify(authorization[1], process.env.KEY, async (err, payload) => {
            if(err)
                return res.status(401).json({error: "unauthorized"})

            const exists = await userModel.findById(payload.id)
            if(exists)
            {
                req.data = payload;
                next();
            }
            else
                return res.status(401).json({error: "unauthorized"})
        })
    } catch (error) {
        return res.status(500).json({error: "server error"})
    }
}