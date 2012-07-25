function(doc) {
	if (doc.answer == 'pong' && doc.created_at) {
		emit(doc.created_at,doc);
	}
}
