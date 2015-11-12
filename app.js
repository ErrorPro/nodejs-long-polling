const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Messages = require('./message')
const EventEmitter = require('events').EventEmitter;
const bufferEmitter = new EventEmitter();
const app = express();

mongoose.connect('mongodb://localhost:27017/test')

bufferEmitter.setMaxListeners(100);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

app.get('/messages', (req, res) => {
  const clear = setTimeout(function () {
    bufferEmitter.emit('message', 'nothing');
  }, 10000);

  const addMessageListener = (res) => {
        bufferEmitter.once('message', (data) => {
            clearTimeout(clear);
            res.json(data);
        })
    }
  addMessageListener(res);
})

app.post('/messages', function(req, res){
  Messages.create({url: req.body.data})
    .then(
      () => (bufferEmitter.emit('message', req.body), res.status(200).end()),
      (err) => (bufferEmitter.emit('message', err.stack), res.status(500).end())
    )
})

const server = app.listen(3000, () => {
  console.log('Server started on ' + server.address().port);
});
