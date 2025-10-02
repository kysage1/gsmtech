from flask import Flask, request, jsonify, send_from_directory
import json
import os

app = Flask(__name__, static_folder='..')
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(DATA_DIR, exist_ok=True)

def save_json(filename, obj):
    path = os.path.join(DATA_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(obj, f, indent=2)

def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

@app.route('/api/checkout', methods=['POST'])
def api_checkout():
    data = request.get_json() or {}
    orders = load_json('orders.json')
    products = load_json('products.json')
    # simple stock map stored separately
    stock = load_json('products_stock.json') or {str(p['id']): p.get('stock', 0) for p in products}
    order_id = int(request.headers.get('X-Mock-Order', '0')) or (int(__import__('time').time()*1000))
    # decrement stock if available
    items = data.get('items', [])
    insufficient = []
    for it in items:
        pid = str(it.get('id'))
        qty = int(it.get('qty', 1))
        avail = int(stock.get(pid, 0))
        if avail < qty:
            insufficient.append({'id': pid, 'available': avail})
        else:
            stock[pid] = avail - qty

    if insufficient:
        return jsonify({'ok': False, 'error': 'insufficient_stock', 'details': insufficient}), 400

    save_json('products_stock.json', stock)

    order = {'order_id': order_id, 'data': data}
    orders.append(order)
    save_json('orders.json', orders)

    # optionally simulate payment and invoice creation
    if data.get('simulate_payment'):
        tx = {'tx_id': f"TX{order_id}", 'amount': sum((it.get('price') or 0) * int(it.get('qty',1)) for it in items)}
        invoices = load_json('invoices.json')
        inv = {'invoice_id': f"INV{order_id}", 'order_id': order_id, 'tx': tx, 'items': items}
        invoices.append(inv)
        save_json('invoices.json', invoices)
        return jsonify({'ok': True, 'order_id': order_id, 'invoice': inv})

    return jsonify({'ok': True, 'order_id': order_id})

@app.route('/api/signup', methods=['POST'])
def api_signup():
    data = request.get_json() or {}
    users = load_json('users.json')
    # naive: store email+password (demo only)
    users.append({'email': data.get('email'), 'password': data.get('password')})
    save_json('users.json', users)
    return jsonify({'ok': True})

@app.route('/<path:filename>')
def files(filename):
    # serve the static prototype files from parent folder
    root = os.path.join(os.path.dirname(__file__), '..')
    return send_from_directory(root, filename)

@app.route('/')
def index():
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'info'), 'checkout.html')

if __name__ == '__main__':
    app.run(port=5001, debug=True)
