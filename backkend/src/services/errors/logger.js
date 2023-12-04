import winston from 'winston';
import dotenv from 'dotenv'

dotenv.config();

const customLevelOption = {
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5,
    }
}
const loggerDev = winston.createLogger({
    levels:customLevelOption.levels,
    transports:[
        new winston.transports.Console({level:'debug'}),
    ]
})

const loggerProd = winston.createLogger({
    levels:customLevelOption.levels,
    transports:[
        new winston.transports.File({filename:'./errors.log', level:'info'}),
    ]
})

export const addLogger=(req,res,next)=>{
    req.logger = process.env.ENVIRONMENT === 'development' ? loggerDev : loggerProd;
    req.logger.http(`${req.method} en ${req.url} - ${new Date()}`);
    next();
}
