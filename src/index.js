const express = require('express');
const bodyParser = require('body-parser');
const {Server} = require('socket.io');
const {createServer} = require('http');
const cors = require('cors');
const v1 = require('./routes/v1');
const morgan = require('morgan');
const pe = require('parse-error');
const {CONFIG} = require('./config');
const {logger} = require('./config/winston');
const {db} = require('./connection');
const {handleError} = require('./services/utils.service');
const swaggerUi = require('swagger-ui-express');
const callHandler = require('./wsHandler/callHandler');
const chatHandler = require('./wsHandler/chatHandler');
const connectHandler = require('./wsHandler/connectHandler');
// const swagger = require('./swagger')
const {validateWSConnection, saveSocketSession} = require('./middlewares/ws');

const swaggerDocument = require('../swagger.json');

const app = express();
const PORT = CONFIG.PORT;


app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(morgan('dev', {
  'skip': function (req, res) {
    return res.statusCode < 400
  },
  'stream': process.stderr,
}))

app.use(morgan('dev', {
  'skip': function (req, res) {
    return res.statusCode >= 400
  },
  'stream': process.stdout,
}))


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));


app.use('/api/v1', v1);
app.use('/', (req, res) => {
  res.status(404).json({
    'status': 'error',
    'msg': 'Not found'
  })
})

app.use((err, req, res, next) => {
  return handleError(res, err)
})
const httpServer = createServer(app);


function initSocket(server) {
  return new Server(server, {
    cors: {
      origin: '*'
    }
  });
}

const io = initSocket(httpServer);
io.use(validateWSConnection);
io.use(saveSocketSession)
const onConnection = (socket) => {
  connectHandler(io, socket);
  callHandler(io, socket);
  chatHandler(io, socket);

}

io.on("connection", onConnection);


httpServer.listen(PORT, () => {
  logger.info(`PORT ${PORT}`);
  logger.info(`App is running on PORT ${PORT}`);
});


db.once("open", function () {
  logger.info("Connected to mongodb")
  db.collection("sockets").drop(function(err, delOk) { 
    if (delOk) logger.info("Collection deleted");
  });
})

process.on('unhandledRejection', (error) => {
  logger.error('Unknown Error', pe(error));
})

