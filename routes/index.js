import routerx from 'express-promise-router';
import categoriaRouter from './categoria';
import articuloRouter from './articulos';
import usuarioRouter from './usuario';

const router= routerx();

router.use('/categoria', categoriaRouter);
router.use('/articulo', articuloRouter);
router.use('/usuario', usuarioRouter);

export default router;