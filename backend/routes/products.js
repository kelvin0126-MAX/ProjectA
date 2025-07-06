// routes/products.js
const express = require('express');
const { db } = require('../database');
const router = express.Router();

// GET all products
router.get('/', (req, res) => {
    db.all("SELECT * FROM products ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});



// GET single product
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(row);
    });
});

  // CREATE new product
router.post('/', (req, res) => {
    const { name, category, price, stock_quantity, description } = req.body;
    
    if (!name || !category || !price || !stock_quantity) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    db.run(
        "INSERT INTO products (name, category, price, stock_quantity, description) VALUES (?, ?, ?, ?, ?)",
        [name, category, price, stock_quantity, description],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Product created successfully' });
        }
    );
});

// UPDATE product
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, price, stock_quantity, description } = req.body;
    

    db.run(
        "UPDATE products SET name = ?, category = ?, price = ?, stock_quantity = ?, description = ? WHERE id = ?",
        [name, category, price, stock_quantity, description, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.json({ message: 'Product updated successfully' });
        }
    );
});

// DELETE product
router.delete('/:id', (req, res) => {{}
    const { id } = req.params;

    db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.change === 0) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json({ message: 'Product deleted successfully' });
    });
});
}
module.exports = router