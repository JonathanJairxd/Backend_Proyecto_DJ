import Venta from "../models/Venta.js"
import Producto from "../models/Producto.js"
import Cliente from "../models/Cliente.js"
import mongoose from "mongoose"

const registrarVenta = async (req, res) => {
    const { clienteV, productosV } = req.body

    // Validar que no haya campos vacios
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    }

    // Validar que los productos del arreglo no esten vacios
    if (!Array.isArray(productosV) || productosV.length === 0) {
        return res.status(400).json({ msg: "Debe haber al menos un producto en la venta" })
    }

    // Verificar si el cliente existe en la base de datos
    const clienteExistente = await Cliente.findById(clienteV)
    if (!clienteExistente) {
        return res.status(404).json({ msg: `Cliente con ID: ${clienteV} no encontrado` })
    }

    // Calcular el total de la venta
    let totalV = 0
    for (const productoVenta of productosV) {
        const producto = await Producto.findById(productoVenta.productoId);
        if (!producto) {
            return res.status(404).json({ msg: `Producto con ID: ${productoVenta.productoId} no encontrado` });
        }

        // Verificar si hay suficiente stock disponible
        if (producto.stock < productoVenta.cantidad) {
            return res.status(400).json({ msg: `No hay suficiente stock para el producto: ${producto.nombre}` });
        }

        // Asignar el precio del producto al campo precioUnitario en la venta
        productoVenta.precioUnitario = producto.precio

        // Calcular el total de la venta
        totalV += producto.precio * productoVenta.cantidad;

        // Reducir el stock del producto
        producto.stock -= productoVenta.cantidad;

        // Guardar los cambios en el producto
        await producto.save();
    }

    // Crear la nueva venta
    const nuevaVenta = new Venta({
        cliente: clienteV,
        productos: productosV,
        total: totalV,
        // se traen los datos del cliente
        direccionEnvio: clienteExistente.direccion, 
        nombreCliente: clienteExistente.nombre, 
        numeroContacto: clienteExistente.telefono
    })

    // Guardar la venta en la base de datos
    await nuevaVenta.save()

    res.status(200).json({ msg: "Venta registrada con éxito" })
}

const listarVenta = async (req, res) => {
    try {
        const ventas = await Venta.find().select("-createdAt -updatedAt -__v")
        res.status(200).json(ventas)
    } catch (error) {
        res.status(404).json({ msg: "Hubo un error al obtener la lista de ventas" })
    }
}

const detalleVenta = async (req, res) => {
    const { id } = req.params

    // Verificar si el id es valido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el producto con ID: ${id}` })
    }

    // Buscar la venta en la base de datos
    const venta = await Venta.findById(id).select("-createdAt -updatedAt -__v")

    // Verificar si el producto existe en la base de datos 
    if (!venta) {
        return res.status(404).json({ msg: `Venta con ID: ${id} no encontrado o fue eliminado` })
    }

    res.status(200).json(venta)
}

const actualizarVenta = (req, res) => {
    res.send("actualizar venta")
}

const eliminarVenta = (req, res) => {
    res.send("eliminar venta")
}

export {
    registrarVenta,
    listarVenta,
    detalleVenta,
    actualizarVenta,
    eliminarVenta
}