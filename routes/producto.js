const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole, esAdminRole } = require('../middlewares/validar-roles');
const { esAdmin } = require('../middlewares/validar-usuario');

//Controllers
const { postProducto, putProducto, deleteProducto, getProductos, getProductoPorId,getMayorVenta,getAgotados } = require('../controllers/producto');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

//Manejo de rutas

//Obtener todas las productos - publico
router.get('/', getProductos );

//Obtener un producto por id - publico
router.get('/buscar/:id', [
    validarJWT,
    esAdmin,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],  getProductoPorId);

//ver los productos agotados - privado
router.get('/agotado', [
    validarJWT, 
    validarCampos
],  getAgotados);
//ver los producros mas vendidos -publico
router.get('/mayor', [
    validarJWT, 
    validarCampos
],  getMayorVenta);
// Crear producto - privada - cualquier persona con un token válido
router.post('/agregar', [
    validarJWT,
    check('categoria').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postProducto);
 
// Actuaizar producto - privada - cualquier persona con un token válido
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], putProducto);

//Borrar un producto - privado - Solo el admin puede eliminar una categoria (estado: false)
router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE', 'SUPER_ROLE'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], deleteProducto);



module.exports = router;