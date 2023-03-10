const { request, response, json } = require('express');
const Producto = require('../models/producto');
const { ObjectId } = require('mongoose').Types;


const coleccionesPermitidas = [
    'productos',

];

const buscarP = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );  //TRUE

    if ( esMongoID ) {
        const producto = await Producto.findById(termino);
        return res.json({
            //results: [ usuario ]
            results: ( producto ) ? [ producto ] : [] 
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    } 

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');
    
    const productos = await Producto.find({
        $or: [ { nombre: regex }]
    });
    
    res.json({
        results: productos
    })

}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `La colección: ${coleccion} no existe en la DB
                  Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }


    switch (coleccion) {

        case 'productos':
            buscarP(termino, res);

           
        break;
        default:
            res.status(500).json({
                msg: 'Ups, se me olviod hacer esta busqueda...'
            });
        break;
    }

}

const getAgotados = async (req = request, res = response)=>{
    const query = { cantidadStock: 0 };
    const listaAgotados = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
    ]);
    
    res.json({
        msg: 'Lista de productos agotados',
        listaAgotados
    });
}
const getMayorVenta = async (req = request, res = response)=>{

    const query = { vendido:{$gt:50} };
    const listadoMayorV = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
    ])

    res.json({
        msg: 'Lista de productos mas vendidos',
        listadoMayorV
    });
}
const getProductos = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaProductos = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            //.populate('usuario', 'nombre')
            .populate('usuario', 'correo')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        msg: 'Lista de productos activos',
        listaProductos
    });

}


const getProductoPorId = async (req = request, res = response) => {

    const { id } = req.params;
    const prouductoById = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.status(201).json(prouductoById);

}


const postProducto = async (req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    //validacion si el producto ya existe
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe en la DB`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = await Producto(data);

    //Guardar en DB
    await producto.save();

    res.status(201).json(producto);

}


const putProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...restoData } = req.body;

    if (restoData.nombre) {
        restoData.nombre = restoData.nombre.toUpperCase();
        restoData.usuario = req.usuario._id;
    }

    const productoActualizado = await Producto.findByIdAndUpdate(id, restoData, { new: true });

    res.status(201).json({
        msg: 'Put Controller Producto',
        productoActualizado
    })

}

const deleteProducto = async (req = request, res = response) => {

    const { id } = req.params;
    //Eliminar fisicamente de la DB
    //const productoEliminado = await Producto.findByIdAndDelete( id );

    //Eliminar por el estado:false
    const productoEliminado_ = await Producto.findByIdAndUpdate(id, { disponible: false }, { new: true });


    res.json({
        msg: 'DELETE',
        //productoEliminado,
        productoEliminado_
    })

}


module.exports = {
    postProducto,
    putProducto,
    deleteProducto,
    getProductos,
    getProductoPorId,
    getMayorVenta,
    getAgotados
}
