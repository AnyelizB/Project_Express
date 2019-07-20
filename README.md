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
router.put('desactivate', categoriaController.desactivate);

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




