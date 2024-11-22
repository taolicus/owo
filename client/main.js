const owo = document.getElementById('owo')
const actionButtons = document.getElementById('actions')
const ctx = document.getElementById('stats-chart');
ctx.style.width = '120px'
ctx.style.margin = '2rem'

// Web Socket Client
let ws
let reconnectInterval = 1000 // Initial reconnection delay in ms

let owoData

let actions = []

function connect(owoData) {
  // ws = new WebSocket('wss://owo.tao.cl')
  ws = new WebSocket('ws://localhost:3000')

  if(ws) {
    ws.onopen = () => {
      console.log('Connected to the server')
      reconnectInterval = 1000 // Reset the reconnection interval after successful connection
      ws.send('get_face')
    }

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data)
        owoData = response
        owo.innerHTML = owoData.face
        owo.innerHTML = owoData.face
      }
      catch {
        console.log(`Received: ${event.data}`)
      }

      if(owoData) {
        // Chart
        const data = Object.values(owoData.stats)
        const labels = Object.keys(owoData.stats)
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels,
            datasets: [{
              data,
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
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
connect(owoData)

// User Actions
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

actions.push(getFace)

actions.forEach(() => {actionButtons.appendChild(getFace)})
