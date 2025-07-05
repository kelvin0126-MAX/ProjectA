// Order form handling
document.getElementById('order-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        customer_name: document.getElementById('customer-name').value,
        customer_phone: document.getElementById('customer-phone').value,
        product_id: parseInt(document.getElementById('order-product').value),
        quantity: parseInt(document.getElementById('order-quantity').value)
    };

 try {
        await api.post('/orders', formData);
        showMessage('Order created successfully!');
        document.getElementById('order-form').reset();
        loadOrders();
         } catch (error) {
        showMessage(error.message, 'error');
    }
});