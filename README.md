# Project Express MEVN

## Pasos para iniciar nuestro proyecto de servicios.

Para inicializar un nuevo proyecto debemos colocar:

``` npm init --yes ```

Este nos crea el *package.json* 

Ahora, como trabajaremos con express verificamos en la página de Expressjs e iniciar con la instalación, en nuestro caso vamos a instalar express con las dependencias por lo que se coloca *--save*

```npm install express --save```

Se observa en nuestra repo que se agrega la carpeta *node_modules* y el archivo *package-lock.json* y se actualiza el *package.json* anterior.

Verificamos que se escucha en nuestro puerto, por lo que agregamos el archivo index.js que será nuestra interacción con el servidor:

```
const express = require('express');
const app=express();// instancia

app.listen(3000,()=>{
    console.log('server on port 3000')
})

```

Ejecutamos en la terminal node index.js y obtendremos

```
server on port 3000

```

En el archivo package.json colocamos en el scripts:

```
.
.
.
 "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
```
Ahora al colocar en la terminal npm start obtendremos el mismo resultado anterior

Instalaremos nodemon para actualizar cambios automaticos hechos en nuestra aplicación, con -D para instalar las dependencias como desarrollo:

```
npm install nodemon -D

```

Agregamos en package.json -> scripts:


```
.
.
.
 "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
```


Ahora en la terminal podemos colocar:

```
npm run dev

```

Se necesita colocar el puerto enviado por nuestro servidor, en ese caso cambiamos lo siguiente en el index.js

### index.js

```
app.set('port', process.env.PORT || 3000 );

app.listen( app.get('port'),()=>{
    console.log('server on port' + app.get('port'));
});

```
Agregamos morgan que son peticiones que vienen desde el navegador o peticiones clientes:

```
npm install morgan --save

```

Agregamos en el *index.js* morgan:

```
const morgan=require('morgan');

app.use(morgan('dev'));

```

### Agregar cors

Es un paquete middleware para express, permite realizar peticiones remotas desde otras pc o clientes.

```
npm install cors --save
```

en el index.js

```

const cors=require('cors');

app.use(cors());

```

Actualizando nuestro back para que pueda recibir peticiones json

```
app.use(express.json());
app.use(express.urlencoded({extended:true}));

```
#### Instalación de babel
Compatibilidad de EC6 a EC5

```
npm install --save babel-cli

npm install --save babel-preset-env babel-preset-stage-3


```

Y creamos el archivo .babelrc

```
{
    "presets":[
        "env" ,
        "stage-3"
    ]
}

```

modificamos el scripts del json:

```

 "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js --exec babel-node"
  },

```

Ahora podemos trabajar con EC6 y traducir al navegador en EC5

index.js

```
//const express = require('express');
//const morgan=require('morgan');
//const cors=require('cors');

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';


```

Se coloca la ruta que vamos a utilizar, ya que el index principal estará en la carpeta public:

index.js

```

import path from 'path';

app.use(express.static(path.join(__dirname,'public')))

```

index.js

 ```
import path from 'path';

 ```

### Instalar mongoose

 ```
npm install mongoose --save

 ```
index.js

 ```
import mongoose from 'mongoose'

//conexion a bd de MongoDB
mongoose.Promise=global.Promise;
const dbUrl= 'mongodb://localhost:27017/dbexpress';
mongoose.connect(dbUrl, {useCreateIndex:true, useNewUrlParser: true})
.then(mongoose => console.log('Conectando a la base de datos en el pueeto 27017'))
.catch(err => console.log(err))

 ```

 ### Creando modelos con moongose

 categoria.js

 ```
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


 ```

 index.js del modelo

 ```

 import Categoria from './categoria';

export default {
    Categoria
}


 ```
 ### Uso de Express para middlewares

 index.js principal agregamos:

 ```

app.get('/hola', function(req, res) {
    res.send('hello world');
  });

 ```
 Vamos a obtener un hello world cuando iniciemos con localhost:3000/hola

 ### Creando el controlador de la categoria

 *CategoriaController.js*

 ```

 import models from '../models';
import { Query } from 'mongoose';

export default {
    add: async (req,res,next)=>{

        try{
            const reg= await models.Categoria.create(req.body);
            res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },//agregar una categoria
    query: async (req,res,next)=>{
        try{

            const reg= await models.Categoria.findOne({_id:req.query._id});
            if(!reg){
                res.status(404).send({
                    message: 'El registro no existe'
                });                
            }else{
                res.status(200).json(reg);
            }            
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    }, //consultar categoria
    list:async (req,res,next)=>{
        try{
           const reg=await models.Categoria.find({});
           res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    update:async (req,res,next)=>{
        try{
           const reg= await models.Categoria.findByIdAndUpdate({_id:req.body._id},{nombre:req.body.nombre, description:req.body.description})
           res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    remove:async (req,res,next)=>{
        try{

            const reg= await models.Categoria.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    activate:async (req,res,next)=>{
        try{

            const reg= await models.Categoria.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(200);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    desactivate:async (req,res,next)=>{
        try{
            
            const reg= await models.Categoria.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(200);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
}

 ```

 ### Permitir que el middleware devuelva promesas

 ```
npm install express-promise-router --save

 ```
### Rutas necesarias para acceder a las funciones del controlador llamado categoriaController

Creamos el archivo *categorias.js* dentro de la carpeta *routes*

```
import routerx from 'express-promise-router';
import categoriaController from '../controllers/CategoriaController';

const router= routerx();

router.post('/add',categoriaController.add);
router.get('/query', categoriaController.query);
router.get('/list',categoriaController.list);
router.put('/update', categoriaController.update);
router.delete('/remove', categoriaController.remove);
router.put('/activate', categoriaController.activate);
router.put('/desactivate', categoriaController.desactivate);

export default router;

```

index.js

```
import routerx from 'express-promise-router';
import categoriaRouter from './categoria';

const router= routerx();

router.use('/categoria', categoriaRouter);
export default router;

```

Hasta ahora en el index.js principal llevamos

index.js

```
//const express = require('express');
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import router from './routes'; //nuevo

//const morgan=require('morgan');
//const cors=require('cors');
//conexion a bd de MongoDB
mongoose.Promise=global.Promise;
const dbUrl= 'mongodb://localhost:27017/dbexpress';
mongoose.connect(dbUrl, {useCreateIndex:true, useNewUrlParser: true})
.then(mongoose => console.log('Conectando a la base de datos en el pueeto 27017'))
.catch(err => console.log(err))

//************************************ */
const app=express();// instancia
app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')))

app.use('/api',router) // (nuevo) para que usa el router de la carpeta routes

app.set('port', process.env.PORT || 3000 );


app.get('/hola', function(req, res) {
    res.send('hello world');
  });

app.listen( app.get('port'),()=>{
    console.log('server on port' + app.get('port'));
    console.log(path.join(__dirname,'public')); // para consultar la ruta del archivo
});

```


### Personalizando nuestro Controller

Para que no se muestre cierta propiedad de esta categoria basta con colocar en nuestro componente list lo siguiente:

*categoriaController*

```
.
.
.
}, //consultar categoria
    list:async (req,res,next)=>{
        try{
           const reg=await models.Categoria.find({},{createdAt:0}) // se coloca acá lo que no queremos que se muestre, nombre: 1 (solo el nombre), etc
           
           res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
.
.
.

```

### Regex Filtro de ordenes y búsqueda

Proporciona capacidades de expresión regular para cadenas de coincidencia de patrones en las consultas.

"i" es para la coincidencia entre mayúsculas y minúsculas

Busqueda de contenido según la palabra de la propiedad, ejemplo:
valor= ambio donde la propiedad nombre= Cambio, de esa manera realiza la busqueda

Busqueda en la propiedad nombre ó en description
```
 }, //consultar categoria
    list:async (req,res,next)=>{
        try{
           let valor = req.query.valor;
           const reg=await models.Categoria.find({$or:[{'nombre': new RegExp(valor,'i')},{'description': new RegExp(valor,'i')}]},{createdAt:0})
           .sort({'createdAt':-1}); //ordenar de manera descendente

           res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
```

### Modelo artículo

Creamos el archivo articulos.js en nuestra carpeta modelos:

articulos.js

```
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

```

Agregamos lo creado en el index.js del modelo

index.js

```
import Categoria from './categoria';
import Articulo from './articulo';

export default {
    Categoria,
    Articulo
}

```

### Archivo Controller del Articulo

ArticuloController.js

```
import models from '../models';
import { Query } from 'mongoose';


export default {
    add: async (req,res,next)=>{

        try{
            const reg= await models.Articulo.create(req.body);
            res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    query: async (req,res,next)=>{
        try{

            const reg= await models.Articulo.findOne({_id:req.query._id})
            .populate('categoria',{nombre:1}); //vamos a poblar desde nuestro modelo categoria para traernos el nombre

            if(!reg){
                res.status(404).send({
                    message: 'El registro no existe'
                });                
            }else{
                res.status(200).json(reg);
            }            
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    list:async (req,res,next)=>{
        try{
           let valor = req.query.valor;
           const reg=await models.Articulo.find({$or:[{'nombre': new RegExp(valor,'i')},{'description': new RegExp(valor,'i')}]},{createdAt:0})
           .populate('categoria',{nombre:1}) //vamos a poblar desde nuestro modelo categoria para traernos el nombre
           .sort({'createdAt':-1}); //ordenar de manera descendente

           res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    update:async (req,res,next)=>{
        try{
           const reg= await models.Articulo.findByIdAndUpdate({_id:req.body._id},{categoria: req.body.categoria, codigo: req.body.codigo, nombre:req.body.nombre, description:req.body.description, precio_ventas:req.body.precio_ventas, stock: req.body.stock})
           
           res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    remove:async (req,res,next)=>{
        try{

            const reg= await models.Articulo.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    activate:async (req,res,next)=>{
        try{

            const reg= await models.Articulo.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(200);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    desactivate:async (req,res,next)=>{
        try{
            
            const reg= await models.Articulo.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(200);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
}

```

### Rutas para articulos

Creamos en la carpeta routes articulo.js

```
import routerx from 'express-promise-router';
import articuloController from '../controllers/ArticuloController';

const router= routerx();

router.post('/add',articuloController.add);
router.get('/query', articuloController.query);
router.get('/list',articuloController.list);
router.put('/update', articuloController.update);
router.delete('/remove', articuloController.remove);
router.put('/activate', articuloController.activate);
router.put('/desactivate', articuloController.desactivate);

export default router;

```

modificamos el index.js del routes

```
import routerx from 'express-promise-router';
import categoriaRouter from './categoria';
import articuloRouter from './articulos';

const router= routerx();

router.use('/categoria', categoriaRouter);
router.use('/articulo', articuloRouter);

export default router;

```

## Creando usuarios

### Modelo Usuario

usuario.js

```

// import mongoose.(Schema) from 'mongoose';
import mongoose from "mongoose";

// Save a reference to the Schema constructor `mongoose.model`
let Schema = mongoose.Schema;

const usuarioSchema= new Schema({
    rol:{type: String, maxlength: 30, required: true},
    nombre:{type: String, maxlength: 50, unique: true, required: true},
    tipo_documento:{type: String, maxlength: 20},
    num_documento:{type: String , maxlength: 20},
    direccion:{type: String, maxlength: 70},
    telefono:{type: String , maxlength: 20},
    email:{type: String, maxlength: 50, unique: true, required: true},
    password:{type: String , maxlength: 68,required: true},
    estado: {type: Number, default:1},
    createAt:{type:Date, default: Date.now}
});

const Usuario = mongoose.model('usuario', usuarioSchema);

export default Usuario;


```

index.js del modelo

```
import Categoria from './categoria';
import Articulo from './articulo';
import Usuario from './usuario'

export default {
    Categoria,
    Articulo,
    Usuario
}

```

### Controlador Usuario

Antes de realizar el controlador se debe instalar npm install bcryptjs --save para encriptar las contraseñas de nuestra entrada password del modelo

```
npm install bcryptjs --save

```
UsuarioControlerr.js

```
import models from '../models';
import bcrypt from 'bcryptjs';
import { Query } from 'mongoose';


export default {
    add: async (req,res,next)=>{

        try{
            req.body.password = await bcrypt.hash(req.body.password,10); // para encriptar la contraseña
            const reg= await models.Usuario.create(req.body);
            res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    query: async (req,res,next)=>{
        try{

            const reg= await models.Usuario.findOne({_id:req.query._id})
            .populate('categoria',{nombre:1}); //vamos a poblar desde nuestro modelo categoria para traernos el nombre

            if(!reg){
                res.status(404).send({
                    message: 'El registro no existe'
                });                
            }else{
                res.status(200).json(reg);
            }            
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    list:async (req,res,next)=>{
        try{
           let valor = req.query.valor;
           const reg=await models.Usuario.find({$or:[{'nombre': new RegExp(valor,'i')},{'email': new RegExp(valor,'i')}]},{createdAt:0})
           .sort({'createdAt':-1}); //ordenar de manera descendente

           res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    update:async (req,res,next)=>{
        console.log(req)
        try{
            let pass = req.body.password;
            const reg0= await models.Usuario.findOne({_id:req.body._id});
            if(pass != reg0.password){
                req.body.password = await bcrypt.hash(req.body.password,10);

            }

           const reg= await models.Usuario.findByIdAndUpdate({_id:req.body._id},{rol: req.body.rol, nombre: req.body.nombre, tipo_documento: req.body.tipo_documento, num_documento:req.body.num_documento, direccion:req.body.direccion, telefono:req.body.telefono, email: req.body.email, password: req.body.password})
           
           res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    remove:async (req,res,next)=>{
        try{

            const reg= await models.Usuario.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    activate:async (req,res,next)=>{
        try{

            const reg= await models.Usuario.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(200);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    desactivate:async (req,res,next)=>{
        try{
            
            const reg= await models.Usuario.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(200);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
}
```


### Rutas Usuarios

usuario.js de la carpeta routes

```
import routerx from 'express-promise-router';
import usuarioController from '../controllers/UsuarioController';

const router= routerx();

router.post('/add',usuarioController.add);
router.get('/query', usuarioController.query);
router.get('/list',usuarioController.list);
router.put('/update', usuarioController.update);
router.delete('/remove', usuarioController.remove);
router.put('/activate', usuarioController.activate);
router.put('/desactivate', usuarioController.desactivate);

export default router;
```

index.js de la carpeta routes

```

import routerx from 'express-promise-router';
import categoriaRouter from './categoria';
import articuloRouter from './articulos';
import usuarioRouter from './usuario';

const router= routerx();

router.use('/categoria', categoriaRouter);
router.use('/articulo', articuloRouter);
router.use('./usuario', usuarioRouter);

export default router;

```

### Generar el token con JSON Web Token

Sirve para enviar datos de inicio de sesión 

Para eso debemos instalar JsonWebToken

```
npm install jsonwebtoken --save

```

Desde la carpeta Services agregamos un archivo con el nombre token.js:

token.js
```
import jwt from 'jsonwebtoken';
import models from '../models';
 
// se crea una funcion aparte para configurar el tiempo del token o logeo
async function checkToken(token){
    let __id= null;

    try {
        const {_id}= await jwt.decode(token); // obtengo el id
        __id = _id;

    }catch(e){
        return false; // el token no es valido por lo que no expira
    }

    const user = await models.Usuario.findOne({_id:__id, estado: 1}); // ademas que el usuario siga con estado 1
    if(user){
        const token = jwt.sign({_id:__id}, 'claveSecretaParaGenerarElToken', {expiresIn: '1d'});
        return {token, rol:user.rol} // para definir a que tiene acceso
    }else{
        return false;
    }
    
}

export default {
    encode: async(_id)=>{ // generar el token con ese id ya autenticado
        //utilizamos el metodo sign de jwt y le agregamos tres parametros, el id que recibira, la clave para generar y el tiempo de expiración q en este caso sera de 1 dia
        const token = jwt.sign({_id:_id},'claveSecretaParaGenerarElToken',{expiresIn: '1d'});

        return token;
    },
    decode: async(token)=>{ // recibir el token y ver si el token es correcto
        try{
            const {_id} = await jwt.verify(token,'claveSecretaParaGenerarElToken');
            const user = await models.Usuario.findOne({_id,estado:1});
            if(user){
                return user;
            }else{
                return false;
            }
        }
        catch(e){
            const newToken = await checkToken(token);
            return newToken;
        }
    }
}

```

Quedando el UsuarioController.js

```
import models from '../models';
import bcrypt from 'bcryptjs';
import { Query } from 'mongoose';
import token from '../services/token'


export default {
    add: async (req,res,next)=>{

        try{
            req.body.password = await bcrypt.hash(req.body.password,10); // para encriptar la contraseña
            const reg= await models.Usuario.create(req.body);
            res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    query: async (req,res,next)=>{
        try{

            const reg= await models.Usuario.findOne({_id:req.query._id})
            .populate('categoria',{nombre:1}); //vamos a poblar desde nuestro modelo categoria para traernos el nombre

            if(!reg){
                res.status(404).send({
                    message: 'El registro no existe'
                });                
            }else{
                res.status(200).json(reg);
            }            
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    list:async (req,res,next)=>{
        try{
           let valor = req.query.valor;
           const reg=await models.Usuario.find({$or:[{'nombre': new RegExp(valor,'i')},{'email': new RegExp(valor,'i')}]},{createdAt:0})
           .sort({'createdAt':-1}); //ordenar de manera descendente

           res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    update:async (req,res,next)=>{
        console.log(req)
        try{
            let pass = req.body.password;
            const reg0= await models.Usuario.findOne({_id:req.body._id});
            if(pass != reg0.password){
                req.body.password = await bcrypt.hash(req.body.password,10);

            }

           const reg= await models.Usuario.findByIdAndUpdate({_id:req.body._id},{rol: req.body.rol, nombre: req.body.nombre, tipo_documento: req.body.tipo_documento, num_documento:req.body.num_documento, direccion:req.body.direccion, telefono:req.body.telefono, email: req.body.email, password: req.body.password})
           
           res.status(200).json(reg);
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    remove:async (req,res,next)=>{
        try{

            const reg= await models.Usuario.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    activate:async (req,res,next)=>{
        try{

            const reg= await models.Usuario.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(200);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    desactivate:async (req,res,next)=>{
        try{
            
            const reg= await models.Usuario.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(200);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },
    login: async(req,res,next)=>{
        try{
            let user= await models.Usuario.findOne({email: req.body.email, estado: 1});
            if(user){

                // existe un usuario con ese email

                let match= await bcrypt.compare(req.body.password, user.password);
                if(match){
                    //res.json('Password Correcto')
                    let tokenReturn  = await token.encode(user._id);
                    res.status(200).json({user,tokenReturn}); //enviar
                }else{
                    res.status(404).send({
                        message: 'Password incorrecto'
                    })
                }

            }else{
                res.status(404).send({
                    message: 'No existe el usuario'
                })
            }


        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    }
}

```

usuario.js del routes

```

import routerx from 'express-promise-router';
import usuarioController from '../controllers/UsuarioController';

const router= routerx();

router.post('/add',usuarioController.add);
router.get('/query', usuarioController.query);
router.get('/list',usuarioController.list);
router.put('/update', usuarioController.update);
router.delete('/remove', usuarioController.remove);
router.put('/activate', usuarioController.activate);
router.put('/desactivate', usuarioController.desactivate);

router.post('/login', usuarioController.login);

export default router;

```

### Autenticación auth

## Middlewares

En la carpeta *middlewares* se crea el archivo *auth.js*

auth.js

```

import tokenService from '../services/token';

export default {
    verifyUsuario: async(req,res,next)=>{

        if(!req.headers.token){// si no existe el token

            return res.status(404).send({
                message:'No token'
            });

        }
        const response = await tokenService.decode(req.headers.token);
        if(response.rol == 'Administrador' || response.rol == 'Vendedor' || response.rol == 'Almacenero'){
            next();
        }else{

            return res.status(403).send({
                message: 'No autorizado'
            })

        }

    },
    verifyAdministrador: async(req,res,next)=>{

        if(!req.headers.token){// si no existe el token

            return res.status(404).send({
                message:'No token'
            });

        }
        const response = await tokenService.decode(req.headers.token);
        if(response.rol == 'Administrador'){
            next();
        }else{

            return res.status(403).send({
                message: 'No autorizado'
            })

        }


    },
    verifyAlmacenero: async(req, res, next)=>{

        if(!req.headers.token){// si no existe el token

            return res.status(404).send({
                message:'No token'
            });

        }
        const response = await tokenService.decode(req.headers.token);
        if(response.rol == 'Administrador' || response.rol == 'Almacenero'){
            next();
        }else{

            return res.status(403).send({
                message: 'No autorizado'
            })

        }


    },
    verifyVendedor: async(req, res, next)=>{

        if(!req.headers.token){// si no existe el token

            return res.status(404).send({
                message:'No token'
            });

        }
        const response = await tokenService.decode(req.headers.token);
        if(response.rol == 'Administrador' || response.rol == 'Vendedor'){
            next();
        }else{

            return res.status(403).send({
                message: 'No autorizado'
            })

        }

        
    }
}

```

En la carpeta routes en el archivo usuario.js importamos auth y colocamos los permisos como verifyAdministrador

usuario.js

```
import routerx from 'express-promise-router';
import usuarioController from '../controllers/UsuarioController';
import auth from '../middlewares/auth'

const router= routerx();

router.post('/add',usuarioController.add); // solamente el administrador va apoder agregar nuevos usuarios
router.get('/query',auth.verifyAdministrador, usuarioController.query);
router.get('/list',auth.verifyAdministrador,usuarioController.list);
router.put('/update', auth.verifyAdministrador,usuarioController.update);
router.delete('/remove', auth.verifyAdministrador,usuarioController.remove);
router.put('/activate', auth.verifyAdministrador,usuarioController.activate);
router.put('/desactivate', auth.verifyAdministrador,usuarioController.desactivate);

router.post('/login', usuarioController.login);

export default router;

```













