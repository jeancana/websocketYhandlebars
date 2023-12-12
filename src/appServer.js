// 1. MODULOS DE TERCEROS
import express from 'express' //importando la libreria express
import handlebars from 'express-handlebars' // le importo por defecto y me lo traigo todo el MODULO 
import { Server } from 'socket.io' // Importando el SERVIDOR de WEBSOCKET que viene dentro de la biblioteca de socket.io


// 2. MODULOS PROPIOS  
//2.1  Importando Rutas Dinamicas
import cartsRouter from './routers/carts.routers.js'
import productsRouter from './routers/products.routers.js'
import viewsRouter from './routers/views.routers.js' //Importando Rutas Manejo MOTOR d Plantillas HANDLEBARS
//2.2 Importando Constantes Absolutas 
import { __dirname } from './utils.js'

// 3. Configuracion de los Servicios de la App
const PORT = 8080

const appServer = express()
// httpServer es ahora el servidor de Express
const httpServer = appServer.listen(PORT, () => console.log(`Server Up on PORT: ${PORT}`))

// Servidor de Socket.io (websocket) Activo dentro de nuestro Servidor
const socketServer = new Server(httpServer) 

socketServer.on('connection', socket => {

    // Aca estoy mostrando el ID del Socket del cliente conectado  
    console.log(`SocketClient Conectado // ID: ${socket.id} `)


    socket.on('message', data => {
        
        // Paso 1: Aca mostramos la Data que recibimos del socketClient
        console.log(data)
 
        //Paso 2: Enviamos repuesta de confirmacion a TODOS LOS CLIENTES INCLUYENDO el que envió el mensaje message
        socketServer.emit('message', 'Conection OK: confirmación para TODOS LOS clientes')

    })


})

appServer.use(express.json())
appServer.use(express.urlencoded({ extended: true }))

// 3.1 Habilitando/Inicializando el modulo HANDLEBARS
appServer.engine('handlebars', handlebars.engine())
appServer.set('views', `${__dirname}/views`)
appServer.set('view engine', 'handlebars')


// 4. Asignacion de Rutas y Servicios

// 4.1 - Asignacion de Rutas DINAMICAS, manejo de contenidos dinamicos (transporte de paquetes json)

appServer.use('/', viewsRouter) // Servicio Nro 1
// la dejamos directamente en la ruta RAIZ "/" : http://localhost:8080/

appServer.use('/api/carts', cartsRouter) // Servicio Nro 2
// Para probar que los Servicios (paquete de endpoints) de CARTS esta funcionando: http://localhost:8080/api/carts/1

appServer.use('/api/products', productsRouter) // Servicio Nro 3
// Para probar que los Servicios (paquete de endpoints) de PRODUCTS esta funcionando: http://localhost:8080/api/products

// 4.2 - Asignacion de Rutas RUTAS ESTATICAS O Servicios de contenidos estaticos
appServer.use('/static', express.static(`${__dirname}/public`))
// Para probar que el Servicio Estatico esta funcionando: http://localhost:8080/static/index.html 

// Poniendo a Escuchar el Servidor 
//appServer.listen(PORT, () => console.log(`Server Up on PORT: ${PORT}`))

