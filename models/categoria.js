// import mongoose.(Schema) from 'mongoose';
import mongoose from "mongoose";

// Save a reference to the Schema constructor `mongoose.model`
let Schema = mongoose.Schema;

const categoriaSchema=new Schema({
    nombre:{type:String, maxlength:50,unique:true,required:true},
    description:{type:String, maxlength:255},
    estado:{type: Number, default: 1},
    createAt:{type:Date, default:Date.now}

});

const Categoria = mongoose.model('categoria', categoriaSchema);

export default Categoria;

