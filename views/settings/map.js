function(doc) {
  if (!doc.type || doc.type != 'settings') return;
  emit(doc.name, doc.value);
};
