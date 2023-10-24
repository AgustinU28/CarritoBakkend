import {Router} from 'express';

const router = Router();

router.get('/', (req, res)=>{
    req.logger.warning('Warning');
    req.logger.error('Error');
    req.logger.info('Info');
    req.logger.fatal('Fatal');
    res.json({message: 'prueba de logger'})
})



export default router;