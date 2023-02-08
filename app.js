const express = require('express')
const app = express()
const port = 3002
const router = require('./routes')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/', router)
app.use(errorHandler)

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})