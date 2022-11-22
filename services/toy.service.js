const fs = require('fs')
const gToys = require('../data/toy.json')

module.exports = {
    query,
    getById,
    remove,
    save,
}

const reviews = [
    {
        _id: 'aAaAa',
        username: 'Matilda',
        txt: 'Great toy!',
        createdAt: 1631531801011,
        rate: 4
    },
    {
        _id: 'bBbBb',
        username: 'John',
        txt: 'meh',
        createdAt: 1631531801011,
        rate: 2
    },
    {
        _id: 'cCcCc',
        username: 'Ben',
        txt: 'A lot of fun',
        createdAt: 1631531801011,
        rate: 3
    },
]

function query(filterBy) {
    return Promise.resolve(_filter(filterBy))
}

function getById(toyId) {
    const toy = gToys.find((toy) => toy._id === toyId)
    toy.reviews = reviews
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = gToys.findIndex((toy) => toy._id === toyId)
    gToys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy) {
    // console.log(toy);
    if (toy._id) {
        const idx = gToys.findIndex((currToy) => currToy._id === toy._id)
        gToys[idx] = toy
    } else {
        toy._id = _makeId()
        gToys.unshift(toy)
    }
    return _saveToysToFile().then(() => toy)
}

function _filter(filterBy) {

    // console.log('filterBy line 66 toy.service:', filterBy)

    const { txt, labels, sort, inStock } = filterBy

    const regex = new RegExp(txt, 'i')
    let filteredToys = gToys.filter((toy) => regex.test(toy.name))
    // console.log("🚀 ~ file: toy.service.js ~ line 50 ~ _filter ~ filteredToys", filteredToys)

    if (inStock) filteredToys = filteredToys.filter(toy => toy.inStock === inStock)
    // console.log("🚀 ~ file: toy.service.js ~ line 53 ~ _filter ~ filteredToys", filteredToys)

    if (labels || labels.length) { } //Do something!


    if (sort) {
        if (sort === 'name') filteredToys.sort((toy1, toy2) => toy1.name.localeCompare(toy2.name))
        else if (sort === 'price') filteredToys.sort((toy1, toy2) => toy1.price - toy2.price)
        else if (sort === 'created') filteredToys.sort((toy1, toy2) => toy1.createdAt - toy2.createdAt)
    }
    // if (label !== 'All') {
    //     filteredToys = filteredToys.filter((toy) => toy.labels.includes(label))
    // }

    // filteredToys = filteredToys.filter((toy) => {
    //   return label.some((label) => toy.labels.includes(label))
    // })
    // console.log("🚀 ~ file: toy.service.js ~ line 69 ~ _filter ~ filteredToys", filteredToys)
    return filteredToys
}

function _makeId(length = 5) {
    var txt = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gToys, null, 2)

        fs.writeFile('data/toy.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}