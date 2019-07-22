// import mongoose.(Schema) from 'mongoose';
import mongoose from "mongoose";

// Save a reference to the Schema constructor `mongoose.model`
let Schema = mongoose.Schema;

const personaSchema= new Schema({

    tipo_persona:{type: String, maxlength: 20, required: true}, //cliente o proveedor
    nombre:{type: String, maxlength: 50, unique: true, required: true},
    tipo_documento:{type: String, maxlength: 20},
    num_documento:{type: String , maxlength: 20},
    direccion:{type: String, maxlength: 70},
    telefono:{type: String , maxlength: 20},
    email:{type: String, maxlength: 50, unique: true},
    estado:{type: Number, default:1},
    createAt:{type: Date, default: Date.now}

});

const Persona = mongoose.model('persona', personaSchema);

export default Persona;