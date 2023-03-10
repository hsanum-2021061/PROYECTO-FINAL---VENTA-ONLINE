const { request, response } = require('express');

const esAdmin = ( req = request, res = response, next ) => {
    const rol = req.usuario.rol;
        if ( rol!=="Admin" ) {
            throw new Error(`El rol ${ rol } no tiene los permiso`);
        }
    
    next();
    
}








module.exports = {
    esAdmin
}