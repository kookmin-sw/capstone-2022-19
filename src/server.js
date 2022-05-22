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
        {
            urls: 'turn:3.38.181.169:3478?transport=tcp',
            username: 'reverse2',
            credential: '277400'
        },
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
    saveUninitialized: true
}))

app.use("/", routing);


let room_chk = {};
let room_manager = {};
let userData = {};


//socket code
io.on("connection", (socket) => {
    console.log(`${socket.id} Connected`);


    //교수 입장
    socket.on("professorJoin", (data) => {
        let roomId = data.roomId;
        let userId = data.userId;
        console.log(`professor : ${data.userName}(${userId}) joined ${roomId} `);

        let clientIp = socket.request.connection.remoteAddress;
        console.log(clientIp);


        if (room_chk[roomId] === true) {
            console.log(`${data.userName}${data.type} failed to make room(${roomId})`);
            socket.emit("alreadyExist");
        } else {
            userData[userId] = {
                userName: data.name,
                roomId: data.roomId,
                type: data.type,
                ip: clientIp
            }
            room_chk[roomId] = true;
            room_manager[roomId] = socket.id;
            socket.join(roomId);
            console.log(room_chk);
            socket.emit('createRoom', data);
        }
        console.log(userData[socket.id]);
    });



    //학생 입장
    socket.on("studentJoin", (data) => {
        let roomId = data.roomId;
        let userId = data.userId;
        let userName = data.userName;
        let clientIp = socket.request.connection.remoteAddress;
        console.log(clientIp);

        console.log(`Student : ${userName} (${userId}) joined `);

        

        if (room_chk[roomId] === true) {
            userData[userId] = {
                userName: data.userName,
                roomId: data.roomId,
                type: data.type,
                ip: clientIp
            }
            socket.join(roomId);
            socket.emit('joinRoom', data);

        } else {
            console.log(`${data.userName}${data.type} failed to enter room(${roomId})`);
            socket.emit("noRoom");
        }
    })

    //학생 >> 교수
    socket.on("studentSendIce", (candidate, data) => {
        socket.to(room_manager[data.roomId]).emit("stuIceArrived", candidate, data);
    })

    socket.on("reqAnswer", (offer, data) => {
        var clientIp = socket.request.connection.remoteAddress;
        socket.to(room_manager[data.roomId]).emit("reqAnswer", offer, data, clientIp);
    })

    // 교수 >> 학생
    socket.on("professorSendIce", (candidate, data) => {
        socket.to(data.userId).emit("proIceArrived", candidate, data);
    })

    socket.on("sendAnswer", (answer, data) => {
        socket.to(data.userId).emit("answerArrived", answer, data);
    })

    socket.on("disconnect", () => {
        console.log("SOCKETIO disconnect EVENT: ", socket.id, " client disconnect");

        if (userData[socket.id] === undefined) {
            return;
        }
        const roomId = userData[socket.id].roomId;
        const userName = userData[socket.id].userName;
        const type = userData[socket.id].type;
        const userId = socket.id;



        if (type === "student") {
            userData[userId] = null;
            socket.to(room_manager[roomId]).emit("studentLeft", userId);
        } else {
            room_chk[roomId] = false;
            room_manager[roomId] = null;
            socket.broadcast.to(roomId).emit("professorLeft");
        }
    })

    socket.on("send_msg", (obj) => {
        const room_Id = userData[socket.id].roomId;
        socket.to(room_manager[room_Id]).emit("receive_msg",obj);
    })

    socket.on("professor_send_msg", (obj, recipient)=>{
        if(recipient === "all"){
            const roomId = userData[socket.id].roomId;
            socket.broadcast.to(roomId).emit("receive_msg", obj);
        }else if(recipient === "notice"){
            const roomId = userData[socket.id].roomId;
            socket.broadcast.to(roomId).emit("notice", obj);
        }else {
            socket.to(recipient).emit("receive_msg", obj);
        }
    })

    socket.on("detected", (status)=>{
        console.log("감지됨");
        const roomId = userData[socket.id].roomId;
        socket.to(room_manager[roomId]).emit("cheating_detected", socket.id, status);
    })

    socket.on("two_face", () => {
        const roomId = userData[socket.id].roomId;
        socket.to(room_manager[roomId]).emit("two_face", socket.id);
    })

    socket.on("face_missing", () => {
        const roomId = userData[socket.id].roomId;
        socket.to(room_manager[roomId]).emit("face_missing", socket.id);
    })


})



const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(PORT, '0.0.0.0', handleListen);