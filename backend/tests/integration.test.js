const request = require('supertest');
const app = require('../server');

describe('Frontend-Backend Integration Test', () => {
    
    afterAll(async () => {
        // Give time for any pending operations
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    test('Complete workflow: Product → Order → Status Update', async () => {
        console.log('🧪 Starting Integration Test...');
        
        // Step 1: Create a product (simulating frontend form submission)
        const productData = {
            name: 'Integration Test Coconut Oil',
            category: 'Cooking Oil',
            price: 250.00,
            stock_quantity: 20,
            description: 'Premium coconut oil for testing'
        };

        const productResponse = await request(app)
            .post('/api/products')
            .send(productData)
            .expect(200);

        const productId = productResponse.body.id;
        console.log('✓ Product created successfully');

        // Step 2: Verify product appears in product list (simulating frontend refresh)
        const productsResponse = await request(app)
            .get('/api/products')
            .expect(200);

        const createdProduct = productsResponse.body.find(p => p.id === productId);
        expect(createdProduct).toBeTruthy();
        expect(createdProduct.stock_quantity).toBe(20);
        console.log('✓ Product appears in list with correct stock');

        // Step 3: Create order (simulating customer order through frontend)
        const orderData = {
            customer_name: 'Integration Test Customer',
            customer_phone: '1234567890',
            product_id: productId,
            quantity: 5
        };

        const orderResponse = await request(app)
            .post('/api/orders')
            .send(orderData)
            .expect(200);

        const orderId = orderResponse.body.id;
        console.log('✓ Order created successfully');

        // Step 4: Verify stock was reduced (backend business logic)
        const updatedProductResponse = await request(app)
            .get(`/api/products/${productId}`)
            .expect(200);

        expect(updatedProductResponse.body.stock_quantity).toBe(15); // 20 - 5
        console.log('✓ Stock automatically reduced');

        // Step 5: Update order status (simulating admin status change)
        await request(app)
            .put(`/api/orders/${orderId}`)
            .send({ status: 'confirmed' })
            .expect(200);

        console.log('✓ Order status updated');

        // Step 6: Verify order appears in orders list (simulating frontend display)
        const ordersResponse = await request(app)
            .get('/api/orders')
            .expect(200);

        const createdOrder = ordersResponse.body.find(o => o.id === orderId);
        expect(createdOrder).toBeTruthy();
        expect(createdOrder.customer_name).toBe('Integration Test Customer');
        expect(createdOrder.status).toBe('confirmed');
        expect(createdOrder.total_amount).toBe(1250.00); // 250 * 5
        console.log('✓ Order appears correctly with calculated total');

        // Step 7: Test order lifecycle
        await request(app)
            .put(`/api/orders/${orderId}`)
            .send({ status: 'shipped' })
            .expect(200);

        await request(app)
            .put(`/api/orders/${orderId}`)
            .send({ status: 'delivered' })
            .expect(200);

        console.log('✓ Order lifecycle completed');

        // Step 8: Clean up
        await request(app).delete(`/api/orders/${orderId}`);
        await request(app).delete(`/api/products/${productId}`);
        console.log('✓ Integration test completed successfully');
    });

    test('Error handling workflow', async () => {
        console.log('🧪 Testing error handling...');
        
        // Test insufficient stock
        const productData = {
            name: 'Low Stock Product',
            category: 'Test',
            price: 100.00,
            stock_quantity: 2,
            description: 'Product with low stock'
        };

        const productResponse = await request(app)
            .post('/api/products')
            .send(productData)
            .expect(200);

        const productId = productResponse.body.id;

        // Try to order more than available stock
        const orderData = {
            customer_name: 'Test Customer',
            customer_phone: '1234567890',
            product_id: productId,
            quantity: 5 // More than available stock (2)
        };

        const orderResponse = await request(app)
            .post('/api/orders')
            .send(orderData)
            .expect(400);

        expect(orderResponse.body.error).toBe('Insufficient stock');
        console.log('✓ Insufficient stock error handled correctly');

        // Clean up
        await request(app).delete(`/api/products/${productId}`);
        console.log('✓ Error handling test completed');
    });
});