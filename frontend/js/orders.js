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

async function loadOrders() {
    try {
        const orders = await api.get('/orders');
        displayOrders(orders);
    } catch (error) {
        document.getElementById('orders-list').innerHTML = 
            '<p class="error">Error loading orders: ' + error.message + '</p>';
    }
}

function displayOrders(orders) {
    const container = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        container.innerHTML = '<p>No orders found.</p>';
        return;
    }
    
    const table = `
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total (₹)</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.customer_name}</td>
                        <td>${order.customer_phone}</td>
                        <td>${order.product_name}</td>
                        <td>${order.quantity}</td>
                        <td>₹${order.total_amount}</td>
                        <td><span class="status ${order.status}">${order.status}</span></td>
                        <td>${new Date(order.created_at).toLocaleDateString()}</td>
                        <td class="actions">
                            <select onchange="updateOrderStatus(${order.id}, this.value)">
                                <option value="">Change Status</option>
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                            <button class="delete" onclick="cancelOrder(${order.id})">Cancel</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = table;
}
