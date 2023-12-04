import {Router} from 'express';
import { UserManager } from '../dao/dbManagers/DBuserManager.js';
import { uploaderDocuments } from '../utils.js';

const userManager = new UserManager();
const router = Router();


router.get('/premium/:uid', async (req, res)=>{
    const {uid} = req.params;
    const user = await userManager.getUserById(uid);
    let fileIdentificacion = "";
    let fileDomicilio = "";
    let fileEstadoCuenta = "";
    user.documents.forEach(document => {
    switch (document.category) {
        case "identificacion":
            fileIdentificacion = document.name
            break;
        case "domicilio":
            fileDomicilio = document.name
        break;
        case "estadocuenta":
            fileEstadoCuenta = document.name
        break;
    }   
    })
    console.log({fileIdentificacion})
    console.log({fileDomicilio})
    console.log({fileEstadoCuenta})
    if(!fileIdentificacion || !fileDomicilio || !fileEstadoCuenta){
        return res.status(400).json({message: "falta cargar documentos"})
    }
    const response = await userManager.changeRol(uid)
    return res.status(200).json({payload: response})


})

router.post('/:uid/documents', uploaderDocuments.single('file'), async(req,res)=>{
    const {uid} = req.params;
    if (!req.file) {
        return res.status(400).json({status:'error', error: "No se pudo cargar el archivo"});    
    }
    await userManager.uploadDocumentUser(uid, req.file.originalname, req.body.category, req.file.path);
    return res.status(200).json({status: 'success', message: "El archivo se ha cargado exitosamente"})
})

export default router;