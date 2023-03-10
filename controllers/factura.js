const { request, response } = require('express');

const Factura = require('../models/facturas');

const Producto = require('../models/producto');


const getFactura = async (req = request, res = response) => {

    const listaFactura = await Promise.all([
        Factura.countDocuments(),
        Factura.find().populate('producto', 'total')
    ]);

    res.json({
        msg: 'get Api - Controlador Factura',
        listaFactura
    });

}

const getFacturaById = async (req = request, res = response) => {
    const _idUsuario = req.usuario.id

    const carritoById = await Factura.find({ usuario: _idUsuario });

    res.status(201).json(carritoById);

}

const carrito = async (req = request, res = response) => {
    const _usuario = req.usuario.id;
    const { producto } = req.body;

    postFactura(producto, _usuario, res);
}
const postFactura = async (producto, _usuario, res = response) => {


    let totals = 0;
    let totalCompra = 0;
    const productosCompra = [];

    for (let x = 0; x < producto.length; x++) {

        if (x % 2 == 0) {
            const productos = producto[x];
            const prouductoCarrito = await Producto.findById(productos);

            console.log(prouductoCarrito)
            let precio = prouductoCarrito.precio;
            let cantidad = parseInt(producto[x + 1]),


            totals = precio * cantidad;

            console.log(totals);
            productosCompra.push({ producto: producto[x], cantidad: producto[x + 1], total: totals });
            totalCompra = totals + totalCompra;

            let cantidadVendida = parseInt(prouductoCarrito.vendido);
            let cantidadStock = parseInt(prouductoCarrito.cantidadStock);

            const { ...restoData } = "";
            if (cantidadStock === 0) {
                restoData.disponible = false;
            }

            let cantidadEditada = parseInt(cantidadStock - cantidad);
            let totalCantidad = parseInt(cantidadVendida + cantidad);
            if (cantidadStock >= cantidad) {
                restoData.cantidadStock = cantidadEditada;
                restoData.vendido = totalCantidad;
            }
            await Producto.findByIdAndUpdate(productos, restoData, { new: true });

        }

    }

    const data = {
        producto: productosCompra,
        usuario: _usuario,
        total: totalCompra,
    }

    const facturaGuardada = new Factura(data);

    await facturaGuardada.save();

    res.json({
        msg: facturaGuardada
    })
}


module.exports = {
    getFactura,
    getFacturaById,
    carrito
}