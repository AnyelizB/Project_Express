import models from '../models';

async function aumentarStock(idArticulo, cantidad){

    let {stock} = await models.Articulo.findOne({_id:idArticulo});
    let nStock=parseInt(stock)+parseInt(cantidad);
    const reg= await models.Articulo.findByIdAndUpdate({_id:idArticulo},{stock:nStock});

}
//actualizar el stock
//Disminuir stock
async function disminuirStock(idArticulo, cantidad){

    let {stock} = await models.Articulo.findOne({_id:idArticulo});
    let nStock=parseInt(stock)-parseInt(cantidad);
    const reg= await models.Articulo.findByIdAndUpdate({_id:idArticulo},{stock:nStock});

}


import { Query } from 'mongoose';

export default {
    add: async (req,res,next)=>{

        try{
            const reg= await models.Venta.create(req.body);
            // Actualizar stock osea llamar la función
            let detalles = req.body.detalles;
            detalles.map(function(x){
                disminuirStock(x._id,x.cantidad);
            });
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

            const reg= await models.Venta.findOne({_id:req.query._id})
            .populate('usuario', {nombre:1})
            .populate('persona', {nombre:1});
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
           const reg=await models.Venta.find({$or:[{'num_comprobante': new RegExp(valor,'i')},{'serie_comprobante': new RegExp(valor,'i')}]})
           .populate('usuario', {nombre:1})
           .populate('persona', {nombre:1, direccion:1,num_documento:1,telefono:1,email:1})
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
   /* update:async (req,res,next)=>{
        try{
           const reg= await models.Ingreso.findByIdAndUpdate({_id:req.body._id},{nombre:req.body.nombre, description:req.body.description})
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

    },*/
    activate:async (req,res,next)=>{
        try{

            const reg= await models.Venta.findByIdAndUpdate({_id:req.body._id},{estado:1});
             // Actualizar stock osea llamar la función
             let detalles = reg.detalles;
             detalles.map(function(x){
                disminuirStock(x._id,x.cantidad);
             });
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
            
            const reg= await models.Venta.findByIdAndUpdate({_id:req.body._id},{estado:0});
             // Actualizar stock osea llamar la función
             let detalles = reg.detalles;
             detalles.map(function(x){
                aumentarStock(x._id,x.cantidad);
             });
            
            res.status(200).json(200);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }

    },

    grafico12Meses:async(req,res,next)=>{
        console.log('hola')
        try{
           
            const reg= await models.Venta.aggregate(
                [
                    {
                        // agrupar por propiedades de mongoose

                        $group:{
                            _id:{
                                mes:{$month:"$createAt"}, // lo que traemos del modelo
                                year:{$year:"$createAt"} // lo que traemos del modelo
                            },
                            total:{$sum:"$total"}, // lo que traemos del modelo
                            numero:{$sum:1} // es un contador
                        }
                    },
                    {
                        //ordenar por propiedades de mongoose
                        $sort:{

                            "_id.year": -1, "_id_mes":-1 //lo ordeno de manera descendente el id en año y mes del grupo creado 

                        }
                    }
                ]
            ).limit(12);//solo se necesita las dos ultimas estadisticas
           
            res.status(200).json(reg);
           
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    consultaFechas:async (req,res,next)=>{
        try{
           let start = req.body.start;
           let end = req.body.end;

           const reg=await models.Venta.find({"$createAt": {"$gte":start, "$lt":end}})
           .populate('usuario', {nombre:1})
           .populate('persona', {nombre:1})
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
}