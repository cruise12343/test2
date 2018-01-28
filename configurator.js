'use strict';
var config = require('config');
var _ = require('lodash');

module.exports = function() {
	var _config = {};

	// mandatory data
	if(!config.has('binance.key') || !config.has('binance.secret') || !config.has('symbols') || !config.has('default')) {
		return null;
	} else {
		_config.binance = config.get('binance');
		_config.binance.key = process.env.key;
		_config.binance.secret = process.env.secret;
	}

	var _symbols = config.get('symbols');
	var _default = config.get('default');

	// need at least 1 symbol for trading
	if(!Array.isArray(_symbols) || _symbols.length == 0) {
		return null;
	} else {
		_config.symbols = _symbols;
	}

	_.each(_symbols, (symbol) => {
		_config[symbol] = {};
		if(config.has(symbol)) _config[symbol] = config.get(symbol);
		
		_.defaultsDeep(_config[symbol], _.cloneDeep(_default));
		_config[symbol].bag.order = null;
		_config[symbol].bag.position = null;
	});

	return _.cloneDeep(_config);
}