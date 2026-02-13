from datetime import datetime
import uuid

class MenuItem:
    def __init__(self, id, name, description, price, image_url):
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.image_url = image_url
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image_url': self.image_url
        }

class Order:
    def __init__(self, customer_name, customer_address, customer_phone, items):
        self.id = str(uuid.uuid4())[:8]
        self.customer_name = customer_name
        self.customer_address = customer_address
        self.customer_phone = customer_phone
        self.items = items
        self.total_amount = sum(item['price'] * item['quantity'] for item in items)
        self.status = 'Order Received'
        self.created_at = datetime.now().isoformat()
        self.updated_at = datetime.now().isoformat()
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'customer_address': self.customer_address,
            'customer_phone': self.customer_phone,
            'items': self.items,
            'total_amount': self.total_amount,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    def update_status(self, new_status):
        valid_statuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered']
        if new_status in valid_statuses:
            self.status = new_status
            self.updated_at = datetime.now().isoformat()
            return True
        return False

# In-memory database
menu_items = [
    MenuItem('1', 'Margherita Pizza', 'Classic tomato sauce, mozzarella, basil', 12.99, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500'),
    MenuItem('2', 'Pepperoni Pizza', 'Tomato sauce, mozzarella, pepperoni', 14.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500'),
    MenuItem('3', 'Classic Burger', 'Beef patty, lettuce, tomato, cheese', 10.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'),
    MenuItem('4', 'Chicken Burger', 'Grilled chicken, lettuce, mayo', 11.99, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500'),
    MenuItem('5', 'Caesar Salad', 'Romaine lettuce, croutons, parmesan', 8.99, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500'),
    MenuItem('6', 'French Fries', 'Crispy golden fries with salt', 4.99, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500'),
    MenuItem('7', 'Coca Cola', 'Ice cold beverage', 2.99, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500'),
    MenuItem('8', 'Chocolate Cake', 'Rich chocolate layer cake', 6.99, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500')
]

orders = {}