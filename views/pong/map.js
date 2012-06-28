function(doc) {
	if (doc.answer == 'pong') {
	emit(doc.created_at,doc);
	}
}