import couchdb

couch = couchdb.Server()
db = couch ['ping']
changesfeed = db.changes(filter='Ping/ping')
for docname in changesfeed['results']:
	doc = db[docname['id']]
        db.delete(doc)

changesfeed = db.changes(feed='continuous', heartbeat='1000', include_docs=True,filter='Ping/ping')

for line in changesfeed:
	print line['changes']
	doc = line['doc']
	# process doc here
	try:
		if(doc['answer'] != 'pong'):
			doc['answer'] ='pong'
			db.save(doc)
		else:
			pass
	
	except KeyError:
		doc['answer'] = 'pong'
		db.save(doc)

