const Koa = require('koa');
const WebSocket = require('ws');

let dedFlag = false

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'OwO';
});

const server = app.listen(3000, () => {
  console.log('OWO listening on port 3000')
});

const wss = new WebSocket.Server({ server });

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

  revive() {
    this.hunger = 0;
    this.happiness = 100;
    this.energy = 100;
    this.age = 0;
    this.isAlive = true;
    dedFlag = false;
    // console.log(`
    //   Name: ${this.name}
    //   Age: ${this.age}
    //   Hunger: ${this.hunger}
    //   Happiness: ${this.happiness}
    //   Energy: ${this.energy}
    // `);
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

const owo = new Pet('OwO');

wss.on('connection', ws => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    switch(message.toString()) { // turn buffer into string for comparison
      case 'check':
        console.log('Check')
        ws.send(JSON.stringify(owo))
        break;
      case 'feed':
        owo.feed()
        ws.send('Fed')
        ws.send(JSON.stringify(owo))
        break;
      case 'play':
        owo.play()
        ws.send('Played')
        ws.send(JSON.stringify(owo))
        break;
      case 'sleep':
        owo.sleep()
        ws.send('Slept')
        ws.send(JSON.stringify(owo))
        break;
      case 'revive':
        owo.revive()
        ws.send('Revived')
        ws.send(JSON.stringify(owo))
      default:
        console.log('Oli')
        ws.send('Oli');
        break;
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

/* TU DU
- On the client, listen for updates and apply them to the UI
- Broadcast the new state to all connected clients
- Timer-Based Events

https://chatgpt.com/c/0b07dd9f-0d65-499b-9a62-7584ca69a305

*/

function gameLoop() {
  // changes
  if(owo.isAlive) {
    owo.timePasses()
    console.log(owo)
  }
  else {
    if(dedFlag == false) {
      wss.clients.forEach(client => {
        console.log('sending ded')
        client.send(JSON.stringify(owo))
      })
      dedFlag = true
    }
  }
}

setInterval(gameLoop, 1000 * 1)
