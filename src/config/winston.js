const {format, createLogger, transports} = require('winston');
const {combine, printf, timestamp, label} = format;

const customizeFormat = printf(({level, message, label, timestamp}) => {
  return `${timestamp} ${level}: ${message}`
})

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.colorize({all: true}),
    format.errors({stack: true}),
    // format.json()
    customizeFormat
  ),
  transports: [
    new transports.Console()
  ]
})

export {logger};
