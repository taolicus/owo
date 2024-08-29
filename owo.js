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
  {
    name: 'ded',
    ascii: 'xwx'
  },
]

const owo = document.getElementById('owo')
//owo.innerHTML = states[0].ascii

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let blink = setInterval(async () => {
  owo.innerHTML = states[1].ascii
  await sleep(200)
  owo.innerHTML = states[0].ascii
  await sleep(200)
  owo.innerHTML = states[1].ascii
  await sleep(200)
  owo.innerHTML = states[0].ascii
}, 6000)

// Web Socket Client

let ws
let reconnectInterval = 1000 // Initial reconnection delay in ms

let owoData

function connect(owoData) {
  ws = new WebSocket('wss://owo.tao.cl')

  ws.onopen = () => {
    console.log('Connected to the server')
    reconnectInterval = 1000 // Reset the reconnection interval after successful connection
    // fetch initial owo data
    doCheck()
  }

  ws.onmessage = (event) => {
    try {
      const response = JSON.parse(event.data)
      // update owo data?
      owoData = response
      owo.innerHTML = owoData.ascii
      console.log(owoData)
      if(!owoData.isAlive) {
        console.log('ded')
        //console.log(blink)
        clearInterval(blink)
        //console.log(blink)
        document.getElementById('feed').style.display = 'none'
        document.getElementById('play').style.display = 'none'
        document.getElementById('sleep').style.display = 'none'
        document.getElementById('revive').style.display = 'block'
      }
      else {
        document.getElementById('feed').style.display = 'inline-block'
        document.getElementById('play').style.display = 'inline-block'
        document.getElementById('sleep').style.display = 'inline-block'
        document.getElementById('revive').style.display = 'none'
      }
      // switch(owoData.isAlive) {
      //   default:
      //     console.log(owoData)
      //     break;
      // }
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

// Initial connection
connect(owoData)

// User Actions
function doCheck() {
  console.log('Sending Check...')
  ws.send('check')
}
// const check = document.getElementById('check')
// check.addEventListener('click', doCheck)

const feed = document.getElementById('feed')
feed.addEventListener('click', () => {
  console.log('Sending feed...')
  ws.send('feed')
})

const play = document.getElementById('play')
play.addEventListener('click', () => {
  console.log('Sending play...')
  ws.send('play')
})

const nap = document.getElementById('sleep')
nap.addEventListener('click', () => {
  console.log('Sending sleep...')
  ws.send('sleep')
})

const revive = document.getElementById('revive')
revive.addEventListener('click', () => {
  console.log('Sending revive...')
  ws.send('revive')
})