// routes/orders.js
const express = require('express');
const { db } = require('../database');
const router = express.Router();

// GET all orders with product details
router.get('/', (req, res) => {
    const query = `
        SELECT o.*, p.name as product_name, p.price as product_price
        FROM orders o
        JOIN products p ON o.product_id = p.id
        ORDER BY o.created_at DESC
    `;
    
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// GET single order
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT o.*, p.name as product_name, p.price as product_price
        FROM orders o
        JOIN products p ON o.product_id = p.id
        WHERE o.id = ?
    `;
    
    db.get(query, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.json(row);
    });
});

// CREATE new order
router.post('/', (req, res) => {
    const { customer_name, customer_phone, product_id, quantity } = req.body;
    
    if (!customer_name || !customer_phone || !product_id || !quantity) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }}
);

    // Get product price to calculate total
    db.get("SELECT price, stock_quantity FROM products WHERE id = ?", [product_id], (err, product) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        if (product.stock_quantity < quantity) {
            res.status(400).json({ error: 'Insufficient stock' });
            return;
        }

        const total_amount = product.price * quantity;

        db.run(
            "INSERT INTO orders (customer_name, customer_phone, product_id, quantity, total_amount) VALUES (?, ?, ?, ?, ?)",
            [customer_name, customer_phone, product_id, quantity, total_amount],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }