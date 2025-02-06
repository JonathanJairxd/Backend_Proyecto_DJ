import {Router} from 'express'
import { actualizarVenta, detalleVenta, eliminarVenta, listarVenta, registrarVenta } from '../controllers/venta_controller.js'
const router = Router()

router.post('/venta/registro', registrarVenta)

router.get('/venta/listar', listarVenta)

router.get('/venta/detalle/:id', detalleVenta)

router.put('/venta/actualizar/:id', actualizarVenta)

router.delete('/venta/eliminar/:id', eliminarVenta)


export default router