import routerx from 'express-promise-router';
import articuloController from '../controllers/ArticuloController';
import auth from '../middlewares/auth';

const router= routerx();

router.post('/add',auth.verifyAlmacenero,articuloController.add);
router.get('/query', auth.verifyAlmacenero,articuloController.query);
router.get('/queryCodigo', auth.verifyUsuario,articuloController.queryCodigo);
router.get('/list',auth.verifyAlmacenero,articuloController.list);
router.put('/update', auth.verifyAlmacenero,articuloController.update);
router.delete('/remove', auth.verifyAlmacenero,articuloController.remove);
router.put('/activate', auth.verifyAlmacenero,articuloController.activate);
router.put('/desactivate', auth.verifyAlmacenero,articuloController.desactivate);

export default router;