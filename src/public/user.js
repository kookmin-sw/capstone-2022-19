
const socket = io();


let iceServers = {
    iceServers: [
        { urls: "stun:stun.services.mozilla.com" },
        { urls: "stun:stun.l.google.com:19302" },
    ],
};

const localvideo = document.getElementById("localvideo");
const screenSharevideo = document.getElementById("screen-share");
const streams = document.getElementById("streams");
const btnStudent = document.getElementById("student");
const roomNumber = document.getElementById("room-number");
const msgInput = document.getElementById("chat_message");

const ejsName = document.getElementById("ejs-name");
const ejsType = document.getElementById("ejs-type");

const userName = ejsName.innerText;
const type = ejsType.innerText;

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");

let sendPC;
let myStream;
let screenShare;
let index;
let rId;

btnStudent.addEventListener("click", handleStudentBtn);

function visible(){
  page1.style.display = "none";
  page2.style.display = "block";
}

function handleStudentBtn(event) {
    console.log(`${type} ${userName} click`);
    roomId = roomNumber.value;
    let data = { roomId: roomId, userId: socket.id, userName: userName, type: type };
    socket.emit("studentJoin", data);
}


function exitRoom(){
    location.href = "/exit";
}

function send_chat(){
    const msg = msgInput.value;
    msgInput.value = "";
    socket.emit("send_msg",msg);
}


//student
socket.on("joinRoom", async (data) => {
    visible();
    console.log("Join : " + data.userId + " RoomID : " + data.roomId);
    index = data.index;
    rId = data.roomId;
    await navigator.mediaDevices
        .getUserMedia({
            audio: true,
            video: true,
        }).then(function (stream) {
            myStream = stream;
            localvideo.srcObject = stream;

            sendPC = new RTCPeerConnection(iceServers);
            sendPC.onicecandidate = event => {
                if (event.candidate) {
                    console.log("Student send Candidate");
                    socket.emit("studentSendIce", event.candidate, data);
                }
            };
            sendPC.addTrack(myStream.getTracks()[0], myStream);
            sendPC.addTrack(myStream.getTracks()[1], myStream);

            
        })
    await navigator.mediaDevices
        .getDisplayMedia().then(function(stream) {
            screenShare = stream;
            screenSharevideo.srcObject = stream;
            sendPC.addTrack(screenShare.getTracks()[0], screenShare);

            sendPC.
                createOffer()
                .then((offer) => {
                    sendPC.setLocalDescription(new RTCSessionDescription(offer));
                    socket.emit("reqAnswer", offer, data);
                })
        })


})


socket.on("answerArrived", async (answer, data) => {
    console.log("professor cadidate arrived");
    await sendPC.setRemoteDescription(answer);
})

socket.on("proIceArrived", (candidate, data) => {
    console.log(`professor's ICE arrived`);
    let icecandidate = new RTCIceCandidate(candidate);
    sendPC.addIceCandidate(icecandidate);
})


//교수님 입장 x
socket.on("noRoom", () => {
    console.log("his room doesn't exist");
    alert("아직 방이 만들어지지 않았습니다.");
})


socket.on("professorLeft", ()=>{
    console.log("professor has left");
    alert("시험이 종료되었습니다");
    exitRoom();
})
<<<<<<< HEAD


socket.on("receive_msg", (obj) => {
    console.log("메세지 받았따");
    console.log(obj);

    obj = JSON.parse(obj);

    const message = obj.message;
    const time = obj.time;
    const userName = obj.name;

    var msg_container = "<div class=msg_container style='text-align : right'></div>";
    $(".massage_area").append(msg_container);
    var msg_time = "<div id=msg_time>" + time + "</div>";
    var msg_window = "<div id=sand_msg>" + userName + " : " + message + "</div>";
    $(".msg_container:last").append(msg_time);
    $(".msg_container:last").append(msg_window);
})


socket.on("notice", (obj) =>{
    obj = JSON.parse(obj);

    const message = obj.message;
    const time = obj.time;
    const userName = obj.name;

    const alert_area = document.getElementById("ale_area");


    const div = document.createElement("div");
    div.className = "alert";
    div.innerText = `[공지] ${message}`;
    alert_area.append(div);

    const div3 = document.createElement("div");
    div3.className = "alert"
    div3.innerText = `${time}`;
    div3.style.textAlign = "right";
    div.append(div3);

    const div2 = document.createElement("div");
    div2.className = "line";
    div3.append(div2);
})
=======
>>>>>>> bdeee8fe3ef3538f68fadefe29ff0351e0a8bd12
