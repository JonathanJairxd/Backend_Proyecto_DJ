// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';

// Se importan las rutas del administrador
import routerAdministrador from './routers/administrador_routes.js';

import routerClientes from './routers/cliente_routes.js';

import routerProducto from './routers/producto_routes.js';
import routerVenta from './routers/venta_routes.js';


// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())


// Variables globales


// Rutas 
app.get('/',(req,res)=>{
    res.send("Server on")
})

// Ruta del administrador
app.use('/api',routerAdministrador)

// Ruta del cliente
app.use('/api',routerClientes)

// Ruta del producto
app.use('/api',routerProducto)

// Ruta de la venta
app.use('/api',routerVenta)


// Rutas no encontradas
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))


// Exportar la instancia de express por medio de app
export default  app