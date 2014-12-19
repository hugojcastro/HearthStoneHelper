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
// ///////////////// ///////////////// ///////////////// ///////////////
// Vars used in script
// Locale
var locale      = "eses";
// name for deck storage (cookie or localStorage)
var storageName = "HSHelperDecks";
// Array of decks
var jDecks      = [];
// Array of expansion names
var cardSet     = ["", "", "", "classic", "", "", "", "", "", "", "", "", "naxx", "gvg"];
// ///////////////// ///////////////// ///////////////// ///////////////

// ///////////////
// Debug function
function debugAlert(obj)
{
	var txt = "";
	for (var it in obj)
		txt += it + "=" + obj[it] + "; ";
	alert(txt);
}
// ///////////////


// ///////////////
// Aux stuff to copy arrays and objects
function fullCopy(stuff)
{
    var result = stuff, thing;

    if ((stuff) && (typeof(stuff) === 'object'))
	{
		result = Object.prototype.toString.call(stuff) === '[object Array]' ? [] : {};
		for (thing in stuff)
		{
			result[thing] = fullCopy(stuff[thing]);
		}
	}
 
	return result;
}
// ///////////////// ///////////////// ///////////////// ///////////////
// To fit long deck names
(function($)
{
	$.fn.fitname = function(options)
	{
		var settings = $.extend(
		{
			maxWidth  : 224,
			minWidth  : 224,
			maxFont   : 32,
			minFont   : 10,
			fontRatio : 16
		}, options),

		change = function(elem)
		{
			var $elem = $(elem);
			var elemWidth = $elem.width();
			var width = elemWidth > settings.maxWidth ? settings.maxWidth : elemWidth < settings.minWidth ? settings.minWidth : elemWidth;
			var fontBase = width / settings.fontRatio;
			var fontSize = fontBase > settings.maxFont ? settings.maxFont : fontBase < settings.minFont ? settings.minFont : fontBase;

			$elem.css('font-size', fontSize + 'px');
		};

		return this.each(function()
		{
			change(this);
		});
	};
}(jQuery));
// ///////////////// ///////////////// ///////////////// ///////////////
// To sort deck names
function sortDecks()
{
	jDecks.sort(
		function(elem1, elem2)
		{
			if (elem1.hero > elem2.hero) return 1;
			if (elem1.hero < elem2.hero) return -1;
			return 0;
		}
	);
}
// ///////////////// ///////////////// ///////////////// ///////////////
// Aux to get max. set card from a deck (i.e. classic, naxx, GvG...)
function getDeckSet(idx)
{
	var result = 'classic';
	if ((idx >= 0) && (idx < jDecks.length))
	{
		var maxExpFound = 0;
		txt = "";
		// check each card on deck for max value
		for (var aCard in jDecks[idx].cards)
		{
			if (g_hearthstone_cards[locale][jDecks[idx].cards[aCard].card].set > maxExpFound)
				maxExpFound = g_hearthstone_cards[locale][jDecks[idx].cards[aCard].card].set;
		}
		if ((typeof(cardSet[maxExpFound]) != "undefined") && (cardSet[maxExpFound] != ""))
			result = cardSet[maxExpFound];
	}
	return result;
}


// ///////////////// ///////////////// ///////////////// ///////////////
// Storage and Cookie stuff
// Store all decks into localStorage or cookie
function storeDecksOnStore()
{
	// Use localStorage before cookies
	if (typeof(localStorage) != "undefined")
	{
		// If no decks, clear storage
		if ((jDecks == null) || (jDecks.length == 0))
		{
			localStorage.removeItem(storageName);
		} else {
			var json_str = JSON.stringify(jDecks);
			localStorage.setItem(storageName, json_str);
		}
	} else {
		// If no decks, clear cookie (assign null and delete it, to be sure)
		if ((jDecks == null) || (jDecks.length == 0))
		{
			$.cookie(storageName, null, { expires: -1 });
			$.removeCookie(storageName);
		} else {
			// Cookie expiration time: 1 year (365*24*60*60*1000 = 31536000000)
			var date = new Date();
			date.setTime(date.getTime() + 31536000000);
			$.cookie(storageName, json_str, { expires: date });
		}
	}
}
// ///////////////// ///////////////// ///////////////// ///////////////
// Retrieve all decks from localStorage or cookie
function retrieveDecksFromStore()
{
	var json_str = "";
	// Use localStorage before cookies
	if (typeof(localStorage) != "undefined")
	{
		json_str = localStorage.getItem(storageName);
	} else if (((typeof($.cookie()) != "undefined") && ($.cookie(storageName) !== undefined))) {
			json_str = $.cookie(storageName);
	}
	if (json_str != "")
	{
		jDecks = JSON.parse(json_str);
		// Avoid null on first use
		if (jDecks == null)
			jDecks = [];
	}
}
// ///////////////// ///////////////// ///////////////// ///////////////
// Delete a deck from the arrays
function deleteADeck(idx)
{
	if ((idx >= 0) && (idx < jDecks.length))
	{
		jDecks.splice(idx, 1);
		storeDecksOnStore();
		return true;
	}

	return false;
}
// ///////////////// ///////////////// ///////////////// ///////////////
// Add a deck to array
function addADeck(name, hero, cards)
{
	var idx = (jDecks == null) ? 0 : jDecks.length;
	jDecks[idx] = { name: name, hero: hero, cards: fullCopy(cards) };
	storeDecksOnStore();
}
// ///////////////// ///////////////// ///////////////// ///////////////

// ///////////////// ///////////////// ///////////////// ///////////////
// Import/Export stuff
// ///////////////
// Import deck from HearthHead HTML export
function loadHearthHeadHTML(htmlText)
{
	var theHTML = htmlText.trim();
	// Get card list
	if (theHTML.length == 0) return null;

	var LENGTH    = 0;
	var cardUrl   = 'http://www.hearthhead.com/card=';
	var innerText = '';
	var quantity	  = 1;
	var idx       = 0;
	var result    = { name: "", hero: 0, cards: [] };
	
	try {
		// Read name
		result.name = $(theHTML).find('p > b > a, [class^=c]')[0].text;
		// Read hero from name class
		result.hero = parseInt($(theHTML).find('p > b > a, [class^=c]').attr('class').replace('c', ''));
		// Read cards from links and their quantity
		$(theHTML).find('li').each(function(index, element)
		{
			var innerText = $(this).html();
			var quantity = (innerText.indexOf('x2') > 0) ? 2 : 1;
			$(this).find('a').each(function(index, element)
			{
				var href = $(this).attr('href');
				if (href.indexOf(cardUrl) >= 0)
				{
					var cardId = parseInt(href.substr(cardUrl.length));
					result.cards[LENGTH++] = { card: cardId, count: quantity };
				}
    	    });
	    });
	}
	catch(err)
	{
		alert(texts[locale].parseerror + ":\n" + err.message);
		result = null;
	}

	return result;
}
// ///////////////
// Import deck from HearthHead URL
function loadFromHearthHeadUrl(url)
{
	var theUrl = url.trim();
	if (theUrl.length == 0) return null;
	if (theUrl.indexOf('http') < 0) return null;
	if (theUrl.indexOf('#...') >= 0) return null;
	if ((theUrl.indexOf('hearthhead') >= 0) && (url.indexOf('#') >= 0))
	{
		var result = { hero: "" , cards: [] };
		var hash = theUrl.substring(theUrl.indexOf('#'));
		var deck = $WH.calc.hash.getCardsFrom(hash, true);
		if (!deck)
		{
			alert(texts[locale].urlerror);
			return null;
		}
		// Read hero
		result.hero = deck.classs;
		// Read cards
		var LENGTH = 0;
		for (var card in deck.cards)
			result.cards[LENGTH++] = { card: deck.cards[card].id, count: deck.cards[card].count };
		// Return data
		return result;
	} else {
		alert(texts[locale].wrongurl);
		return null;
	}
}
// ///////////////
