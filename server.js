const Socket =require("webSocket").server//websocket
const http= require("http")

const server= http.createServer((req,res) => {})

 server.listen(3000, ()  => {
     console.log("listening on port 3000...")
 })

 const webSocket =new Socket({httpServer:server})

 let names =[] //users

 webSocket.on('request', (req) => {
     const data =JSON.parse(message.utf8Data)
    
      switch(data.type)  {
          case "store_user":
              if(user!=null)
               const newUser={
                   conn: connection,
                   username: data.username
               }

               names.push(newUser)
               console.log(newUser.username)
               break
      }
       

 } )

 function finduser (username) {
     for(let i=0;i<names.length;i++){
         if(names[i].username= username)
           return users[i]
     }
 } 