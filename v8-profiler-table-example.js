var p = require('./v8-profiler-table.js')
p.record_profile('a', function() {
	for (var i = 1; i < 1000000; ++i) Math.sqrt(i);
}, true); // Set the base comparision

p.record_profile('b', function() {
	for (var i = 1; i < 100000; ++i) Math.sqrt(i);
});

p.record_profile('c', function() {
	for (var i = 1; i < 100; ++i) Math.sqrt(i);
});

console.log(p.stringify());
