import { Router } from "express";

// ***** IMPORTANDO la piezas de codigo hechas previamente en el Directorio /managers para reutilizarlas  
import ProductsManager from '../managers/productManager.js' 

// Uso de MIDDLEWARE
// Uso los 2 ../ puntos para Salir de la carpeta "/routers" e ir a importar el uploader que esta en la carpeta "/src"
import { uploader } from "../uploader.js";

//Activando el Modulo Router
const router = Router();

// ******* PERSISTENCIA EN ARCHIVOS **************
const productManager = new ProductsManager()

// <<<<<<<<< HACIENDO C.R.U.D >>>>>>>>>>>>>>

// 1) Metodo POST = CREATE en la ruta RAIZ para:
// 1.1) agregar UN PRODUCTO NUEVO en products.json 
// 1.2) Se le inyecto un Middleware en el Endpoint para poder recibir archivos 
router.post('/', uploader.single('thumbnail'),async (req, res) => {

    //console.log(req.body) 
    const req2 = (req.body)

    try {
        res.status(200).send(productManager.addProducts(req2.title, req2.description, req2.code, req2.status, req2.stock, req2.category, req2.thumbnail))
        
    } catch (err) {
        res.status(500).send({ err: err.message })
    }

    //----- Rutas para USAR del Lado del cliente ----------

    // Opcion 1: Para Usar el index.html y Cargar los datos desde la carpeta Public----------------
    // http://localhost:8080/static/index.html
    // Desde aca se pueden subir Imagenes 

    //Opcion 2: Usar Postman----------------
    // Para Agregar una Producto la raiz: http://localhost:8080/api/products
    // NOTA IMPORTANTE: A partir de la linea de comando 206 esta el listado de productos a agregar con POSTMAN
    
})


// 2) Metodo GET = READ en la ruta RAIZ para: 
// 2.1) Leer todo los PRODUCTOS guardados en products.json
// 2.2) Leer los PRDUCTOS guardados en producst.json hasta donde indique ?limit = n
router.get('/', async (req, res) => {

    try {

        const limit = parseInt(req.query.limit)
        //console.log(limit)
        const readProducts = await productManager.getProducts()
        //console.log(readProducts)
        const productLimit = readProducts.slice(0, limit)
        //console.log(productLimit)

        if (!limit) {   
            res.status(200).send(await productManager.getProducts())
        } else {
            res.status(200).send(await productLimit)
        }

    } catch (err) {
        res.status(500).send({ err: err.message })
    }   

    //Ruta NRO 1: LEYENDO TODOS LOS PRODUCTOS  -----------------------------------  http://localhost:8080/api/products
    //Ruta NRO 2: LEYENDO SOLO LOS PRODUCTOS DE LA POSICIONES 0 al 3 DEL ARRAY ---  http://localhost:8080/api/products?limit=3  

})


// 3) Metodo GET = READ en la ruta /:id para: 
// 3.1) Leer UN SOLO PRODUCTO POR SU ID guardado en products.json 
router.get('/:id', async (req, res) => {

    try {

        const id = parseInt(req.params.id)
        //console.log(id)
        const product = await productManager.getProductsById(id)
        
        // Enviando las repuesta requeridas en el ejercicio 
        if (!product) {
            return res.status(404).send({ error: 'Product Not Found' })
        } else {
            res.status(200).send(await product)
        }

    } catch (err) {
        res.status(500).send({ err: err.message })
    }

    //--------   Ruta NRO 1: LEYENDO UN SOLO PRODUCTO  -------------------  http://localhost:8080/api/products/2  

})


// 4) Metodo PUT = UPDATE en la ruta /:id para: 
// 4.1) ACTUALIZAR UN PRODUCTO POR SU ID guardado en el Array del Objetos del archivo products.json 
router.put('/:id', async (req, res) => {
    
    try {
        // Tomando el Id que por req.params  - con este ID identifico el Elemento quiero actualizar del Array
        const id = parseInt(req.params.id)

        // Tomando los datos (Objeto a modificar) que viene por Query Params del lado del cliente 
        const newData = req.body

        // Llamando al archivo products.json (en el estan Pesistidos el Array de Objetos a Modificar)
        const readProducts = await productManager.getProducts()

        // Con esta constante Ubico el posicion del Elmento del Array de Objetos que deseo Modificar Medieante la HOF .findIndex
        const productIndex = readProducts.findIndex(item => item.id === id)
        //console.log(userIndex)

        // Con esta constante Ubico el Elmento del Array de Objetos que deseo Modificar Medieante la HOF .findIndex
        const product = readProducts.find(item => item.id == id)
        //console.log(user)

        // *** Actualizando el Objeto Seleccionado del Array del Objetos del archivo producst.json

        // Logica Operando:  
        // 1) Ubicando elemento del Array de Objeto a Modificar por su Indice
        readProducts[productIndex] = {
        
            // 2) Ubicando al Objeto/Elemento Viejo a modificar
            ...product,
            // 3) Pisando el Objeto/Elemento Viejo por el Nuevo Actualiza
            ...newData //spread operator
        }

        //console.log(readProducts)
    
        // Pisando el file products.json
        productManager.upDateProducts(readProducts)
    
        // Reportando que el usuario elegido fue Actualizado dentro del Array de Objetos products.json
        res.status(200).send({ message: 'Product upDate!' })

    } catch (err) {
        
        res.status(500).send({ err: err.message })

    }

//----- Rutas para USAR del Lado del cliente ----------
  /*
  .- Para Actualizar UN Producto ruta: http://localhost:8080/api/products/3
    
    .- Producto con id: 3 se va a Actuali con el Metodo PUT = upDate

        {
            "id": 3,
            "title": "Item Dado de baja v3",
            "description": "-------",
            "code": 0,
            "status": false,
            "stock": "0",
            "category": "Alta Media",
            "thumbnail": "url - imagen"
        }
         
    */

})


// 5) Metodo DELETE en la ruta /:id para: 
// 5.1) ELIMINAR UN PRODUCTO POR SU ID guardado en el Array del Objetos del archivo products.json 
router.delete('/:id', async (req, res) => {

    try {
        
        const id = parseInt(req.params.id)
        const readProducts = await productManager.getProducts()
        const productIndex = readProducts.findIndex(item => item.id === id)
        
        // Para que borre el ID correcto solicitado
        const correctID= productIndex+1

        // Borrando el producto en el archivo products.json
        productManager.deleteProductsById(correctID)

        // Reportando que el usuario elegido fue Actualizado dentro del Array de Objetos products.json
        res.status(200).send({ message: 'Product Delete!' })

    } catch (err) {

        res.status(500).send({ err: err.message })

    }

    //----- Rutas para USAR del Lado del cliente ----------
    
    //Para BORRAR UN Producto ruta: http://localhost:8080/api/products/5 
 

})



// "export default" SOLO PUEDE HABER UNO por Archivo/Modulo
// SOLO SE PUEDE exportar por defecto una sola Cosa ----> aca exportamos la const router
export default router;





/* 

    <<<<<<<<<< Productos INICIALES Enviados via POST (req.body)al products.json >>>>>>>>>    

    .- Producto 1 
        {
            "title": "Violin Electrico ", 
            "description": "Instrumeto Moderno", 
            "code": 1, "price": 1000, 
            "status": true,
            "stock": "11", 
            "category": "Alta Gama",
            "thumbnail": "url - imagen"
         }

    .- Producto 2     
         {
            "title": "Teclado Casio ",
            "description": "Instrumeto Eletrico", 
            "code": 3, 
            "price": 3000, 
            "status": true,
            "stock": "13", 
            "category": "Alta Media",
            "thumbnail": "url - imagen"
         }

    .- Producto 3         
         {
            "title": "Guitarra Fender", 
            "description": "Instrumetos Electrico", 
            "code": 4, "price": 4000, "status": true,
            "stock": "14", 
            "category": "Alta Gama",
            "thumbnail": "url - imagen"
         }

    .- Producto 4        
         {
            "title": "Bajo Square ", 
            "description": "Instrumetos Electrico", 
            "code": 5, "price": 100000, 
            "status": true,
            "stock": "12", 
            "category": "Alta Media",
            "thumbnail": "url - imagen"
         }
    
*/

