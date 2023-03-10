
const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    producto:[{
        producto: Schema.Types.ObjectId,
       
        cantidad: 0,

        total: 0
    }],

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    total: {
        type: Number,
        required: true
    },
});


module.exports = model('Factura', FacturaSchema);