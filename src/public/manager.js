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
const roomNumber = document.getElementById("room-number");
const welcome = document.getElementById("welcome");

const ejsName = document.getElementById("ejs-name");
const ejsType = document.getElementById("ejs-type");

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");

const name = ejsName.innerText;
const type = ejsType.innerText;


let receivePC;
<<<<<<< HEAD
let myStream;

=======
>>>>>>> 81c6338eeda6d3d7d2be2047e28303bafc138d91
let cntStudent = 0;
let studentData = {};

btnProfessor.addEventListener("click", handleProfessorBtn);

function visible() {
    page1.style.display = "none";
    page2.style.display = "block";
}


function handleProfessorBtn(event) {
    console.log("ProfessorBtn click");
    if(roomNumber.value === ""){
        alert("방 번호를 입력해주세요");
        return ;
    }
    roomId = roomNumber.value;
    let data = { roomId: roomId, userId: socket.id, type: type, name: name };
    socket.emit("professorJoin", data);
}

function exitRoom() {
    location.href = "/exit";
}


//professor
socket.on("createRoom", async (data) => {
    visible();
    console.log("Create : " + data.userId + " RoomID : " + data.roomId);
})


//이미 방을 사용중
socket.on("alreadyExist", () => {
    console.log("already exist");
    alert("이미 방이 사용중입니다.");
});


socket.on("reqAnswer", async (offer, data) => {
    cntStudent = cntStudent + 1;

    studentData[data.userId] = {
        userId: data.userId,
        username: data.username,
        userIndex: cntStudent,
        streamIndex: cntStudent
    };

    makeForm(cntStudent, data.userName);

    receivePC = new RTCPeerConnection(iceServers);
    receivePC.onicecandidate = event => {
        if (event.candidate) {
            console.log("professor sned ICE");
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
    console.log("student's ICE Arrived");
    let icecandidate = new RTCIceCandidate(candidate);
    receivePC.addIceCandidate(icecandidate);
})

socket.on("studentLeft", (userId) => {
    const info = studentData[userId];
    console.log(info);

    const streams = document.getElementById("streams");
    const userStream = document.getElementById(info.userIndex);

    streams.removeChild(userStream);
})


function makeForm(idx, userName) {
    const streams = document.getElementById("streams");
    const peerDiv = document.createElement("div");
    peerDiv.id = idx;
    streams.appendChild(peerDiv);
    const nameTag = document.createElement("p");
    nameTag.innerText = userName;
    peerDiv.appendChild(nameTag);

}

function handleAddStream(data) {
    console.log(data);
    const streams = document.getElementById(cntStudent);
    const peerStream = document.createElement("video");
    peerStream.width = "200";
    peerStream.height = "200";
    peerStream.autoplay = true;
    peerStream.playsinline = true;
    peerStream.srcObject = data.stream;
    streams.appendChild(peerStream);
}



