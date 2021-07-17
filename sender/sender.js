const webSocket= new WebSocket("ws://localhost:3000/")


let sender
function username(){
    sender=document.getElementById("box").value
    sendName({
        type:"store_user"
    })
}

function sendName(data){
    data.sender=sender
    webSocket.send(JSON.stringify(data));

}
let localStream

function starter(){
    document.getElementById("video-screen").style.display="inline"
    navigator.getUserMedia({
        video: {
            frameRate: 24,
            width: {
                min: 480, ideal: 720, max: 1280
            },
            aspectRatio: 1.33333
        },
        audio: true
    }, (stream)=>{
        localStream=stream
        document.getElementById("myVideo").srcObject = localStream

    }, (error)=>{
        console.log(error)
    })
  
    let configure={
        iceServers:[
            {

            }
        ]
    }
     peer= RTCPeerConnection(configure)
    peer.addStream(myVideo)

    peer.onaddstream=(e)=> {
    document.getElementById("remote-video")
    .srcObject = e.stream
    }

}

