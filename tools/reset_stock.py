import json, os
p='c:/Users/Bullettemporary/Desktop/gsm-clone/products.json'
with open(p,'r',encoding='utf-8') as f:
    products=json.load(f)
stock={}
for pr in products:
    stock[str(pr['id'])]=int(pr.get('stock',0))
out=os.path.join(os.path.dirname(__file__),'..','data','products_stock.json')
with open(out,'w',encoding='utf-8') as f:
    json.dump(stock,f,indent=2)
print('wrote', out)
