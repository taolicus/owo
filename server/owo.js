const Koa = require('koa');
const WebSocket = require('ws');

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'OwO API';
});

const port = 3001

const server = app.listen(port, () => {
  console.log(`OWO listening on port ${port}`)
});

const wss = new WebSocket.Server({ server });
const clients = new Set();

const faces = [
  '-w-',
  'UωU',
  'UwU',
  'uwu',
  'uωu',
  'OωO',
  'OwO',
  'ÒwÓ',
  'ÓwÒ',
  'owo',
  'ówò',
  'òwó',
  'UzU',
  'UzzU',
  'UzzzU',
  '-z-',
  '-zz-',
  '-zzz-',
  'ÙwÚ',
  'ÚwÙ',
  'úwù',
  'ùwú',
  'XwX',
  'xwx',
  '"w"',
  '""w""',
  '>w<',
  '+w+',
  '⁰w⁰',
  '⁰⁰w⁰⁰',
  '⁰⁰oOwOo⁰⁰',
  '=w=',
  '∅w∅',
  '•w•',
  '• w •',
  '~w~',
  '∆w∆',
  '^w^',
  '#w#',
  '@w@',
  '{ ° }w{ ° }',
  '{ • }w{ ° }',
  '{ ° }w{ • }',
  '{ * }w{ * }',
  '*w*',
  ';w;',
  'TwT',
  '?w?',
  'AwA',
  '. w .',
]

class OwO {
  constructor() {
    this.face = 'OwO'
    this.stats = {
      'OwO': 1
    }
  }
  update() {
    if(this.stats[this.face]) {
      this.stats[this.face]++
    }
    else {
      this.stats[this.face] = 1
    }
    // console.log(this.stats)
  }
  changeFace(faceIndex) {
    this.face = faces[faceIndex]
  }
}

const owo = new OwO();

wss.on('connection', ws => {
  console.log('New WebSocket connection');

  clients.add(ws);

  ws.send(JSON.stringify(owo))

  // ws.on('message', (message) => {
  //   console.log(`Received message: ${message}`);
  //   if(message.toString() === 'get_face') {
  //     owo.changeFace(Math.floor(Math.random() * faces.length))
  //     ws.send(JSON.stringify(owo))
  //   }
  // });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

/* TU DU
- Timer-Based Events

https://chatgpt.com/c/0b07dd9f-0d65-499b-9a62-7584ca69a305

*/

function gameLoop() {
  if(Math.random() < 0.1) {
    console.log('Change face...')
    owo.changeFace(Math.floor(Math.random() * faces.length))
  }
  owo.update()
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      console.log('Sending update...')
      client.send(JSON.stringify(owo));
    }
  })
}

setInterval(gameLoop, 1000 * 60); // 5 seconds
