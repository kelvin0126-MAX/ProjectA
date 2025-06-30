let editingProductId = null;

// Product form handling
document.getElementById('product-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock_quantity: parseInt(document.getElementById('product-stock').value),
        description: document.getElementById('product-description').value
    }
    };
    
    try {
        if (editingProductId) {
            await api.put(`/products/${editingProductId}`, formData);
            showMessage('Product updated successfully!');
            resetProductForm();
        } else {
            await api.post('/products', formData);
            showMessage('Product added successfully!');
        }
    }