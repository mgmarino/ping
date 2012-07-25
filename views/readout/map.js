function(doc) {
  if (!doc.type || doc.type != 'readout') return;
  emit(doc.time, [doc.time, doc.value]);
};
