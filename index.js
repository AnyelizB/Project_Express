//const express = require('express');
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import router from './routes';

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

app.use('/api',router) // para que usa el router de la carpeta routes

app.set('port', process.env.PORT || 3000 );


app.get('/hola', function(req, res) {
    res.send('hello world');
  });

app.listen( app.get('port'),()=>{
    console.log('server on port' + app.get('port'));
    console.log(path.join(__dirname,'public')); // para consultar la ruta del archivo
});