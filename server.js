const Socket = require("websocket").server
const http = require("http")

const server = http.createServer((req, res) => {})

server.listen(3000, () => {
    console.log("Listening on port 3000...")
})

const webSocket = new Socket({ httpServer: server })

let users = []

webSocket.on('request', (req) => {
    const connection = req.accept()

    connection.on('message', (message) => {
        const data = JSON.parse(message.utf8Data)

        const user = findUser(data.sender)

        switch(data.type) {
            case "store_user":

                if (user != null) {
                    return
                }

                const newUser = {
                     conn: connection,
                     sender: data.sender
                }

                users.push(newUser)
                console.log(newUser.sender)
                break
            case "store_offer":
                if (user == null)
                    return
                user.offer = data.offer
                break
            
            case "store_candidate":
                if (user == null) {
                    return
                }
                if (user.candidates == null)
                    user.candidates = []
                
                user.candidates.push(data.candidate)
                break
            case "send_answer":
                if (user == null) {
                    return
                }

                sendName({
                    type: "answer",
                    answer: data.answer
                }, user.conn)
                break
            case "send_candidate":
                if (user == null) {
                    return
                }

                sendName({
                    type: "candidate",
                    candidate: data.candidate
                }, user.conn)
                break
            case "join_meet":
                if (user == null) {
                    return
                }

                sendName({
                    type: "offer",
                    offer: user.offer
                }, connection)
                
                user.candidates.forEach(candidate => {
                    sendName({
                        type: "candidate",
                        candidate: candidate
                    }, connection)
                })

                break
        }
    })

    connection.on('close', (reason, description) => {
        users.forEach(user => {
            if (user.conn == connection) {
                users.splice(users.indexOf(user), 1)
                return
            }
        })
    })
})

function sendName(data, conn) {
    conn.send(JSON.stringify(data))
}

function findUser(sender) {
    for (let i = 0;i < users.length;i++) {
        if (users[i].sender == sender)
            return users[i]
    }
}