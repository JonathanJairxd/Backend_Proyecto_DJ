import {Router} from 'express'
import { actualizarProducto, detalleProducto, eliminarProducto, listarProducto, registrarProducto } from '../controllers/producto_controller.js'
const router = Router()

router.post('/producto/registro',registrarProducto)
router.get('/producto/listar', listarProducto)
router.get('/producto/detalle/:id',detalleProducto)
router.put('/producto/actualizar/:id',actualizarProducto)
router.delete('/producto/eliminar/:id',eliminarProducto)



export default router