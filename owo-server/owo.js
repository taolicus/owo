const Koa = require('koa');
const WebSocket = require('ws');

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'OwO';
});

const server = app.listen(3000, () => {
  console.log('OWO listening on port 3000')
});

class Pet {
  constructor(name) {
    this.name = name;
    this.hunger = 0;
    this.happiness = 100;
    this.energy = 100;
    this.age = 0;
    this.isAlive = true;
  }

  feed() {
    this.hunger = Math.max(0, this.hunger - 20);
    this.happiness += 5;
    console.log(`${this.name} has been fed.`);
  }

  play() {
    this.happiness += 20;
    this.energy -= 10;
    this.hunger += 5;
    console.log(`${this.name} enjoyed playing!`);
  }

  sleep() {
    this.energy = 100;
    this.hunger += 10;
    console.log(`${this.name} had a good sleep.`);
  }

  checkStatus() {
    console.log(`
      Name: ${this.name}
      Age: ${this.age}
      Hunger: ${this.hunger}
      Happiness: ${this.happiness}
      Energy: ${this.energy}
    `);
  }

  timePasses() {
    this.age++;
    this.hunger += 5;
    this.happiness -= 5;
    this.energy -= 5;

    if (this.hunger >= 100 || this.happiness <= 0 || this.energy <= 0) {
      this.isAlive = false;
      console.log(`${this.name} has passed away. Game over.`);
    }
  }
}

const pet = new Pet('OwO');

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    console.log(typeof message)
    if(message == 'check') {
      ws.send(JSON.stringify(pet))
    } 
    else {
      console.log('...')
      ws.send('Oliwi!!');
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

/* TU DU
- Pet Class/State Object
- Handle the event and update the pet's state
- Broadcast the new state to all connected clients
- On the client, listen for updates and apply them to the UI
- Timer-Based Events

https://chatgpt.com/c/0b07dd9f-0d65-499b-9a62-7584ca69a305

*/

function gameLoop() {
  // changes
  console.log(pet)
}

setInterval(gameLoop, 1000 * 3)
