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

 async function editProduct(id) {
    try {
        const product = await api.get(`/products/${id}`);
        
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock_quantity;
        document.getElementById('product-description').value = product.description || '';
        
        document.getElementById('product-submit').textContent = 'Update Product';
        document.getElementById('cancel-edit').style.display = 'inline-block';
        
        editingProductId = id;
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView();
    } catch (error) {
        showMessage('Error loading product: ' + error.message, 'error');
    }
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await api.delete(`/products/${id}`);
            showMessage('Product deleted successfully!');
            loadProducts();
            loadProductOptions();
            loadDashboard();
        } catch (error) {
            showMessage('Error deleting product: ' + error.message, 'error');
        }
    }
}

function resetProductForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-submit').textContent = 'Add Product';
    document.getElementById('cancel-edit').style.display = 'none';
    editingProductId = null;
}

  // selecting the product to order
async function loadProductOptions() {
    try {
        const products = await api.get('/products');
        const select = document.getElementById('order-product');
        
        select.innerHTML = '<option value="">Select Product</option>';
        
        products.forEach(product => {
            if (product.stock_quantity > 0) {
                select.innerHTML += `<option value="${product.id}">${product.name} (₹${product.price} - Stock: ${product.stock_quantity})</option>`;
            }
        });
    } catch (error) {
        console.error('Error loading product options:', error);
    }
}



    