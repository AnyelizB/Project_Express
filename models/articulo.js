// import mongoose.(Schema) from 'mongoose';
import mongoose from "mongoose";

// Save a reference to the Schema constructor `mongoose.model`
let Schema = mongoose.Schema;

const articuloSchema= new Schema({
    categoria:{type: Schema.ObjectId, ref:'categoria'}, // se le hace referencia a nuestro modelo categoria ya que debemos traernos contenido de esa tabla
    codigo:{type: String, maxlength: 64},
    nombre:{type: String, maxlength: 50, unique: true, required: true},
    description:{type: String, maxlength: 255},
    precio_ventas:{type:Number, required: true},
    stock:{type: Number, required: true},
    estado:{type: Number, default: 1},
    createdAt:{type:Date, default: Date.now}
});

const Articulo = mongoose.model('articulo', articuloSchema);

export default Articulo;