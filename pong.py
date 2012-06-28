import couchdb

couch = couchdb.Server('http://pingpong.iriscouch.com')
db = couch ['ping']
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

