var path   = require('path');
var mocha  = require('mocha');
var chai   = require('chai');
var should = chai.should();
var p      = require('../v8-profiler-table')

var calc_sqrt = function(max) {
	for (var i = 1; i < max; ++i) Math.sqrt(i);
};

describe('V8-Profiler Table', function() {
	it('Assigns profile_base', function() {
		// No profile_base yet ...
		should.not.exist(p.profile_base());
		
		// Set a profile_base
		p.record_profile('test', function() { calc_sqrt(1000*1000); });
		
		// Now there is a base profile
		should.exist(p.profile_base());
		p.profile_base().title.should.equal('test');
		
		// Clears profile_base
		p.reset_profiles();
		should.not.exist(p.profile_base());
	});

	it('Re-Assigns profile_base', function() {
		// No profile_base yet ...
		p.reset_profiles();
		should.not.exist(p.profile_base());
		
		// Set a profile_base
		p.record_profile('test 1', function() { calc_sqrt(1000*1000); });
		p.record_profile('test 2', function() { calc_sqrt(1000*1000); }, true);
		
		// Now there is a base profile
		should.exist(p.profile_base());
		p.profile_base().title.should.equal('test 2');
	});

	it('Repeats calback', function() {
		var i = 0;
		var c = function() { return (++i).toString(); };
		
		var wrapper = p.repeats_callback_wrapper(10, c);
		wrapper().should.equal("10");
		i.should.equal(10);
	});
});
// 
// 
// var p = require('./v8-profiler-table.js')
// p.record_profile('a', function() {
// 	for (var i = 1; i < 1000000; ++i) Math.sqrt(i);
// }, true); // Set the base comparision
// 
// p.record_profile('b', function() {
// 	for (var i = 1; i < 100000; ++i) Math.sqrt(i);
// });
// 
// p.record_profile('c', function() {
// 	for (var i = 1; i < 100; ++i) Math.sqrt(i);
// });
// 
// console.log(p.stringify());
// 
// 
// // Expected Table output:
// // Name, Total Seconds, X-Times As Fast as Base
// // [Base] a, 0.009, 1
// // b (Base), 0.003, 3
// // c (Base), 0.002, 4.5