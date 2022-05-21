const http = require("http");
const socket = require("socket.io");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");


const app = express();
const httpServer = http.createServer(app);
const io = socket(httpServer);
const PORT = process.env.PORT || 3000;

let iceServers = {
    iceServers: [
        { urls: "stun:stun.services.mozilla.com" },
        { urls: "stun:stun.l.google.com:19302" },
        {urls: 'turn:3.38.181.169:3478?transport=tcp', 
        username: 'reverse2', 
        credential: '277400'},
    ],
};


//routing
const routing = require("./routes/router");
const { collection } = require("firebase/firestore");



//setting
app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized : true
}))

app.use("/", routing);


let room_chk = {};
let room_manager = {};
let userData = {};


//socket code
io.on("connection", (socket) => {
    console.log(`${socket.id} Connected`);

    socket.on("totalScore" ,(data)=> {
        console.log(data);
    })

    //교수 입장
    socket.on("professorJoin", (data) => {
        let roomId = data.roomId;
        let userId = data.userId;
        console.log(`professor : ${data.userName}(${userId}) joined ${roomId} `);

        if (room_chk[roomId] === true) {
            console.log(`${data.userName}${data.type} failed to make room(${roomId})`);
            socket.emit("alreadyExist");
        } else{
            userData[userId] = {
                userName: data.name,
                roomId : data.roomId,
                type: data.type
            }
            room_chk[roomId] = true;
            room_manager[roomId] = socket.id;
            socket.join(roomId);
            socket.emit('createRoom', data);
        }
        console.log(userData[socket.id]);
    });



    //학생 입장
    socket.on("studentJoin", (data) => {
        let roomId = data.roomId;
        let userId = data.userId;
        let userName = data.userName;

        console.log(`Student : ${userName} (${userId}) joined `);

        if (room_chk[roomId] === true) {
            userData[userId] = {
                userName: data.userName,
                roomId: data.roomId,
                type: data.type
            }
            socket.join(roomId);
            socket.emit('joinRoom', data);

        } else{
            console.log(`${data.userName}${data.type} failed to enter room(${roomId})`);
            socket.emit("noRoom");
        }

        console.log(userData[socket.id]);
    })

    //학생 >> 교수
    socket.on("studentSendIce", (candidate, data) => {
        socket.to(room_manager[data.roomId]).emit("stuIceArrived", candidate, data);
    })

    socket.on("reqAnswer", (offer, data) => {
        socket.to(room_manager[data.roomId]).emit("reqAnswer", offer, data);
    })
    
    // 교수 >> 학생
    socket.on("professorSendIce", (candidate, data) => {
        socket.to(data.userId).emit("proIceArrived", candidate, data);
    })

    socket.on("sendAnswer", (answer, data) => {
        socket.to(data.userId).emit("answerArrived", answer, data);
    })

    socket.on("disconnect", ()=>{
        console.log("SOCKETIO disconnect EVENT: ", socket.id, " client disconnect");

        if(userData[socket.id] === undefined){
            return;
        }
        const roomId = userData[socket.id].roomId;
        const userName = userData[socket.id].userName;
        const type = userData[socket.id].type;
        const userId = socket.id;

        room_chk[roomId] = false;
        room_manager[roomId] = null;

        if(type === "student"){
            userData[userId] = null;
            socket.to(room_manager[roomId]).emit("studentLeft", userId);
        }else{
            socket.broadcast.to(roomId).emit("professorLeft");
        }
    })

    socket.on("send_msg", (msg) =>{
        console.log(msg);
        console.log(socket.id);
    })

})



const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(PORT, handleListen);