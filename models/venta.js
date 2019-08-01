// import mongoose.(Schema) from 'mongoose';
import mongoose from "mongoose";

// Save a reference to the Schema constructor `mongoose.model`
let Schema = mongoose.Schema;

const ventaSchema= new Schema({

    usuario:{type: Schema.ObjectId, ref:'usuario', required: true}, 
    persona:{type: Schema.ObjectId, ref:'persona', required: true}, 
    tipo_comprobante:{type: String, maxlength: 20, required: true}, 
    serie_comprobante:{type: String, maxlength: 7}, 
    num_comprobante:{type: String, maxlength: 20, required: true}, 
    impuesto:{type: Number, required:true},
    total:{type: Number, required:true},
    detalles:[{
        _id:{
            type:String,
            required:true
        },
        articulo: {
            type:String,
            required: true
        },
        cantidad:{
            type:Number,
            required: true
        },
        precio:{
            type:Number,
            required:true
        },
        descuento:{
            type:Number,
            required:true
        }
    }],
    estado:{type: Number, default:1},
    createAt:{type: Date, default: Date.now}

});

const Venta = mongoose.model('venta', ventaSchema);

export default Venta;