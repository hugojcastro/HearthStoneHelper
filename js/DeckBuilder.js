/*
 * This file is part of HearthStoneHelper.
 *
 * HearthStoneHelper is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * HearthStoneHelper is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with HearthStoneHelper.  If not, see <http://www.gnu.org/licenses/>.
 */
 $WH.calc.deckbuilder = new function () {
	var deckConfig = {
		version: 3,
		types: {
			HERO: 3,
			MINION: 4,
			SPELL: 5,
			WEAPON: 7,
			HEROPOWER: 10
		},
		data: {
			raw: {},
			usable: {},
			usableCount: 0
		}
	};
	var deckContent = {
		arena: 0,
		classs: 0,
		cards: []
	};
	var af = $.extend(true, {}, deckContent);
	var templates = {
		1: {
			version: 1,
			build: "getCurrent",
			decodingPostProcess: "decodingPostProcess",
			data: [{
				calculatorValue: "getHashVersion",
				buildKey: "version"
			}, {
				key: "classs"
			}, {
				collectionKey: "cards",
				processTemplate: {
					data: [{
						key: "count"
					}, {
						keyLong: "id"
					}]
				}
			}]
		},
		2: {
			version: 2,
			build: "getCurrent",
			decodingPostProcess: "decodingPostProcess",
			increaseDelimiters: 1,
			data: [{
				calculatorValue: "getHashVersion",
				buildKey: "version"
			}, {
				collectionKey: "cards",
				delimiter: 2,
				processTemplate: {
					data: [{
						key: "count"
					}, {
						keyLong: "id"
					}]
				}
			}, {
				delimiter: true
			}, {
				key: "classs"
			}]
		},
		3: {
			version: 3,
			build: "getCurrent",
			decodingPostProcess: "decodingPostProcess",
			increaseDelimiters: 1,
			data: [{
				calculatorValue: "getHashVersion",
				buildKey: "version"
			}, {
				collectionKey: "cards",
				delimiter: 2,
				processTemplate: {
					data: [{
						key: "count"
					}, {
						keyLong: "id"
					}]
				}
			}, {
				delimiter: true
			}, {
				key: "classs"
			}, {
				key: "arena"
			}]
		}
	};

	this.init = function () {
		deckConfig.data.raw = g_hearthstone_cards;
		deckConfig.data.usable = usableCards(deckConfig.data.raw);
		$WH.calc.init({
			calculator: this,
			hashTemplates: templates
		})
	};

	this.getHashVersion = function () {  return deckConfig.version; };

	this.decodingPostProcess = function (base) { return $.extend(true, {}, deckContent, base); };

	function filter(base, description, criteria, dontmatch) {
		var result = {};
		for (var entry in base) {
			if (dontmatch) {
				if (base[entry][description] != criteria) {
					result[entry] = base[entry];
				}
			} else {
				if (base[entry][description] == criteria) {
					result[entry] = base[entry];
				}
			}
		}
		return result;
	}

	function usableCards(cardDB) {
		var selectedCards = $.extend({}, cardDB);
		selectedCards = filter(selectedCards, "collectible", 1);
		selectedCards = filter(selectedCards, "type", deckConfig.types.HERO, true);
		selectedCards = filter(selectedCards, "type", deckConfig.types.HEROPOWER, true);
		return selectedCards;
	}

};