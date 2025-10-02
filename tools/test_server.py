import socket, requests, json, os

print('Checking port 5001...')
s=socket.socket()
try:
    s.connect(('127.0.0.1',5001))
    print('port 5001 open')
except Exception as e:
    print('port 5001 closed',e)
finally:
    s.close()

print('Posting test order...')
try:
    r=requests.post('http://127.0.0.1:5001/api/checkout', json={'test':'order-from-test','items':[{'id':894337,'qty':1}]}, timeout=5)
    print('POST status', r.status_code)
    print('POST response:', r.text[:400])
except Exception as e:
    print('POST failed', e)

orders_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'orders.json')
print('orders_path=', orders_path)
if os.path.exists(orders_path):
    try:
        with open(orders_path,'r',encoding='utf-8') as f:
            data=json.load(f)
        print('orders file exists, total orders=', len(data))
        print('last order sample=', data[-1])
    except Exception as e:
        print('Failed reading orders file', e)
else:
    print('orders file not found')
