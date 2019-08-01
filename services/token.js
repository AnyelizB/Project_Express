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
    encode: async(_id, rol, email)=>{ // generar el token con ese id ya autenticado
        //utilizamos el metodo sign de jwt y le agregamos tres parametros, el id que recibira, la clave para generar y el tiempo de expiración q en este caso sera de 1 dia
        const token = jwt.sign({_id:_id, rol:rol, email:email},'claveSecretaParaGenerarElToken',{expiresIn: '1d'});

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