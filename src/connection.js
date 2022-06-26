const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

const db = mongoose.connection
export {
  db
}