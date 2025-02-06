import Producto from "../models/Producto.js"
import mongoose from "mongoose"

const registrarProducto = async (req, res) => {
    const { nombreDisco, artista, precio, genero, stock } = req.body

    // Validar que no haya campos vacios
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    }

    // Validar que el precio y el stock sean numeros validos
    if (isNaN(precio) || isNaN(stock)) {
        return res.status(400).json({ msg: "El precio y el stock deben ser números válidos" })
    }

    // Verificar si el producto ya esta registrado en la base de datos
    const verificarProductoBDD = await Producto.findOne({ nombreDisco })
    if (verificarProductoBDD) {
        return res.status(400).json({ msg: "Lo sentimos, el producto ya se encuentra registrado" })
    }

    // Crear el nuevo producto
    const nuevoProducto = new Producto({
        nombreDisco,
        artista,
        precio,
        genero,
        stock
    })

    // Guardar el producto en la base de datos
    await nuevoProducto.save()
    console.log("Producto registrado: ",nuevoProducto)

    // Se responde con exito y los detalles del producto registrado 
    res.status(200).json({ msg: "Producto registrado con éxito"})
}

const listarProducto = async (req, res) => {
    try {
        const productos = await Producto.find().select("-createdAt -updatedAt -__v")
        res.status(200).json(productos)
    } catch (error) {
        res.status(404).json({ msg: "Hubo un error al obtener la lista de productos" })
    }
}

const detalleProducto = async (req, res) => {
    const { id } = req.params

    // Verificar si el id es valido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el producto con ID: ${id}` })
    }
    
    // Buscar el producto en la base de datos
    const producto = await Producto.findById(id).select("-createdAt -updatedAt -__v")

    // // Verificar si el producto existe en la base de datos () si se encontro
    if (!producto) {
        return res.status(404).json({ msg: `Producto con ID: ${id} no encontrado o ya fue eliminado` })
    }

    // Detalles del producto
    res.status(200).json(producto)
}


const actualizarProducto = async (req, res) => {
    const { id } = req.params

    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    }

    // Verificar que el id sea valido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el producto con ID: ${id}` })
    }

    // Verificar si el producto existe en la base de datos
    const producto = await Producto.findById(id);
    if (!producto) {
        return res.status(404).json({ msg: `Producto con ID: ${id} no encontrado o ya fue eliminado` })
    }

    // {new:true} : indica a Mongoose que despues de actualizar un documento
    // devuelva la version mas reciente que se actualizo
    await Producto.findByIdAndUpdate(id, req.body, { new: true })


    
    res.status(200).json({ msg: "Producto actualizado con éxito"})
}

const eliminarProducto = async (req, res) => {
    const { id } = req.params

    // Verificar que el id sea valido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el producto con ID: ${id}` })
    }

    // Verificar si el producto existe en la base de datos (si ya fue eliminado)
    const producto = await Producto.findById(id);
    if (!producto) {
        return res.status(404).json({ msg: `El producto con ID: ${id} ya ha sido eliminado` });
    }

    // Se elimina el producto de la base de datos
    await Producto.findByIdAndDelete(id)

    res.status(200).json({ msg: "Producto eliminado exitosamente" })
}



export {
    registrarProducto,
    listarProducto,
    detalleProducto,
    actualizarProducto,
    eliminarProducto
}