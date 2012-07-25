import threading
import couchdb
import time
import random

dbname = 'http://10.155.59.15:5984'
class ReadoutThread(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self)
        self.kill = False
        self.couch = couchdb.Server()
        self.db = couch ['ping']
        self.set_value(1)
        self.set_spread(1)

    def run(self):
        i = 0
        while (not self.kill):
            self.readout(self.db, i, self.value + self.spread*(random.random()-0.5))
            i += 1
            time.sleep(1)

    def readout(self,db, x, y):
        adoc = {} 
        adoc['value'] = y
        adoc['time'] = x
        adoc['type'] = 'readout'
        db.save(adoc)
        print "Saving: ", adoc, "to db"

    def save_settings_doc(self, name, value):
        adoc = {} 
        if name in db: adoc = db[name] 
        adoc['value'] = value
        adoc['name'] = name
        adoc['type'] = 'settings'
        self.db[name] = adoc

    def set_value(self, val):
        self.value = float(val)
        self.save_settings_doc('value',self.value)

    def set_spread(self, aspr):
        self.spread = float(aspr)
        self.save_settings_doc('spread',self.spread)

    def kill_thread(self): 
        self.kill = True

def save_db_access_doc(db, dbname):
    adoc = {}
    if 'host' in db: adoc = db['host']
    adoc['host'] = dbname
    db['host'] = adoc
    

couch = couchdb.Server(dbname)
db = couch ['ping']
changesfeed = db.changes(filter='Ping/ping')
for docname in changesfeed['results']:
	doc = db[docname['id']]
        db.delete(doc)

save_db_access_doc(db, dbname.replace('http://', '').split(':')[0])

changesfeed = db.changes(feed='continuous', heartbeat='1000', include_docs=True,filter='Ping/ping')

readout_thread = ReadoutThread()
readout_thread.start()

for line in changesfeed:
	doc = line['doc']
	# process doc here
        try:
		if(doc['type'] == 'command'): 
		    cmd = doc['cmd'] 
                    args = doc['args']
                    try:
                        if len(args) > 0: getattr(readout_thread, cmd)(*args)
                        else: getattr(readout_thread, cmd)()
                    except AttributeError:
                        print doc, "Unrecognized"
                        pass
                    if cmd == 'kill_thread': break 
        except KeyError: pass
	try:
		if(doc['answer'] != 'pong'):
			doc['answer'] ='pong'
			db.save(doc)
		else:
			pass
	
	except KeyError:
		doc['answer'] = 'pong'
		db.save(doc)

readout_thread.join()
changesfeed = db.changes(filter='Ping/ping')
del_list = [db[docname['id']] for docname in changesfeed['results']]
map(lambda x: x.__setitem__('_deleted', True), del_list) 
db.update(del_list)


