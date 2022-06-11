const express = require('express')
const path = require('path')
const app = express()
const port = 3300

app.use(express.static(path.join(__dirname, 'dist', 'spa')))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
