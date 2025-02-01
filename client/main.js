const owo = document.getElementById('owo')

// Chart
const ctx = document.getElementById('stats-chart');
ctx.style.width = '120px'
ctx.style.margin = '2rem'
// let stats
let myChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      data: [],
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      colorschemes: {
        scheme: 'tableau.Classic20'
      }
    }
  }
});

// Web Socket Client
let ws
let reconnectInterval = 1000 // Initial reconnection delay in ms

function connect() {
  const host = window.location.hostname;
  const prod = host !== 'localhost';
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = prod ? '/owo_ws' : ':3000';
  const socket_url = `${protocol}//${host}${socket}`;
  console.log('Connecting to:', socket_url);
  ws = new WebSocket(socket_url);

  if(ws) {
    ws.onopen = () => {
      console.log('Connected to the server')
      reconnectInterval = 1000 // Reset the reconnection interval after successful connection
      // ws.send('get_face')
    }

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data)
        owo.innerHTML = response.face
        owo.innerHTML = response.face
        myChart.data.labels = Object.keys(response.stats);
        myChart.data.datasets[0].data = Object.values(response.stats);
        myChart.update();
      }
      catch {
        console.log(`Received: ${event.data}`)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed. Attempting to reconnect...')
      setTimeout(connect, reconnectInterval)
      reconnectInterval = Math.min(reconnectInterval * 2, 30000) // Exponential backoff, max 30 seconds
    }

    ws.onerror = (error) => {
      console.error(`WebSocket error: ${error.message}`)
      ws.close() // Close the connection on error to trigger reconnection
    }
  }
}

// Initial connection
connect()

// User Actions
const actionButtons = document.getElementById('actions')
let actions = []

function createAction(name, label, callback) {
  const btn = document.createElement('button')
  btn.id = name
  btn.classList.add('btn')
  btn.innerHTML = label
  btn.addEventListener('click', callback)
  return btn
}

const pet = createAction('pet', 'Pet', () => {
  console.log('Sending pet...')
  // ws.send(name)
})

const getFace = createAction('get_face', 'Get Face', () => {
  console.log('Sending get_face...')
  ws.send('get_face')
})

function doCheck() {
  console.log('Sending Check...')
  ws.send('check')
}

// actions.push(getFace)

actions.forEach(() => {actionButtons.appendChild(getFace)})
