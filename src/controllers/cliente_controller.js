import Cliente from "../models/Cliente.js"
import {sendMailToCliente, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import mongoose from "mongoose"
import generarJWT from "../helpers/crearJWT.js"


const registrarCliente = async (req, res) => {
    const { email } = req.body;

    // Validar que no haya campos vacíos
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    }

    // Verificar si el email ya está registrado
    const verificarEmailBDD = await Cliente.findOne({ email })
    if (verificarEmailBDD) {
        return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" })
    }

    // Crear nuevo cliente
    const nuevoCliente = new Cliente(req.body);

    // Generar contraseña aleatoria con prefijo "dj"
    const password = Math.random().toString(36).slice(2);
    nuevoCliente.password = await nuevoCliente.encrypPassword("dj" + password)

    // Enviar correo de bienvenida con la contraseña
    await sendMailToCliente(email, "dj" + password)

    // Guardar cliente en la base de datos
    await nuevoCliente.save()

    res.status(200).json({ msg: "Su registro se ha completado con éxito. Por favor revise su correo" })
}

const loginCliente = async (req, res) => {
    const { email, password } = req.body

    // Verificar que todos los campos estén llenos
    if (Object.values(req.body).includes("")) 
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    

    // Buscar al cliente en la base de datos
    const clienteBDD = await Cliente.findOne({ email });
    if (!clienteBDD) {
        return res.status(404).json({ msg: "Lo sentimos, el email no se encuentra registrado" })
    }

    // Verificar si el password es correcto
    const verificarPassword = await clienteBDD.matchPassword(password);
    if (!verificarPassword) {
        return res.status(401).json({ msg: "Lo sentimos, la contraseña es incorrecta" })
    }

    // Generar token JWT
    const token = generarJWT(clienteBDD._id, "Cliente")
    
    // Extraer datos del cliente
    const { nombre, telefono, direccion, ciudad, _id } = clienteBDD;

    // Respuesta exitosa
    res.status(200).json({
        token,
        nombre,
        email,
        telefono,
        direccion,
        ciudad,
        _id,
        email: clienteBDD.email
    });
}

const perfilCliente = (req, res) => {

    if (!req.clienteBDD) {
        return res.status(404).json({ msg: "Cliente no encontrado" });
    }
    delete req.clienteBDD.token
    delete req.clienteBDD.confirmEmail
    delete req.clienteBDD.createdAt
    delete req.clienteBDD.updatedAt
    delete req.clienteBDD.__v

    res.status(200).json(req.clienteBDD)
}

const listarClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find({ status: true }).select("-createdAt -updatedAt -__v -password -token -confirmEmail -direccion -ciudad")

        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al obtener la lista de clientes" })
    }
}

const detalleCliente = async(req,res)=>{
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el cliente con ID: ${id}` });
    }
    
    const cliente = await Cliente.findById(id).select("-createdAt -updatedAt -__v -token -confirmEmail -password")
    
    res.status(200).json(cliente)
}

const eliminarCliente = async (req,res)=>{
    const {id} = req.params

    if (Object.values(req.body).includes("")) 
        return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    if( !mongoose.Types.ObjectId.isValid(id) ) 
        return res.status(404).json({msg:`Lo sentimos, no existe el cliente con ID: ${id}`})
    
    // Verificar si el producto existe en la base de datos (si ya fue eliminado)
    const cliente = await Cliente.findById(id);
    if (!cliente) {
        return res.status(404).json({ msg: `El producto con ID: ${id} ya ha sido eliminado` });
    }

    
    await Cliente.findByIdAndUpdate(id, { status: false })
    
    res.status(200).json({ msg: "Cuenta eliminada exitosamente" })
}

// Actualizar 
const actualizarCliente = async(req,res)=>{
    const {id} = req.params
    
    if (Object.values(req.body).includes("")) 
        return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el cliente con ID: ${id}` })
    }
    
    // Verificar si el cliente existe en la base de datos
        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).json({ msg: `Cliente con ID: ${id} no encontrado o ya fue eliminado` })
        }
    
    await Cliente.findByIdAndUpdate(id, req.body)
    
    res.status(200).json({msg:"Actualización exitosa"})
}

const actualizarPassword = async (req, res) => {
    const clienteBDD = await Cliente.findById(req.clienteBDD._id)
    
    if (!clienteBDD) 
        return res.status(404).json({ msg: `Lo sentimos, no existe el cliente con ID ${req.clienteBDD._id}` })

    const verificarPassword = await clienteBDD.matchPassword(req.body.passwordactual)
    
    if (!verificarPassword) 
        return res.status(404).json({ msg: "Lo sentimos, el password actual no es el correcto" })

    clienteBDD.password = await clienteBDD.encrypPassword(req.body.passwordnuevo)
    
    await clienteBDD.save()
    
    res.status(200).json({ msg: "Password actualizado correctamente" })
}


// Recuperar contrseña

const recuperarPassword = async (req, res) => {
     // Datos del request
    const { email } = req.body

    // Validar campos vacios
    if (Object.values(req.body).includes("")) 
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    // Validar si el correo existe en la base de datos
    const clienteBDD = await Cliente.findOne({ email })
    if (!clienteBDD) 
        return res.status(404).json({ msg: "Lo sentimos, el email no está registrado" })

    // Interaccion con la base de datos
    const token = clienteBDD.crearToken()
    clienteBDD.token = token
    await sendMailToRecoveryPassword(email, token, false)
    await clienteBDD.save();
    
    res.status(200).json({ msg: "Revisa tu correo electrónico para restablecer tu cuenta" })
}

const comprobarTokenPassword = async (req, res) => {
    
    // Verificar que el token exista
    if (!req.params.token) 
        return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })


    // Comprobar si el token es válido
    const clienteBDD = await Cliente.findOne({  token: req.params.token })
    if (clienteBDD?.token !== req.params.token) 
        return res.status(404).json({ msg: "Lo sentimos, el token no es válido jjxd" })

    await clienteBDD.save()

    res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" })
}

const nuevoPassword = async (req, res) => {
    const { password, confirmpassword } = req.body;
    // Verificar campos vacios
    if (Object.values(req.body).includes("")) 
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    // Confirmar si las contraseñas son iguales
    if (password !== confirmpassword) 
        return res.status(404).json({ msg: "Lo sentimos, las contraseñas no coinciden" });

    const clienteBDD = await Cliente.findOne({ token: req.params.token });
    if (clienteBDD?.token !== req.params.token) 
        return res.status(404).json({ msg: "Lo sentimos, el token no es válido o ha expirado" });

    clienteBDD.token = null;
    clienteBDD.password = await clienteBDD.encrypPassword(password);
    await clienteBDD.save();
    
    res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password" });
}


export {
    loginCliente,
    perfilCliente,
    listarClientes,
    detalleCliente,
    registrarCliente,
    actualizarCliente,
    eliminarCliente,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword,
    actualizarPassword
}
