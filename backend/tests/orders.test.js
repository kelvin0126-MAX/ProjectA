const request = require('supertest');
const app = require('../server');

describe('Orders CRUD Tests', () => {
    let productId;
    let orderId;

    beforeAll(async () => {
        // Create a test product first
        const productData = {
            name: 'Test Product for Orders',
            category: 'Test',
            price: 100.00,
            stock_quantity: 50,
            description: 'Test product for order testing'
        };

        const response = await request(app)
            .post('/api/products')
            .send(productData);

        productId = response.body.id;
    });

    afterAll(async () => {
        // Clean up test product if it still exists
        try {
            await request(app).delete(`/api/products/${productId}`);
        } catch (error) {
            // Product might already be deleted, that's okay
        }
        
        // Give time for any pending operations
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    test('CREATE: Should create a new order', async () => {
        const orderData = {
            customer_name: 'Test Customer',
            customer_phone: '9876543210',
            product_id: productId,
            quantity: 2
        };

        const response = await request(app)
            .post('/api/orders')
            .send(orderData)
            .expect(200);

        expect(response.body).toHaveProperty('id');
        expect(response.body.message).toBe('Order created successfully');
        orderId = response.body.id;
    });

    test('READ: Should get all orders', async () => {
        const response = await request(app)
            .get('/api/orders')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('READ: Should get specific order', async () => {
        const response = await request(app)
            .get(`/api/orders/${orderId}`)
            .expect(200);

        expect(response.body).toHaveProperty('id', orderId);
        expect(response.body.customer_name).toBe('Test Customer');
        expect(response.body).toHaveProperty('product_name');
    });

    test('UPDATE: Should update order status', async () => {
        const response = await request(app)
            .put(`/api/orders/${orderId}`)
            .send({ status: 'confirmed' })
            .expect(200);

        expect(response.body.message).toBe('Order status updated successfully');

        // Verify the update
        const getResponse = await request(app)
            .get(`/api/orders/${orderId}`)
            .expect(200);

        expect(getResponse.body.status).toBe('confirmed');
    });

    test('DELETE: Should cancel order', async () => {
        const response = await request(app)
            .delete(`/api/orders/${orderId}`)
            .expect(200);

        expect(response.body.message).toBe('Order cancelled successfully');

        // Verify deletion
        await request(app)
            .get(`/api/orders/${orderId}`)
            .expect(404);
    });

    test('Error handling: Should fail with missing fields', async () => {
        const incompleteData = {
            customer_name: 'Test Customer'
            // Missing required fields
        };

        const response = await request(app)
            .post('/api/orders')
            .send(incompleteData)
            .expect(400);

        expect(response.body.error).toBe('Missing required fields');
    });

    test('Error handling: Should fail with non-existent product', async () => {
        const orderData = {
            customer_name: 'Test Customer',
            customer_phone: '9876543210',
            product_id: 99999,
            quantity: 1
        };

        const response = await request(app)
            .post('/api/orders')
            .send(orderData)
            .expect(404);

        expect(response.body.error).toBe('Product not found');
    });
});