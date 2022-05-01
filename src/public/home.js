const socket = io();

const pc_config = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
            urls: ["turn:13.250.13.83:3478?transport=udp"],
            username: "YzYNCouZM1mhqhmseWk6",
            credential: "YzYNCouZM1mhqhmseWk6"
        },
    ],
};

let iceServers = {
    iceServers: [
        { urls: "stun:stun.services.mozilla.com" },
        { urls: "stun:stun.l.google.com:19302" },
    ],
};

const localvideo = document.getElementById("localvideo");
const streams = document.getElementById("streams");
const btnProfessor = document.getElementById("professor");
const btnStudent = document.getElementById("student");

let sendPC;
let receivePC;
let receivePCs = {};
let myStream;
let index;
let tmp ;
btnProfessor.addEventListener("click", handleProfessorBtn);
btnStudent.addEventListener("click", handleStudentBtn);

function handleStudentBtn(event) {
    console.log("StudentBtn click");
    roomId = '1';
    let data = { roomId: roomId, userId: socket.id };
    socket.emit("studentJoin", data);
}

function handleProfessorBtn(event) {
    console.log("ProfessorBtn click");
    roomId = '1';
    let data = { roomId: roomId, userId: socket.id };
    socket.emit("professorJoin", data);
}


//professor
socket.on("createRoom", async (data) => {
    console.log("Create : " + data.userId + " RoomID : " + data.roomId);

})


//이미 방을 사용중
socket.on("alreadyExist", () => {
    console.log("already exist");
    alert("이미 방이 사용중입니다.");
});


//student
socket.on("joinRoom", async (data) => {
    console.log("Join : " + data.userId + " RoomID : " + data.roomId);
    index = data.index;
    tmp =  data.roomId;
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

            sendPC.
                createOffer()
                .then((offer) => {
                    sendPC.setLocalDescription(new RTCSessionDescription(offer));
                    socket.emit("reqAnswer", offer, data);
                })
        })

})

socket.on("reqAnswer", async (offer, data) => {
    receivePC = new RTCPeerConnection(iceServers);
    receivePC.onicecandidate = event => {
        if (event.candidate) {
            socket.emit("professorSendIce", event.candidate, data);
        }
    };
    // receivePCs[data.index] = receivePC;
    receivePC.addEventListener("addstream", handleAddStream);

    await receivePC.setRemoteDescription(offer);
    receivePC
        .createAnswer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
        })
        .then((answer) => {
            console.log("[professor]sender Answer");
            receivePC.setLocalDescription(new RTCSessionDescription(answer));
            socket.emit("sendAnswer", answer, data);
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

socket.on("stuIceArrived", (candidate, data) => {
    let icecandidate = new RTCIceCandidate(candidate);
    console.log(data.index);
    console.log(receivePCs);
    receivePC.addIceCandidate(icecandidate);
})

//교수님 입장 x
socket.on("noRoom", () => {
    console.log("his room doesn't exist");
    alert("아직 방이 만들어지지 않았습니다.");
})


function handleAddStream(data) {
    console.log("동영상 띄운다!");
    const streams = document.getElementById("streams");
    const peerStream = document.createElement("video");
    peerStream.width = "400";
    peerStream.height = "400";
    peerStream.autoplay = true;
    peerStream.playsinline = true;
    peerStream.srcObject = data.stream;
    streams.appendChild(peerStream);
}
