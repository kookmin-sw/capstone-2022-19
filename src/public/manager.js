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
const subject = document.getElementById("subject");
const welcome = document.getElementById("welcome");
const msgInput = document.getElementById("chat_message");
const selectbox = document.getElementById("message_to");
const participants = document.getElementById("participants");
const alert_area = document.getElementById("alert_area");

const ejsName = document.getElementById("ejs-name");
const ejsType = document.getElementById("ejs-type");

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");

const name = ejsName.innerText;
const type = ejsType.innerText;


let receivePC;
let myStream;

let cntStudent = 0;
let studentData = {};

btnProfessor.addEventListener("click", handleProfessorBtn);

function visible() {
    page1.style.display = "none";
    page2.style.display = "block";
}

function get_timestamp() {
    var today = new Date();
    var hour = today.getHours();
    var min = today.getMinutes();

    if (min < 10 && min >= 0) { var time = hour + ":0" + min; }
    else { var time = hour + ":" + min; }

    return time;
}

function send_chat() {
    const recipient = $('#message_to option:selected').val();
    const msg = msgInput.value;
    var time = get_timestamp();
    const userName = name;

    

    if(msg){
        obj = {
            "message": msg,
            "time": time,
            "name": userName
        }
        obj = JSON.stringify(obj)

        if (recipient != "notice") {
            var msg_container = "<div class=msg_container style='text-align : left'></div>";
            $(".massage_area").append(msg_container);
            var msg_time = "<div id=msg_time>" + time + "</div>";
            var msg_window = "<div id=sand_msg>" + userName + " : " + msg + "</div>";
            $(".msg_container:last").append(msg_window);
            $(".msg_container:last").append(msg_time);
        }
    
        
        msgInput.value = "";
    
        socket.emit("professor_send_msg", obj, recipient);
    }

}



function handleProfessorBtn(event) {
    console.log("ProfessorBtn click");
    if (subject.value === "") {
        alert("과목명을 입력해주세요.");
        return;
    }
    if (roomNumber.value === "") {
        alert("방 번호를 입력해주세요");
        return;
    }
    exam = subject.value;
    roomId = roomNumber.value;
    let data = {exam:exam, roomId: roomId, userId: socket.id, type: type, name: name };
    socket.emit("professorJoin", data);
}

function exitRoom() {
    location.href = "/exit";
}


//professor
socket.on("createRoom", async (data) => {
    visible();
    const manager_info = document.getElementById("user_info");
    const tag_p = document.createElement("p");
    tag_p.innerText = `과목명: ${data.exam}`;
    manager_info.append(tag_p);
    console.log("Create : " + data.userId + " RoomID : " + data.roomId + "과목명 : " + data.exam);
})


//이미 방을 사용중
socket.on("alreadyExist", () => {
    console.log("already exist");
    alert("이미 방이 사용중입니다.");
});


socket.on("reqAnswer", async (offer, data, ip) => {
    cntStudent = cntStudent + 1;

    studentData[data.userId] = {
        userId: data.userId,
        userName: data.userName,
        userIndex: cntStudent,
        userIp: ip
    };

    student_entered(studentData[data.userId]);


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
    const parti = document.getElementById(`parti_${info.userIndex}`);

    streams.removeChild(userStream);
    parti.remove();
    
    const left_div = document.createElement("div");
    left_div.innerText = `${info.userName}님이 나가셨습니다.`
    left_div.className = "alert";

    alert_area.append(left_div);

    $(`#message_to option[value='${userId}']`).remove();
})

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


function makeForm(idx, userName) {
    const streams = document.getElementById("streams");
    const peerDiv = document.createElement("div");
    peerDiv.id = idx;
    peerDiv.className = "localvideo";
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


function student_entered(info) {
    console.log(info.userName);
    var option = document.createElement("option");
    option.innerText = info.userName;
    option.value = info.userId;
    selectbox.append(option);


    const div = document.createElement("div");
    div.id = `parti_${info.userIndex}`;
    div.className = "participants";
    div.innerText = ` ${info.userName} (${info.userIp})`;
    participants.append(div);

    const div2 = document.createElement("div");
    div2.className = "line";
    div.append(div2);

    const enter_div = document.createElement("div");
    enter_div.innerText = `${info.userName}님이 들어오셨습니다.`
    enter_div.className = "alert";

    alert_area.append(enter_div);
}


socket.on("cheating_detected", (userId, user_status)=>{
    const info = studentData[userId];
    
    const idx = studentData[userId].userIndex;
    const userStream = document.getElementById(idx);
    userStream.className = `localvideo${user_status}`;

    const dectected_div = document.createElement("div");
    dectected_div.innerText = `${info.userName}님의 상태변화가 감지되었습니다.`
    dectected_div.className = "alert";

    alert_area.append(dectected_div);
});


socket.on("two_face", (userId) => {
    const info = studentData[userId];

    const dectected_div = document.createElement("div");
    dectected_div.innerText = `${info.userName}님 화면에 2개 이상의 얼굴이 감지되었습니다.`
    dectected_div.className = "alert";

    alert_area.append(dectected_div);
})

socket.on("face_missing", (userId) => {
    const info = studentData[userId];

    const dectected_div = document.createElement("div");
    dectected_div.innerText = `${info.userName}님 화면에 얼굴이 감지되지 않습니다.`
    dectected_div.className = "alert";

    alert_area.append(dectected_div);
})


