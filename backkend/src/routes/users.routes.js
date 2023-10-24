import {Router} from 'express';
import { UserManager } from '../dao/dbManagers/DBuserManager.js';

const userManager = new UserManager();
const router = Router();

router.get('/premium/:uid', async (req, res)=>{
    const {uid} = req.params;
    const user = await userManager.changeRol(uid)
    res.json({user: user})
})



export default router;