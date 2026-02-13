import pytest
import json
from app import app
from models import orders, menu_items

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_menu(client):
    """Test menu retrieval"""
    response = client.get('/api/menu')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) > 0
    assert 'name' in data[0]
    assert 'price' in data[0]

def test_create_order_valid(client):
    """Test order creation with valid data"""
    order_data = {
        'customer_name': 'John Doe',
        'customer_address': '123 Main St',
        'customer_phone': '555-123-4567',
        'items': [
            {'id': '1', 'name': 'Pizza', 'price': 12.99, 'quantity': 2}
        ]
    }
    response = client.post('/api/orders', 
                          data=json.dumps(order_data),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['customer_name'] == 'John Doe'
    assert data['total_amount'] == 25.98

def test_create_order_invalid_phone(client):
    """Test order creation with invalid phone number"""
    order_data = {
        'customer_name': 'John Doe',
        'customer_address': '123 Main St',
        'customer_phone': 'invalid_phone',
        'items': [{'id': '1', 'name': 'Pizza', 'price': 12.99, 'quantity': 1}]
    }
    response = client.post('/api/orders', 
                          data=json.dumps(order_data),
                          content_type='application/json')
    assert response.status_code == 400

def test_create_order_empty_cart(client):
    """Test order creation with empty cart"""
    order_data = {
        'customer_name': 'John Doe',
        'customer_address': '123 Main St',
        'customer_phone': '555-123-4567',
        'items': []
    }
    response = client.post('/api/orders', 
                          data=json.dumps(order_data),
                          content_type='application/json')
    assert response.status_code == 400

def test_update_order_status(client):
    """Test order status update"""
    # First create an order
    order_data = {
        'customer_name': 'Jane Doe',
        'customer_address': '456 Oak St',
        'customer_phone': '555-987-6543',
        'items': [{'id': '2', 'name': 'Burger', 'price': 10.99, 'quantity': 1}]
    }
    create_response = client.post('/api/orders', 
                                 data=json.dumps(order_data),
                                 content_type='application/json')
    order_id = json.loads(create_response.data)['id']
    
    # Update status
    update_data = {'status': 'Preparing'}
    update_response = client.put(f'/api/orders/{order_id}',
                                data=json.dumps(update_data),
                                content_type='application/json')
    assert update_response.status_code == 200
    data = json.loads(update_response.data)
    assert data['status'] == 'Preparing'

def test_invalid_order_status(client):
    """Test invalid status update"""
    # Create order
    order_data = {
        'customer_name': 'Bob Smith',
        'customer_address': '789 Pine St',
        'customer_phone': '555-111-2222',
        'items': [{'id': '3', 'name': 'Salad', 'price': 8.99, 'quantity': 1}]
    }
    create_response = client.post('/api/orders', 
                                 data=json.dumps(order_data),
                                 content_type='application/json')
    order_id = json.loads(create_response.data)['id']
    
    # Try invalid status
    update_data = {'status': 'Invalid Status'}
    update_response = client.put(f'/api/orders/{order_id}',
                                data=json.dumps(update_data),
                                content_type='application/json')
    assert update_response.status_code == 400

def test_get_nonexistent_order(client):
    """Test retrieving non-existent order"""
    response = client.get('/api/orders/nonexistent123')
    assert response.status_code == 404

if __name__ == '__main__':
    pytest.main(['-v'])