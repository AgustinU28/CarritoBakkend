import winston from 'winston';

// Define niveles de prioridad
const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

// Define colores para cada nivel de prioridad
const colors = {
  debug: 'blue',
  http: 'green',
  info: 'cyan',
  warning: 'yellow',
  error: 'red',
  fatal: 'magenta',
};

// Configuración base del logger
const logger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `${info.timestamp} [${info.level}]: ${info.message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

// Transporte de archivo para errores
logger.add(new winston.transports.File({ filename: 'errors.log', level: 'error' }));

export default logger;
