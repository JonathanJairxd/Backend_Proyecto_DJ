import mongoose, { Schema, model } from 'mongoose'
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
    // Para realizar compras, si el cliente tiene un carrito o historial de pedidos
    historialCompras: [{
        tipoDisco: String, // Ejemplo: "Vinilo LP"
        cantidad: Number,
        precioUnitario: Number,
        fechaCompra: { type: Date, default: Date.now }
    }],
    // Para gestionar la reserva de eventos
    reservasEventos: [{
        eventoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Evento' }, // Relacionado a un modelo de "Evento"
        fechaReserva: { type: Date, default: Date.now },
        estado: { type: String, enum: ['pendiente', 'confirmado', 'cancelado'], default: 'pendiente' }
    }],
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
