const Koa = require('koa');
const WebSocket = require('ws');

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'OwO API';
});

const server = app.listen(3000, () => {
  console.log('OWO listening on port 3000')
});

const wss = new WebSocket.Server({ server });

const faces = [
  'OwO',
  'UzU',
  'ÒwÓ',
  'ÓwÒ',
  'XwX',
]

class OwO {
  constructor() {
    this.face = 'OwO'
    this.stats = {}
  }
  update() {
    if(this.stats[this.face]) {
      this.stats[this.face]++
    }
    else {
      this.stats[this.face] = 1
    }
    console.log(this.stats)
  }
  changeFace(faceIndex) {
    this.face = faces[faceIndex]
  }
}

const owo = new OwO();

wss.on('connection', ws => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    if(message.toString() === 'get_face') {
      owo.changeFace(Math.floor(Math.random() * faces.length))
      ws.send(JSON.stringify(owo))
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

/* TU DU
- Timer-Based Events

https://chatgpt.com/c/0b07dd9f-0d65-499b-9a62-7584ca69a305

*/

function gameLoop() {
  owo.update()
}

setInterval(gameLoop, 2000)
