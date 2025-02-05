import { Schema, model } from 'mongoose'
import bcrypt from "bcryptjs"

const clienteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    },
    ciudad: {
        type: String,
        required: true,
        trim: true
    },
    // En este apartado se puede agregar historial de compras
    // Y asi mismo un aprtado para la gestion de reservas de eventos
    status: {
        type: Boolean,
        default: true
    },
    token:{
        type:String,
        default:null
    },
    confirmEmail: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Método para cifrar el password del cliente
clienteSchema.methods.encrypPassword = async function(password) {
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password, salt)
    return passwordEncryp
}

// Método para verificar si el password ingresado es el mismo de la BDD
clienteSchema.methods.matchPassword = async function(password) {
    const response = await bcrypt.compare(password, this.password)
    return response
}

clienteSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}

export default model('Cliente', clienteSchema)
