const { request, response } = require('express');
const Producto = require('../models/producto');
const validarEstado = async (req = request, res = response, next) => {
 
    const { producto } = req.body;
    
    for (let x = 0; x < producto.length; x++) {
        if (x % 2 == 0) {
            const productos = producto[x];
            const prouductoCarrito = await Producto.findById(productos);
            if (prouductoCarrito) {
                if (prouductoCarrito.disponible === false) {  
                    console.log(prouductoById)
                    return res.status(400).json({
                        msg: `Producto en estado false`
                    })


                }
                let cantidad = producto[x+1]
                if (cantidad > prouductoCarrito.cantidad) {
                    return res.status(405).json({
                        msg: `El producto: ${prouductoCarrito.nombre} no tiene esa cantidad`
                    })


                }
                
            }else{
                throw new Error(`El id: ${ elemento } no está registrado en la DB`);
            }


        }

    }



    
    next()
}

const existeProducto = async (req = request, res= response, next) => {

    const { producto } = req.body;
    
    for (let x = 0; x < producto.length; x++) {
        if (x % 2 == 0) {
            const productos = producto[x];
            const prouductoCarrito = await Producto.findById(productos);
             if(!prouductoCarrito){
                return res.status(401).json({
                    msg: `El  id: ${productos} no esta requistrado en la base de datos`
                })
                
            }

           
            
        }
    
    }

    next();

    

}



module.exports = {
    validarEstado,
    existeProducto,
}