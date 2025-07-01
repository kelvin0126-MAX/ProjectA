// routes/orders.js
const express = require('express');
const { db } = require('../database');
const router = express.Router();

// CREATE new order
router.post('/', (req, res) => {
    const { customer_name, customer_phone, product_id, quantity } = req.body;
    
    if (!customer_name || !customer_phone || !product_id || !quantity) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }}
);