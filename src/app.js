import crypto from 'crypto'
import { Worker } from 'node:worker_threads'
import express from 'express'

const PORT = 3000

const app = express()

function doWork (duration = 5000) {
  const start = Date.now()
  while (Date.now() - start < duration) {}
}

app.use(express.json())
app.use((req, res, next) => {
  console.log(`${req.method} - ${req.path}`)
  next()
})

app.get('/status', (req, res) => {
  doWork()
  res.status(200).json({
    status: 'server is up!'
  })
})
app.get('/', (req, res) => {
  const worker = new Worker('./src/worker.js')

  worker.on('message', function(message) {
    console.log(message)
    res.json({
      msg: ''+ message
    })
  })

  worker.postMessage('start!')
})

export default function startApp() {
  app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`))
}

