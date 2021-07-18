const webSocket= new WebSocket("ws://localhost:3000/")

webSocket.onmessage = (event) => {
    handleSignallingData(JSON.parse(event.data))
}

function handleSignallingData(data) {
    switch (data.type) {
        case "offer":
            peerConn.setRemoteDescription(data.offer)
            createAndSendAnswer()
            break
        case "candidate":
            peerConn.addIceCandidate(data.candidate)
    }
}

function createAndSendAnswer(){
    peer.createAnswer((answer)=>{
        peer.setLocalDescription(answer)
        sendName({
            type:"send_answer",
            answer:answer
        })
    }, (error) =>{
             console.log(error)
    })
}

let sender

function sendName(data){
    data.sender=sender
    webSocket.send(JSON.stringify(data));

}
let localStream
let peer
function JoinMeet(){

    sender=document.getElementById("box").value
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

        let configure={
            iceServers:[
                {
                   
                }
            ]
        }

     peer= new RTCPeerConnection(configure)
     peer.addStream(myVideo)
 
     peer.onaddstream=(e)=> {
     document.getElementById("YourVideo").srcObject = e.stream
     }

    peer.onicecandidate = ((e) => {
        if(e.candidate==null)
         return

         sendName({
             type: " send_candidate",
             candidate: e.candidate
         })

    })
          sendName({
              type: "join_meet"
          })
    
    }, (error)=>{
        console.log(error)
    })
}
    
    let MuteAudio= true
    function AudioControl(){
      MuteAudio= false
      localStream.getAudioTracks()[0].enabled=  MuteAudio
    }
   
    let MuteVideo= true
    function VideoControl(){
        MuteVideo=false
        localStream.getAudioTracks()[0].enabled= MuteVideo
    }
  


