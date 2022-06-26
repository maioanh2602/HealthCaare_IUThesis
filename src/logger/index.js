// // NOTE: this adds a filename and line number to winston's output
// // Example output: 'info (routes/index.js:34) GET 200 /index'
//
// let winston = require('winston')
// let path = require('path')
// let PROJECT_ROOT = path.join(__dirname, '..')
//
// let logger = winston.createLogger({
//     'level': 'debug',
//     'format': winston.format.combine(
//         winston.format.colorize(),
//         winston.format.timestamp({
//             'format': 'YYYY-MM-DD HH:mm:ss',
//         }),
//         winston.format.printf((info) => {
//             // console.log('info:', info)
//             if (info.stack) {
//                 return `${info.timestamp} ${info.level}: ${info.message} \r\n Call stack: ${info.stack}`
//             }
//             return `${info.timestamp} ${info.level}: ${info.message}`
//         })
//     ),
//     'transports': [
//         new winston.transports.File({ filename: 'all-logs.log' }),
//     ],
// })
//
// logger.exceptions.handle(new winston.transports.File({ filename: 'exceptions.log' }))
//
// if (process.env.APP !== 'production') {
//     logger.add(new winston.transports.Console())
// }
//
// // this allows winston to handle output from express' morgan middleware
// logger.stream = {
//     'write': function(message) {
//         logger.info(message)
//     },
// }
//
// // A custom logger interface that wraps winston, making it easy to instrument
// // code and still possible to replace winston in the future.
//
// module.exports.debug = module.exports.log = function() {
//     logger.debug(...formatLogArguments(arguments))
// }
//
// module.exports.info = function() {
//     logger.info(...formatLogArguments(arguments))
// }
//
// module.exports.warn = function() {
//     logger.warn(...formatLogArguments(arguments))
// }
//
// module.exports.error = function() {
//     logger.error(...formatLogArguments(arguments))
// }
//
// module.exports.stream = logger.stream
//
// /**
//  * Attempts to add file and line number info to the given log arguments.
//  */
// const formatLogArguments = (args) => {
//     args = Array.prototype.slice.call(args)
//
//     let stackInfo = getStackInfo(1)
//
//     if (stackInfo) {
//         // get file path relative to project root
//         let calleeStr = `(${stackInfo.relativePath}:${stackInfo.line})`
//
//         if (typeof (args[0]) === 'string') {
//             args[0] = `${calleeStr} ${args[0]}`
//         } else {
//             args.unshift(calleeStr)
//         }
//     }
//
//     return args
// }
//
// /**
//  * Parses and returns info about the call stack at the given index.
//  */
// const getStackInfo = (stackIndex) => {
//     // get call stack, and analyze it
//     // get all file, method, and line numbers
//     let stacklist = (new Error()).stack.split('\n').slice(3)
//
//     // stack trace format:
//     // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
//     let stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
//     let stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi
//
//     let s = stacklist[stackIndex] || stacklist[0]
//     let sp = stackReg.exec(s) || stackReg2.exec(s)
//
//     if (sp && sp.length === 5) {
//         return {
//             'method': sp[1],
//             'relativePath': path.relative(PROJECT_ROOT, sp[2]),
//             // 'line': sp[3],a
//             'pos': sp[4],
//             'file': path.basename(sp[2]),
//             'stack': stacklist.join('\n'),
//         }
//     }
// }
import appRoot from 'app-root-path';

const winston = require('winston');

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/src/logs/all-log.log`,
    handleExceptions: true,
    colorize: true,
    json: true,
    maxSize: 5242880
  },
  errorFile: {
    level: 'error',
    filename: `${appRoot}/src/logs/error-log.log`,
    handleExceptions: true,
    colorize: true,
    json: true,
    maxSize: 5242880
  },
  console: {
    level: 'debug',
    colorize: true,
    handleExceptions: true,
    json: false,
  }
};

const logger = new winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.prettyPrint(),
    winston.format.printf((info) => {
      return `${info.level}  ${info.timestamp}  ${info.message} `;
    }),
  ),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.File(options.errorFile),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
});

logger.stream = {
  write: function (message, encoding) {
    if (message instanceof Error) {
      logger.error(message);
    }

    logger.info(message);
  }
};

// const formatLogArguments = (args) => {
//   args = Array.prototype.slice.call(args)
//
//   let stackInfo = getStackInfo(1)
//
//   if (stackInfo) {
//     // get file path relative to project root
//     let calleeStr = `(${stackInfo.relativePath}:${stackInfo.line})`
//
//     if (typeof (args[0]) === 'string') {
//       args[0] = `${calleeStr} ${args[0]}`
//     } else {
//       args.unshift(calleeStr)
//     }
//   }
//
//   return args
// };


export default logger;

