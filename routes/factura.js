const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { getFacturaById,carrito } = require('../controllers/factura');
// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarEstado } = require('../middlewares/validar-stock');


const router = Router();

//Manejo de rutas
router.post('/carrito', [
    validarJWT,
    validarEstado,
    validarCampos,
] ,carrito);
router.get('/', [
    validarJWT,
    validarCampos
], getFacturaById );

module.exports = router;