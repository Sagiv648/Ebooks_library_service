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

export const emailTokenAuth = async (req,res,next) => {
    
    const {payload} = req.params;
    console.log(payload);
    if(!payload)
        return res.status(401).json({error: "invalid link"})
    try {
        jwt.verify(payload, process.env.EMAIL_CONFIRMATION_SECRET, (err, payload) => {
            if(err)
                return res.status(401).json({error: "invalid link"})
            req.data = payload;
            next();
        })
    } catch (error) {
        
    }
}
export const isRingZero = async (req,res,next) => {
    const {privilege,id} = req.data;
    try {
        const user = await userModel.findById(id).select('privilege')
        if(privilege !== user.privilege || privilege !== 0)
            return res.status(403).json({error: "forbidden"})
        next()
    } catch (error) {
        return res.status(500).json({error: "server error"})
    }
}
export const isPrivileged = async (req,res,next) => {

    const {privilege,id} = req.data;
    try {
        const user = await userModel.findById(id).select('privilege')
        if(privilege !== user.privilege || privilege === 2)
            return res.status(403).json({error: "forbidden"})
        next()
    } catch (error) {
        return res.status(500).json({error: "server error"})
    }

}