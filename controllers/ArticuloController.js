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
    queryCodigo: async (req,res,next)=>{
        try{

            const reg= await models.Articulo.findOne({codigo:req.query.codigo})
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
           console.log(req.query.valor)
           const reg=await models.Articulo.find({$or:[{'nombre': new RegExp(valor,'i')},{'description': new RegExp(valor,'i')}]},{createdAt:0})
           .populate('categoria',{nombre:1, description:1 }) //vamos a poblar desde nuestro modelo categoria para traernos el nombre
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