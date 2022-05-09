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
const btnProfessor = document.getElementById("professor");
const btnStudent = document.getElementById("student");


let sendPC;
let myStream;
let screenShare;
let index;
let tmp;

btnStudent.addEventListener("click", handleStudentBtn);

function handleStudentBtn(event) {
    console.log("StudentBtn click");
    roomId = '1';
    let data = { roomId: roomId, userId: socket.id };
    socket.emit("studentJoin", data);
}




//student
socket.on("joinRoom", async (data) => {
    console.log("Join : " + data.userId + " RoomID : " + data.roomId);
    index = data.index;
    tmp = data.roomId;
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
    let icecandidate = new RTCIceCandidate(candidate);
    sendPC.addIceCandidate(icecandidate);
})


//교수님 입장 x
socket.on("noRoom", () => {
    console.log("his room doesn't exist");
    alert("아직 방이 만들어지지 않았습니다.");
})

