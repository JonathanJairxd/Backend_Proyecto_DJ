import {Router} from 'express'
import { actualizarPassword, actualizarPerfil, comprobarTokenPasword, login, nuevoPassword, perfil, recuperarPassword } from '../controllers/administrador_controller.js'
import verificarAutenticacion from '../middlewares/autenticacion.js'

const router = Router()

// Autenticacion del administrador DJ
router.post('/login',login)

// Información del administrador
router.get('/perfil', verificarAutenticacion, perfil)
router.put('/admin/actualizarperfil/:id', verificarAutenticacion,actualizarPerfil)

// Cambio de contraseña
router.put('/admin/actualizarpassword', verificarAutenticacion, actualizarPassword)

// Recuperar contraseña
router.post('/recuperar-password',recuperarPassword)
router.get('/recuperar-password/:token',comprobarTokenPasword)
router.post('/nuevo-password/:token',nuevoPassword)




export default router