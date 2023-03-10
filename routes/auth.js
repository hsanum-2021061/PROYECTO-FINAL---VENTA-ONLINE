const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { login } = require('../controllers/auth');
const { getFacturaById } = require('../controllers/factura');
// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

//Manejo de rutas
router.post('/login', [
    
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    validarCampos,
] ,login);


module.exports = router;