const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

//Este archivo maneja validaciones personalizadas

const esRoleValido = async( rol = '' ) => {

    const existeRol = await Role.findOne( { rol } );

    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la DB`);
    }

}


const emailExiste = async( correo = '' ) => {

    //Verificamos si el correo ya existe en la DB
    const existeEmail = await Usuario.findOne( { correo } );

    //Si existe (es true) lanzamos excepción
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo } ya existe y esta registrado en la DB`);
    }

}


const existeUsuarioPorId = async(id) => {

    //Verificar si el ID existe
    const existeUser = await Usuario.findById(id);

    if ( !existeUser ) {
        throw new Error(`El id ${ id } no existe en la DB`);
    }

}


const existeCategoriaPorId = async(id) => {

    //Verificar si el ID existe
    const existeCategoria = await Categoria.findById(id);

    if ( !existeCategoria ) {
        throw new Error(`El id ${ id } no existe en la DB`);
    }

}


const existeProductoPorId = async(id) => {

    //Verificar si el ID existe
    const existeProducto = await Producto.findById(id);

    if ( !existeProducto ) {
        throw new Error(`El id ${ id } no existe en la DB`);
    }

}
const defecto = async(req = request, res = response, next) =>{
    const { id } = req.params;

    const query = {categoria:id} 

    const productos = await Producto.find(query);

    const productIds =  productos.map((product) => product._id);

    const _idAdmin = req.usuario.id;

    const colleccion = 'Respaldo'
    const categoriaDB = await Categoria.findOne({ nombre:colleccion });

    if (!categoriaDB) {
        const deleteCategoria = new Categoria({
            nombre: "Respaldo",
            usuario: _idAdmin
        });
        
        await deleteCategoria.save();
    }

    const query1 = { nombre:'Respaldo' }
    const {_id} = await Categoria.findOne(query1);

    const editado = await  Producto.updateMany({categoria:id},{categoria:_id});

    next()
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    defecto

}