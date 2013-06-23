var profiler = require('v8-profiler');
var profile_base = undefined;
var profiles = {};

module.exports = {};

module.exports.profiles = function() {
	return profiles;
};
module.exports.profile_base = function() {
	return profile_base;
};

module.exports.reset_profiles = function() {
	profile_base = undefined;
	profiles = [];
};

module.exports.repeats_callback = function(tag, num_loops, callback, is_base) {
	return function() {
		var last = undefined;
		for(var i = 0; i < num_loops; i++) {
			last = callback();
		}
		return last;
	};
};

module.exports.record_profile = function(tag, callback, is_base) {
	var prof = {
		title: tag,
		total_seconds: undefined,
		ratio_to_base: undefined,
	};
	profiles[tag] = prof;

	//begin cpu profiling
	profiler.startProfiling(tag);

	// Execute the callback
	var output = callback();

	//finish cpu profiling
	var cpuProfile = profiler.stopProfiling(tag);

	// Convert to whole seconds
	prof.total_seconds = cpuProfile.topRoot.totalTime / 1000;

	if (profile_base === undefined || is_base) {
		profile_base = prof;
	}

	if (profile_base) {
		Object.keys(profiles)
			.forEach(function(_tag) {
			var _base = profile_base;
			var _prof = profiles[_tag];
			_prof.ratio_to_base = Math.round((_base.total_seconds / _prof.total_seconds) * 100) / 100
		});
	}
};

module.exports.stringify = function() {
	var output = ['Name, Total Seconds, X-Times As Fast as Base'];

	if (profile_base !== undefined) {
		output.push(['[Base] ' + profile_base.title,
		profile_base.total_seconds,
		profile_base.ratio_to_base
		// ''
		].join(', '));
	}

	Object.keys(profiles)
		.forEach(function(_tag) {

		if (!profile_base || _tag !== profile_base.title) {
			var _prof = profiles[_tag];

			output.push([
			_prof.title + ' (Base)',
			_prof.total_seconds,
			_prof.ratio_to_base].join(', '));
		}
	});

	return output.join("\n");
};
