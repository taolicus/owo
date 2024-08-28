const states = [
  {
    name: 'idle',
    ascii: 'OwO'
  },
  {
    name: 'blinking',
    ascii: '-w-'
  },
  {
    name: 'angry',
    ascii: 'ÒwÓ'
  },
  {
    name: 'scared',
    ascii: 'ÓwÒ'
  },
  {
    name: 'sad',
    ascii: 'UwU'
  },
  {
    name: 'perplexed',
    ascii: 'owo'
  },
]

const owo = document.getElementById('owo')
owo.innerHTML = states[0].ascii

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }
// setInterval(async () => {
//   owo.innerHTML = states[1].ascii
//   await sleep(200)
//   owo.innerHTML = states[0].ascii
//   await sleep(200)
//   owo.innerHTML = states[1].ascii
//   await sleep(200)
//   owo.innerHTML = states[0].ascii
// }, 6000)

// Web Socket Client

let ws
let reconnectInterval = 1000 // Initial reconnection delay in ms

function connect() {
  ws = new WebSocket('wss://owo.tao.cl')

  ws.onopen = () => {
    console.log('Connected to the server')
    reconnectInterval = 1000 // Reset the reconnection interval after successful connection
  }

  ws.onmessage = (event) => {
    console.log(`Received: ${event.data}`)
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

// Initial connection
connect()

// User Actions
const msg = document.getElementById('send-msg')
msg.addEventListener('click', () => {
  console.log('Sending Check...')
  ws.send('check')
})