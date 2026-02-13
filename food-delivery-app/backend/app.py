from flask import Flask, request, jsonify
from flask_cors import CORS
from models import menu_items, orders, Order
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "OK",
        "message": "Food Delivery Backend is running 🚀"
    })

# Menu endpoints
@app.route('/api/menu', methods=['GET'])
def get_menu():
    """Retrieve all menu items"""
    return jsonify([item.to_dict() for item in menu_items])

@app.route('/api/menu/<item_id>', methods=['GET'])
def get_menu_item(item_id):
    """Retrieve a specific menu item"""
    item = next((item for item in menu_items if item.id == item_id), None)
    if item:
        return jsonify(item.to_dict())
    return jsonify({'error': 'Item not found'}), 404

# Order endpoints
@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Retrieve all orders"""
    return jsonify([order.to_dict() for order in orders.values()])

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    """Retrieve a specific order"""
    order = orders.get(order_id)
    if order:
        return jsonify(order.to_dict())
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create a new order"""
    data = request.json
    
    # Input validation
    if not all(k in data for k in ['customer_name', 'customer_address', 'customer_phone', 'items']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if not data['items'] or len(data['items']) == 0:
        return jsonify({'error': 'Order must contain at least one item'}), 400
    
    # Validate phone number format (simple validation)
    if not data['customer_phone'].replace(' ', '').replace('-', '').isdigit():
        return jsonify({'error': 'Invalid phone number format'}), 400
    
    # Create order
    order = Order(
        data['customer_name'],
        data['customer_address'],
        data['customer_phone'],
        data['items']
    )
    orders[order.id] = order
    
    return jsonify(order.to_dict()), 201

@app.route('/api/orders/<order_id>', methods=['PUT'])
def update_order_status(order_id):
    """Update order status"""
    order = orders.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    data = request.json
    if 'status' not in data:
        return jsonify({'error': 'Status field required'}), 400
    
    if order.update_status(data['status']):
        return jsonify(order.to_dict())
    return jsonify({'error': 'Invalid status'}), 400

@app.route('/api/orders/<order_id>/status-stream')
def status_stream(order_id):
    """SSE endpoint for real-time status updates"""
    def generate():
        order = orders.get(order_id)
        if not order:
            yield f"data: {jsonify({'error': 'Order not found'})}\n\n"
            return
        
        last_status = None
        while True:
            if order.status != last_status:
                last_status = order.status
                yield f"data: {json.dumps({'status': order.status, 'order_id': order_id})}\n\n"
            time.sleep(2)  # Check for updates every 2 seconds
    
    return app.response_class(
        generate(),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no'
        }
    )

# Simulate order status progression (for testing)
@app.route('/api/orders/<order_id>/simulate', methods=['POST'])
def simulate_order_progress(order_id):
    """Simulate order status progression"""
    order = orders.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    statuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered']
    current_index = statuses.index(order.status) if order.status in statuses else -1
    
    if current_index < len(statuses) - 1:
        order.update_status(statuses[current_index + 1])
        return jsonify(order.to_dict())
    
    return jsonify({'error': 'Order already delivered'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)