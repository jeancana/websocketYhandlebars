import { Router } from "express";

// ***** IMPORTANDO la piezas de codigo hechas previamente en el Directorio /managers para reutilizarlas  
import CartsManager from '../managers/cartManager.js'

const router = Router();

// ******* PERSISTENCIA EN ARCHIVOS **************
// Instanciando un Objeto de la clase ProducManager para poder trabajarlo

const cartManager = new CartsManager()


// 1) Metodo POST = CREATE en la ruta RAIZ para:
// 1.1) crear un NUEVO carrito en carts.json  
router.post('/', async (req, res) => {

    //console.log(req.body) 
    const newCart = (req.body)

    try {
        res.status(200).send(cartManager.addProducts(newCart.products))

    } catch (err) {
        res.status(500).send({ err: err.message })
    }

    //----- Rutas para USAR del Lado del cliente ----------
    /*
    .- Creando un Carrito Vacio en la ruta raiz: http://localhost:8080/api/carts
    
    <<<<< Carrtido creado via POST (req.body) en carts.json >>>>>

    .- Producto 1 Agregado 
        {
            "products": []  
         }
    
    */

})


// 2) Metodo GET = READ en la ruta /:id para: 
// 2.1) Leer los productos dentro del CARRITO identificando el carrito POR SU ID guardado en carts.json 
router.get('/:cid', async (req, res) => {

    try {

        const id = parseInt(req.params.cid)
        //console.log(`aca ${id}`)
       
        const cartProductById = await cartManager.getCarstById(id)
        //console.log(product)
       
        // Enviando las repuesta requeridas en el ejercicio
        if (!cartProductById) {
            return res.status(404).send({ error: 'Product Not Found' })
        } else {
            res.status(200).send(await cartProductById)
        }

    } catch (err) {
        res.status(500).send({ err: err.message })
    }

    //--------   Ruta NRO 1: LEYENDO UN PRODUCTOs dentro del CARRTo  -------------------  http://localhost:8080/api/carts/1 

})


// 3) Metodo POST = CREATE en la ruta RAIZ para:
// 3.1) crear un NUEVO carrito en carts.json  
router.post('/:cid/product/:pid', async (req, res) => {

    
    const id = parseInt(req.params.cid)
    console.log(`aca ${id}`)
    
    const productInsertOnCart = (req.body)
    //console.log(req.body)
    let ingreso = 1
    
    const newObject = {
        'Id.Product': productInsertOnCart.id,
        'Quantity': ingreso
    }

    
    try {
        res.status(200).send(cartManager.addProducts(newObject))

    } catch (err) {
        res.status(500).send({ err: err.message })
    }

    //----- Rutas para USAR del Lado del cliente ----------
    /*
    .- Creando un Carrito Vacio en la ruta raiz: http://localhost:8080/api/carts/1/product
    
    <<<<< Carrtido creado via POST (req.body) en carts.json >>>>>

    .- Producto 1 Agregado 
        {
		"id": 2,
		"title": "Violin Acustico ",
		"description": "InstrumetoClasico",
		"code": 2,
		"status": true,
		"stock": "12",
		"category": "Alta Gama",
		"thumbnail": "url - imagen"
	}
    
    */

})


// "export default" SOLO PUEDE HABER UNO por Archivo/Modulo
// SOLO SE PUEDE exportar por defecto una sola Cosa ----> aca exportamos la const router
export default router;

