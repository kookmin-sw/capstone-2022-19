const socket = io();

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

let receivePC;
let myStream;

  
btnProfessor.addEventListener("click", handleProfessorBtn);


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


socket.on("reqAnswer", async (offer, data) => {
    receivePC = new RTCPeerConnection(iceServers);
    receivePC.onicecandidate = event => {
        if (event.candidate) {
            socket.emit("professorSendIce", event.candidate, data);
        }
    };

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


socket.on("stuIceArrived", (candidate, data) => {
    let icecandidate = new RTCIceCandidate(candidate);
    receivePC.addIceCandidate(icecandidate);
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



