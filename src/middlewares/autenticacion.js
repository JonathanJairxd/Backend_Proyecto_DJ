import jwt from 'jsonwebtoken'
import Administrador from '../models/Administrador.js'
import Cliente from '../models/Cliente.js'

const verificarAutenticacion = async (req, res, next) => {
    if (!req.headers.authorization) 
        return res.status(404).json({ msg: "Lo sentimos, debes proporcionar un token" })

    const { authorization } = req.headers
    
    try {
        const { id, rol } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        
        if (rol === "Administrador") {
            req.administradorBDD = await Administrador.findById(id).lean().select("-password")
            next();
        }
        else{
            req.clienteBDD = await Cliente.findById(id).lean().select("-password")
            next()
        }
    } catch (error) {
        const e = new Error("Formato del token no válido")
        return res.status(404).json({msg:e.message})
    }
};

export default verificarAutenticacion;
