import mongoose, { Schema, model } from 'mongoose'

const ventaSchema = new Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',  // Relaciona con el cliente que realiza la compra
        required: true
    },
    productos: [{
        productoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto',  // Relaciona con el producto que el cliente compra
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        },
        precioUnitario: {
            type: Number,
            required: true  // aqui se mantendra el precio del producto
        }
    }],
    total: {
        type: Number,
        required: true  // El total de la compra (suma de productos * cantidad)
    },
    fechaCompra: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['pendiente', 'completada', 'cancelada'],
        default: 'pendiente'  // Estado por defalt de la compra
    },
    direccionEnvio: {
        type: String,
    },
    nombreCliente: {
        type: String,
    },
    numeroContacto: {
        type: String,
    }
}, {
    timestamps: true
});

export default model('Venta', ventaSchema);
