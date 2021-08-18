const express = require("express");
const cors = require('cors');
const uuid = require('uuid').v4;
const mongoose = require('mongoose');

const config = require('./config/config.json');

const Room = require('./models/peer');

const app = express();
const server = require('http').createServer(app);
const io = require('./socket').initIO(server);

app.use(cors());
app.use(express.json());

app.get('/join', (req, res) => {
    console.log('hallow')
    const id = uuid();    
    res.json({ id: id });
});

io.on('connection', socket => {
    console.log("user connected!!");

    socket.on('join', ({id, peerid, name}) => {
        Room.find({ peerid: id})
            .then(room => {
                if(!room){
                    const newRoom = new Room({ peerid: id , });
                    newRoom.save();
                    socket.to(id).emit("user-connected", {name: name, peerid: id});
                    return socket.join(id);
                }
                socket.join(id);
                socket.to(id).emit('user-connected', {name: name, peerid: peerid});
                console.log(peerid);
            })
            .catch(err => {
                throw err;
            })
    });

    socket.on('disconnected', id => {
        socket.to(id).emit('disconnected');
    })

    socket.on('message', ({msg, id, name}) => {
        socket.to(id).emit('message-received', {name: name, msg: msg});
    })

});

mongoose.connect(`mongodb+srv://zutrix:${config.mongoPassword}@erfancluster.r5bzv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => {
        server.listen(8000, () => {
            console.log('Server up and running!');
        });
    }).catch(err => {
        throw err;
    })