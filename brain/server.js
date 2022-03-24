const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 7000 });
const min = 6;
const max = 18;

let counter = 0;
let isPower = true;
const costs = [12,12,12,12,12,12,12,11,11,10,10,9,9,10,10,11,12,12,12,11,12,12,11,10,9,9,9,9,10,11,12];

wss.on('connection', ws => {

    console.log(`Connection`);
    ws.send(JSON.stringify({isPower: true, cent : 12}));

    ws.on('message', message => {
        console.log(`Received message => ${message}`);
    });

    setInterval(() => {
        if (counter > 30) {
            counter = 0;
            console.log(`counter : => 0`);
        }

        const cent = costs[counter];
        console.log(`Send message cent : => ${cent}`);
        wss.clients.forEach(function(client) {
            client.send(JSON.stringify({isPower: isPower, cent : cent}));
        });

        counter++;

    }, 10000);
});

const express = require('express');
const app = express();
const cors = require("cors");

const whitelist = ["http://localhost:3001"]
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}

// app.use(
//     express.urlencoded({
//         extended: true
//     })
// )

app.use(express.json());

app.use(cors(corsOptions));

app.post('/power', (req, res) => {
    console.log('power', req.body);
    isPower = req.body.isPower;
    res.send({ isPower: req.body.isPower });
})

const port = 4000;
app.listen(port);
console.log(`Listening at http://localhost:${port}`);