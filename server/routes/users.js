const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { query } = require('../db.config');





router.get('/validateid/:id', async (req, res) => {
    try {
        const select_q = `SELECT (id) FROM users WHERE id="${req.params.id}"`
        const user = await query(select_q)
        if (user[0]) return res.status(200).json({ err: false, msg: "This ID number is already in use!" })
        res.status(200).json({ err: false, msg: "ID ok!" })
    } catch (err) {
        res.status(500).json({ err: true, msg: err })
    }
})

router.get('/validateemail/:email', async (req, res) => {
    try {
        const select_q = `SELECT (email) FROM users WHERE email="${req.params.email}"`
        const user = await query(select_q)
        if (user[0]) return res.status(200).json({ err: false, msg: "This email address is already in use!" })
        res.status(200).json({ err: false, msg: "Email ok!" })
    } catch (err) {
        res.status(500).json({ err: true, msg: err })
    }
})


router.post('/register', async (req, res) => {
    let { id, name, surname, email, password, city, street, role } = req.body;
    try {
        const select_query = `SELECT * from users WHERE id="${req.body.id}"`
        const user = await query(select_query)
        if (user[0]) return res.status(401).json({ err: true, msg: "The ID is is already registered" })
        const adminUser = { id: '333333333', email: 'qwa@qwa.com' }
        if (req.body.id === adminUser.id) {
            role = 'admin'
        } else {
            role = 'client'
        }
        const hash = await bcrypt.hash(password, 10)
        const insert_query = `INSERT INTO users ( id,name, surname, email, password,city,street,role)
        VALUES ("${id}","${name}","${surname}","${email}","${hash}","${city}","${street}","${role}")`
        await query(insert_query)
        const select_updatedquery = `SELECT * from users `
        const updatedUsers = await query(select_updatedquery)
        res.status(201).json(updatedUsers)
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: true, msg: err })
    }
});

router.put('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const select_query = `SELECT id,role,name,surname,email,city,street,password,signedIn FROM users WHERE email="${email}" `
        const user = await query(select_query)
        if (!user[0]) return res.status(401).json({ err: true, msg: "user not found" })
        const match = await bcrypt.compare(password, user[0].password);
        if (!match) return res.status(403).json({ err: true, msg: "wrong password" })
        const access_token = jwt.sign({ ...user, password: "****" }, "pizdec", {
            expiresIn: "10m"
        })
        const refresh_token = jwt.sign({ id: user[0].id, role: user[0].role, city: user[0].city, street: user[0].street }, "blah", {
            expiresIn: "60m"
        })
        if (!user.connectedDevices) {
            user.connectedDevices = [refresh_token]
            console.log(user.connectedDevices)
        } else {
            user.connectedDevices.push(refresh_token)
        }
        const signedIn_q = `UPDATE users SET signedIn=1, role="${user[0].role}",connected_devices="${user.connectedDevices}",access_token="${access_token}"   WHERE id="${user[0].id}"`
        const updated_user = await query(signedIn_q);
        const signedInUser_q = `SELECT * FROM users WHERE id = "${user[0].id}"`
        const signedInUser = await query(signedInUser_q)
        res.status(200).json({ err: false, signedInUser, access_token, refresh_token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: true, msg: err })

    }

});
router.get('/gettokenwithrefresh/:id', async (req, res) => {
    try {
        const select_query = `SELECT id,role,name,surname,email,city,street,password,signedIn FROM users WHERE id="${req.params.id}" `
        const user = await query(select_query)
        const access_token = jwt.sign({ ...user, password: "****" }, "pizdec", {
            expiresIn: "3m"
        })
        const signedIn_q = `UPDATE users SET  access_token="${access_token}"   WHERE id="${user[0].id}"`
        await query(signedIn_q);
        const refreshedUser_q = `SELECT * FROM users WHERE id = "${user[0].id}"`
        const refreshedUser = await query(refreshedUser_q)
        res.status(200).json({ err: false, access_token, refreshedUser })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: true, msg: err })
    }
})
router.put('/logout', async (req, res) => {
    try {
        const q = `SELECT * FROM users WHERE access_token="${req.body.body}"`
        const signedUser = await query(q)
        const update_q = `UPDATE users SET signedIn=0,access_token=null, connected_devices=null WHERE id="${signedUser[0].id}"`
        await query(update_q)
        const select_q = `SELECT * FROM users WHERE id="${signedUser[0].id}"`
        const signedOutUser = await query(select_q)
        res.status(201).json(signedOutUser)
    } catch (err) {
        res.status(500).json(err)
    }
});



module.exports = router