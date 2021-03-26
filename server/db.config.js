const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'MyStore'
})
connection.connect(err => {
    if (err) return res.status(500).json({ err: true, msg: err })
    console.log("SQL is connected")
})
const query = (q, ...values) => {
    console.log(values)
    return new Promise((resolve, reject) => {
        connection.query(q, values, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = { query }