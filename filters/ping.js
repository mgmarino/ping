function(doc, req) {
  if(doc._deleted == true) {
	return false;
	}
  
  if(doc._id == '_design/Ping') {
	return false;
	}
	
  return true 
}