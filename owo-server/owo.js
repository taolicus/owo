const Koa = require('koa');
const WebSocket = require('ws');

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'OwO';
});

const server = app.listen(3000, () => {
  console.log('OWO listening on port 3000')
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    ws.send('Oliwi!!');
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

class Pet {
  constructor() {
    this.state = 'Idle'; // Initial state
    this.hunger = 100; // Example attribute
    // Add other attributes as needed
  }

  handleEvent(event) {
    switch (event) {
      case 'Feed':
        this.hunger = Math.min(this.hunger + 10, 100);
        this.state = 'Happy';
        break;
      case 'Play':
        this.state = 'Playing';
        // Other state changes
        break;
      // Add other events and state transitions
    }
  }

  getState() {
    return {
      state: this.state,
      hunger: this.hunger,
      // Return other attributes
    };
  }
}

const pet = new Pet();


/* TU DU
- Pet Class/State Object
- Handle the event and update the pet's state
- Broadcast the new state to all connected clients
- On the client, listen for updates and apply them to the UI
- Timer-Based Events

https://chatgpt.com/c/0b07dd9f-0d65-499b-9a62-7584ca69a305

*/
