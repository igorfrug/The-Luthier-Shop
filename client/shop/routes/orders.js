const router = require('express').Router();
const { query } = require('../db.config');;
const jwt = require('jsonwebtoken')
const { createReceipt } = require('../createReceipt');


const vt = (req, res, next) => {
    jwt.verify(req.headers['authorization'], 'pizdec', async (err, payload) => {
        if (err) return res.status(400).json("Bad request error")
        const user_q = `SELECT * FROM users WHERE id="${payload[0].id}"`
        const user = await query(user_q)
        if (!user[0].access_token)
            return res.status(400).json("Token not valid")
        if (!user[0].connected_devices.includes(req.headers['refresh']))
            return res.status(403).json("You have just logged out.Access denied.")
        console.log("token OK")
        res.status(200)
        req.user = payload
        next()

    })

}

router.get('/', vt, async (req, res) => {
    try {
        const select_q = `SELECT * FROM product `
        const selectedProducts = await query(select_q)
        res.status(200).json({ err: false, selectedProducts })
        console.log(selectedProducts)
    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})
router.get('/searchbaskets/:id', async (req, res) => {
    try {
        const select_q = `SELECT * FROM basket WHERE user_id="${req.params.id}" AND status="open"`
        const open_selectedBasket = await query(select_q)
        if (open_selectedBasket.length === 1) {
            const select_q2 = `SELECT  basket_item.quantity,basket_item.total_price, product.id,product.author,product.name,product.description,product.price,product.image,product.category_id  FROM basket_item INNER JOIN product ON basket_item.product_id=product.id WHERE basket_id="${open_selectedBasket[0].id}"  AND status="open"`
            const chosen_items = await query(select_q2)
            const open_basket = open_selectedBasket[0]
            res.status(200).json({ err: false, open_basket, chosen_items })
        } else {
            const select_q1 = `SELECT * FROM basket WHERE user_id="${req.params.id}" AND status="closed"`
            const closed_selectedBasket = await query(select_q1)
            res.status(200).json({ err: false, closed_selectedBasket: closed_selectedBasket[closed_selectedBasket.length - 1] })
        }
    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})
router.get('/productscount', async (req, res) => {
    try {
        const select_q = `SELECT COUNT (id) FROM product`
        const numOfProducts = await query(select_q)
        res.status(200).json({ err: false, numOfProducts: numOfProducts[0] })
    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})
router.get('/orderscount', async (req, res) => {
    try {
        const select_q = `SELECT COUNT (id) FROM order_details`
        const numOfOrders = await query(select_q)
        res.status(200).json({ err: false, numOfOrders: numOfOrders[0] })
    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})
router.get('/freeshipdates', async (req, res) => {
    try {
        const select_q = `SELECT COUNT (id),shipping_date FROM order_details  GROUP BY shipping_date LIMIT 60`
        const freeshipdates = await query(select_q)
        res.status(200).json({ err: false, freeshipdates })
    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})


router.get('/bycategory/:categoryID', vt, async (req, res) => {
    const categoryID = req.params.categoryID
    try {
        const select_q = `SELECT * FROM product WHERE category_id="${categoryID}"`
        const products_by_category = await query(select_q)
        res.status(200).json({ err: false, products_by_category })
    } catch (err) {
        res.status(500).json({ err: true, err })
    }
})
router.get('/byname/:name', vt, async (req, res) => {
    const name = req.params.name
    try {
        const select_q = `SELECT * FROM product WHERE name LIKE "%${name}%" OR author LIKE "%${name}%"`
        const product_by_name = await query(select_q)
        res.status(200).json({ err: false, product_by_name })
    } catch (err) {
        res.status(500).json({ err: true, err })
    }
})
router.post('/basket', vt, async (req, res) => {
    const date = new Date()
    try {
        const insert_q = `INSERT INTO basket (user_id,date) VALUES("${req.body.body}","${date}")`
        await query(insert_q)
        const select_q = `SELECT * FROM basket WHERE user_id="${req.body.body}" AND status="open"`
        const newbasket = await query(select_q)
        res.status(200).json({ err: false, newbasket })
    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})
router.post('/iteminbasket', vt, async (req, res) => {
    try {
        const select_q = `SELECT * FROM product WHERE id="${req.body.productID}"`
        const chosen_product = await query(select_q)
        const total_price = chosen_product[0].price
        const insert_q = `INSERT INTO basket_item (product_id,quantity,total_price,basket_id) VALUES ("${chosen_product[0].id}","${req.body.quantity}","${total_price}","${req.body.newBasketID}")`
        await query(insert_q)
        const select_q1 = `SELECT product.id,product.author,product.name,product.image,product.category_id,product.description,product.price, basket_item.quantity,basket_item.total_price  FROM product INNER JOIN basket_item ON product.id=basket_item.product_id WHERE product.id="${req.body.productID}" AND basket_item.status="open"`
        const item_in_basket = await query(select_q1)
        const sum_q = `SELECT SUM (total_price) FROM basket_item WHERE basket_id="${req.body.newBasketID}"`
        const totalPrice = await query(sum_q)
        const select_b = `SELECT total_price FROM basket WHERE id="${req.body.newBasketID}"`
        const pre_total_price = await query(select_b)
        const totalprice = total_price + pre_total_price[0].total_price
        const update_q = `UPDATE basket SET total_price ="${totalprice}"  WHERE id="${req.body.newBasketID}"`
        await query(update_q)
        res.status(200).json({ err: false, item_in_basket, totalPrice })
    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})
router.put('/addquantity', vt, async (req, res) => {
    try {
        const q = `SELECT product.id,product.author,product.name,product.description,product.price,product.image,product.category_id, basket_item.*  FROM product INNER JOIN basket_item ON product.id=basket_item.product_id WHERE product.id="${req.body.id}"  AND basket_item.status="open" AND basket_item.basket_id="${req.body.basketid}"`
        const result = await query(q)
        const n_quantity = result[0].quantity + 1
        const n_price = result[0].price * n_quantity
        const update_q = `UPDATE basket_item SET quantity="${n_quantity}",total_price="${n_price}" WHERE product_id="${req.body.id}" AND basket_item.status="open"  AND basket_item.basket_id="${req.body.basketid}"`
        await query(update_q)
        const select_q = `SELECT product.id,product.author,product.name,product.description,product.price,product.image,product.category_id, basket_item.quantity,basket_item.total_price  FROM product INNER JOIN basket_item ON product.id=basket_item.product_id WHERE product.id="${req.body.id}"  AND basket_item.status="open"  AND basket_item.basket_id="${req.body.basketid}"`
        const updated_q = await query(select_q)
        res.status(200).json({ err: false, updated_q })
    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})
router.put('/removequantity', vt, async (req, res) => {
    try {
        const q = `SELECT product.id,product.author,product.name,product.description,product.price,product.image,product.category_id, basket_item.*  FROM product INNER JOIN basket_item ON product.id=basket_item.product_id WHERE product.id="${req.body.id}"  AND basket_item.status="open"  AND basket_item.basket_id="${req.body.basketid}"`
        const result = await query(q)
        const n_quantity = result[0].quantity - 1
        const n_price = result[0].price * n_quantity
        const update_q = `UPDATE basket_item SET quantity="${n_quantity}",total_price="${n_price}" WHERE product_id="${req.body.id}" AND basket_item.status="open"  AND basket_item.basket_id="${req.body.basketid}"`
        await query(update_q)
        const select_q = `SELECT product.id,product.author,product.name,product.description,product.price,product.image,product.category_id, basket_item.quantity,basket_item.total_price  FROM product INNER JOIN basket_item ON product.id=basket_item.product_id WHERE product.id="${req.body.id}"  AND basket_item.status="open"  AND basket_item.basket_id="${req.body.basketid}"`
        const updated_q = await query(select_q)
        res.status(200).json({ err: false, updated_q })
    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})
router.delete('/deletefrombasket/:itemid/:basketid', vt, async (req, res) => {
    console.log(req.params.itemid, req.params.basketid)
    try {
        const select_q = `SELECT product.id,product.author,product.name,product.image, basket_item.quantity,basket_item.total_price,basket_item.basket_id  FROM product INNER JOIN basket_item ON product.id=basket_item.product_id WHERE product.id="${req.params.itemid}" AND basket_item.status="open"`
        const deletedItem = await query(select_q)
        const delete_q = `DELETE  FROM basket_item WHERE product_id="${req.params.itemid}" AND basket_item.status="open"`
        const returned_item = await query(delete_q)
        const sum_q = `SELECT SUM (total_price) FROM basket_item WHERE basket_id="${req.params.basketid}" AND basket_item.status="open"`
        const totalPrice = await query(sum_q)
        res.status(200).json({ err: false, deletedItem, returned_item, totalPrice })

    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})
router.delete('/emptybasket/:basketid', vt, async (req, res) => {
    try {
        const delete_q = `DELETE FROM basket_item WHERE basket_id=${req.params.basketid}`
        const empty_basket = await query(delete_q)
        res.status(200).json({ err: false, empty_basket })
    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})
router.put('/savebasket/', vt, async (req, res) => {
    const { id, totalPrice, shippingDate, card, userID, city, street } = req.body
    const date = new Date()
    try {
        const update_q = `UPDATE basket SET status="closed"  WHERE id="${id}"`
        await query(update_q)
        const update_q1 = `UPDATE basket_item SET status="closed"  WHERE basket_id="${id}"`
        await query(update_q1)
        const insert_q = `INSERT INTO order_details (user_id,order_date,basket_id,total_price,city,street,shipping_date,credit_card_number)
       
         VALUES("${userID}","${date.toString()}","${id}","${totalPrice}","${city}","${street}","${shippingDate}","${card}")`
        await query(insert_q)
        const select_q2 = `SELECT * FROM order_details WHERE basket_id="${id}"`
        const newOrder = await query(select_q2)
        const select_q = `SELECT basket_item.quantity,basket_item.total_price,basket_item.status,product.id,product.author,product.name,product.price  FROM basket_item INNER JOIN product ON basket_item.product_id=product.id   WHERE basket_id="${req.body.id}"`
        const ordered_items = await query(select_q)
        const select_q1 = `SELECT * FROM basket WHERE id="${req.body.id}"`
        const updated_basket = await query(select_q1)
        res.status(200).json({ err: false, ordered_items, updated_basket, newOrder })
    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})

router.get('/numofincartitems/:basketID', async (req, res) => {
    try {
        const select = `SELECT SUM(quantity) FROM basket_item where basket_id="${req.params.basketID}"`
        const num_of_items = await query(select)
        res.status(200).json({ err: false, num_of_items })
    } catch (err) {
        res.status(500).json({ err: true, err })
        console.log(err)
    }
})
router.get('/printreceipt/:userID/:basketID', async (req, res) => {
    try {
        const select_q = `SELECT order_details.*, users.name,users.surname FROM  order_details INNER JOIN users ON users.id=order_details.user_id WHERE user_id="${req.params.userID}" AND basket_id="${req.params.basketID}"`
        const details = await query(select_q)
        const select_items = `SELECT basket_item.*,product.author,product.name,product.price FROM basket_item INNER JOIN product ON basket_item.product_id=product.id WHERE basket_id="${req.params.basketID}"`
        const items = await query(select_items)
        const receipt = {
            head: {
                id: details[0].user_id,
                name: details[0].name,
                surname: details[0].surname,
                street: details[0].street,
                city: details[0].city,

            },
            table: items,
            paid: details[0].total_price,
            shipping: details[0].shipping_date,
            invoice_nr: details[0].id,
            card: details[0].credit_card_number
        };

        createReceipt(receipt, 'receipt.pdf')
        setTimeout(() => {
            res.download('C:/Users/igorf/OneDrive/Desktop/My projects/MySTORE/server/receipt.pdf')
        }, 200);
    } catch (err) {
        console.log(err)
    }
})

//////////////////////A D M I N////////////////////////////////////////////////////////////////////////////////////
const staffOnly = (req, res, next) => {
    jwt.verify(req.headers['authorization'], "pizdec", (err, payload) => {
        if (err) return res.status(400).json("Token not valid")
        if (payload[0].role !== 'admin')
            return res.status(403).json("You can not make any changes to this")
        res.status(200)
        req.user = payload
        console.log("Staff Only ok")
        next()
    })

}
router.post('/post', vt, staffOnly, async (req, res) => {
    try {
        const insert_q = `INSERT INTO product (author,name,price,image,description,category_id)
VALUES("${req.body.author}","${req.body.name}","${req.body.price}","${req.body.image}","${req.body.description}","${req.body.categoryID}")`
        const new_product = await query(insert_q)
        res.status(200).json({ err: false, new_product })
    } catch (err) {
        res.status(500).json({ err: true, err })
    }

})
router.get('/selectforediting/:id', vt, staffOnly, async (req, res) => {
    try {
        const q = `SELECT * FROM product WHERE id="${req.params.id}"`
        const selected_product = await query(q)
        res.status(200).json({ err: false, selected_product })
    } catch (err) {
        res.status(500).json({ err: true, err })
    }

})
router.put('/edit/admin/:id', vt, staffOnly, async (req, res) => {

    let { image, author, name, price, description } = req.body
    try {
        const update_query = `UPDATE product SET image = "${image}",author="${author}", name = "${name}", price = "${price}",description="${description}"
                    WHERE id = "${req.params.id}"`
        const select_query = `SELECT * FROM product WHERE id = "${req.params.id}"`
        await query(update_query)
        const updatedProduct = await query(select_query)
        res.status(201).json({ err: false, updatedProduct })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: true, msg: err })
    }
});

module.exports = router   