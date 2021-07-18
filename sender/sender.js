const webSocket= new WebSocket("ws://localhost:3000/")

webSocket.onmessage = (event) => {
    handleSignallingData(JSON.parse(event.data))
}

function handleSignallingData(data) {
    switch (data.type) {
        case "answer":
            peerConn.setRemoteDescription(data.answer)
            break
        case "candidate":
            peerConn.addIceCandidate(data.candidate)
    }
}


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
let peer
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
             type: " candidate",
             candidate: e.candidate
         })

    })
      

       createAndSendOffer()
    }, (error)=>{
        console.log(error)
    })
}
    function createAndSendOffer(){
        peer.createOffer((offer) => {
            sendName({
                type:"store_offer",
                offer:offer
            })
            peer.setLocalDescription(offer)
      
        },  (error) => {
             console.log(error)
        })
    }

   



