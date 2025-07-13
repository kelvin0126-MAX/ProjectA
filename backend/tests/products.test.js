const request = require('supertest');
const app = require('../server');

describe('Products CRUD Tests', () => {
    let productId;

    // Clean up function
    afterAll(async () => {
        // Give time for any pending operations
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    test('CREATE: Should create a new product', async () => {
        const productData = {
            name: 'Test Kerala Chips',
            category: 'Snacks',
            price: 150.00,
            stock_quantity: 25,
            description: 'Test description for chips'
        };

        const response = await request(app)
            .post('/api/products')
            .send(productData)
            .expect(200);

        expect(response.body).toHaveProperty('id');
        expect(response.body.message).toBe('Product created successfully');
        productId = response.body.id;
    });

    test('READ: Should get all products', async () => {
        const response = await request(app)
            .get('/api/products')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('READ: Should get specific product', async () => {
        const response = await request(app)
            .get(`/api/products/${productId}`)
            .expect(200);

        expect(response.body).toHaveProperty('id', productId);
        expect(response.body.name).toBe('Test Kerala Chips');
    });

    test('UPDATE: Should update product', async () => {
        const updateData = {
            name: 'Updated Kerala Chips',
            category: 'Snacks',
            price: 200.00,
            stock_quantity: 30,
            description: 'Updated description'
        };

        const response = await request(app)
            .put(`/api/products/${productId}`)
            .send(updateData)
            .expect(200);

        expect(response.body.message).toBe('Product updated successfully');

        // Verify the update
        const getResponse = await request(app)
            .get(`/api/products/${productId}`)
            .expect(200);

        expect(getResponse.body.name).toBe('Updated Kerala Chips');
        expect(getResponse.body.price).toBe(200);
    });

    test('DELETE: Should delete product', async () => {
        const response = await request(app)
            .delete(`/api/products/${productId}`)
            .expect(200);

        expect(response.body.message).toBe('Product deleted successfully');

        // Verify deletion
        await request(app)
            .get(`/api/products/${productId}`)
            .expect(404);
    });

    test('Error handling: Should fail with missing fields', async () => {
        const incompleteData = {
            name: 'Test Product'
            // Missing required fields
        };

        const response = await request(app)
            .post('/api/products')
            .send(incompleteData)
            .expect(400);

        expect(response.body.error).toBe('Missing required fields');
    });
});