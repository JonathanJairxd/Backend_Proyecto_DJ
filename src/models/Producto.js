import { Schema, model } from 'mongoose';

const productoSchema = new Schema({
    nombreDisco: {
        type: String,
        required: true,
        trim: true
    },
    artista: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true
    },
    genero: {
        type: String,
        required: true,
        enum: ['Rock', 'Pop', 'Jazz', 'Electrónica', 'Hip-Hop', 'Clásica', 'Otro']
    },
    stock: {
        type: Number,
        required: true,
        default: 0 // Valor por defecto en caso de que no haya stock
    }
}, {
    timestamps: true
})

export default model('Producto', productoSchema)
