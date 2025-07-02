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
        
        document.getElementById('product-form').reset();
        loadProducts();
        loadProductOptions();
        
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

async function loadProducts() {
    try {
        const products = await api.get('/products');
        displayProducts(products);
    } catch (error) {
        document.getElementById('products-list').innerHTML = 
            '<p class="error">Error loading products: ' + error.message + '</p>';
    }
}

function displayProducts(products) {
    const container = document.getElementById('products-list');
    
    if (products.length === 0) {
        container.innerHTML = '<p>No products found.</p>';
        return;
    }
    
    
 const table = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price (₹)</th>
                    <th>Stock</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>₹${product.price}</td>
                        <td>${product.stock_quantity}</td>
                        <td>${product.description || 'N/A'}</td>
                        <td class="actions">
                            <button class="edit" onclick="editProduct(${product.id})">Edit</button>
                            <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = table;
                }
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


    