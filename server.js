const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const toyService = require('./services/toy.service')

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://localhost:3000',
    ],
    credentials: true,
}
app.use(cors(corsOptions))

// LIST
app.get('/api/toy', (req, res) => {
    var { txt, labels, sort, inStock } = req.query

    const filterBy = {
        txt: txt || '',
        inStock: JSON.parse(inStock) || false,
        labels: labels || [],
        sort: sort || '',
    }

    toyService.query(filterBy).then((toys) => {
        // console.log("🚀 ~ file: server.js ~ line 39 ~ toyService.query ~ toys", toys)
        res.send(toys)
    })
})

// READ
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(toyId).then((toy) => {
        res.send(toy)
    })
})

// ADD
app.post('/api/toy', (req, res) => {
    const { name, price, inStock, createdAt, labels } = req.body
    const toy = {
        name,
        price,
        inStock,
        createdAt,
        labels,
        // reviews,
    }
    toyService.save(toy).then((savedToy) => {
        res.send(savedToy)
    })
})

// UPDATE
app.put('/api/toy/:toyId', (req, res) => {
    const { name, price, _id, inStock, createdAt, labels } = req.body

    const toy = {
        _id,
        name,
        price,
        inStock,
        createdAt,
        labels,
        // reviews,
    }
    toyService.save(toy).then((savedToy) => {
        res.send(savedToy)
    })
})

// DELETE
app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.remove(toyId).then(() => {
        res.send('Removed!')
    })
})

app.listen(3030, () =>
    console.log(`Server listening on port http://127.0.0.1:3030/`)
)