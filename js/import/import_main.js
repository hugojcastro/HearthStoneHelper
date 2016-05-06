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

// ///////////////// ///////////////// ///////////////// ///////////////
// Import/Export stuff
// ///////////////
// This will fix the use from local files (file:///..., C:\...)
jQuery.support.cors = true;
// ///////////////
// Function to download text as file
// Example: downloadFile('the content of the file', 'filename.txt', 'text/plain');
function downloadFile() // strData, strFileName, strMimeType
{
	var aElement = document.createElement("a"),
	data = arguments[0],
	name = arguments[1] || "default.deck.json",
	type = arguments[2] || "text/plain";

	//build download link:
	aElement.href = "data:" + type + "charset=utf-8," + escape(data);

	// IE10
	if (window.MSBlobBuilder)
	{
		var blobBuilder = new MSBlobBuilder();
		blobBuilder.append(data);
		return navigator.msSaveBlob(blobBuilder, name);
	}

	//FF20, CH19
	if ('download' in aElement)
	{
		aElement.setAttribute("download", name);
		aElement.innerHTML = "downloading...";
		document.body.appendChild(aElement);
		setTimeout(function()
		{
			var mEvent = document.createEvent("MouseEvents");
			mEvent.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			aElement.dispatchEvent(mEvent);
			document.body.removeChild(aElement);
		}, 66);

		return true;
	}

	//do iframe dataURL download: (older W3)
	var iFrame = document.createElement("iframe");
	document.body.appendChild(iFrame);
	iFrame.src = "data:" + (type ? type : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(data);
	setTimeout(function() { document.body.removeChild(iFrame); }, 333);

	return true;
}
// ///////////////

// ///////////////
// Process the html from an url
// Based on URL, call each parser for html text or JSON text
// url: HTML from imported url in text format (html var will be the parsed text to DOM objects)
// content: JSON content imported from url
function processContent(url, content)
{
	var result = null;

	// Several things can throw exceptions... let's catch them here
	try
	{
		var html = $.parseHTML(content);

		if ((url.indexOf("hearthstats.") !== -1) || (url.indexOf("hss.io") !== -1))
		{
			result = importFromHearthStats(html);
		}
		else if (url.indexOf("hearthpwn.") !== -1) 
		{
			result = importFromHearthPwn(html);
		}
		else if (url.indexOf("hearthhead.") !== -1)
		{
			result = importFromHearthHead(html);
		}
		else if (url.indexOf("heartharena") !== -1)
		{
			result = importFromHearthArena(html);
		}
		else if (url.indexOf("hearthstoneplayers.") !== -1)
		{
			result = importFromHearthStonePlayers(html);
		}
		else if (url.indexOf("hearthstonetopdecks.") !== -1)
		{
			result = importFromHearthStoneTopDecks(html);
		}
		else if (url.indexOf("hearthstonetopdeck.") !== -1)
		{
			result = importFromHearthStoneTopDeck(html);
		}
		else if (url.indexOf("hearthnews.fr") !== -1) 
		{
			result = importFromHearthNews(html);
		}
		else if (url.indexOf("hearthstone-decks.") !== -1)
		{
			result = importFromHearthStoneDecks(html);
		}
		else if (url.indexOf("gameofhearthstone.") !== -1)
		{
			result = importFromGameOfHearthStone(html);
		}
		else if (url.indexOf("hearthstone.buffed.") !== -1)
		{
			result = importFromBuffed(html);
		}
		else if (url.indexOf("gosugamers.") !== -1)
		{
			result = importFromGosugamers(html);
		}
		else if (url.indexOf("millenium.") !== -1)
		{
			result = importFromMillenium(html);
		}
		else if (url.indexOf("pro.eslgaming.") !== -1)
		{
			result = importFromProESLGaming(html);
		}
		else if (url.indexOf("playhs.es") !== -1)
		{
			result = importFromPlayHS(html);
		}
		else if (url.indexOf("hearthstonebuilder.com") !== -1)
		{
			result = importFromHeartstoneBuilder(content);
		}
		else if (url.indexOf("elitedecks.net") !== -1)
		{
			result = importFromEliteDecks(html);
		}
		else if (url.indexOf(".inven.co.kr") !== -1)
		{
			result = importFromInvenCoKr(html, content);
		}
		else if (url.indexOf("hearthbuilder.") !== -1)
		{
			result = importFromHearthBuilder(html);
		}
		else if (url.indexOf("blizzpro.") !== -1)
		{
			result = importFromBlizzpro(html);
		}
		else if (url.indexOf(".hsdeck.") !== -1)
		{
			result = importFromHSDeck(html);
		}
		else if (url.indexOf("playhscards.ru") !== -1)
		{
			result = importFromPlayHSCards(html);
		}
		else if (url.indexOf("icy-veins.com") !== -1)
		{
			result = importFromIcyVeins(html);
		}
		else if (url.indexOf("tempostorm") !== -1)
		{
			result = importFromTempoStorm(content); // Note: TempoStorm uses JSON data, not HTML data
		}
		// else if (url.indexOf("arenavalue") !== -1) // Still looking for workaround for this one :/
		// {
			// result = importFromArenaValue(html);
		// }
	}
	catch(err)
	{
		result = { name: "", hero: 0, cards: [], errcode: texts[locale].exceptionthrown + err.message, errvalue: 1 };
	}

	if (result === null)
	{
		result = { name: "", hero: 0, cards: [], errcode: texts[locale].unknownurl, errvalue: 1 };
	}

	return result;
}
// ///////////////
// Function called to process a html text
function processHTML(html, callback)
{
	var result = null;

	if (html.length > 0)
	{
		if (html.indexOf("hearthpwn") !== -1)
		{
			result = importFromHearthPwnHTML(html);
		}
		else if (html.indexOf("hearthhead") !== -1)
		{
			result = importFromHearthHeadHTML(html);
		}
		else if (html.indexOf("hearthstone.buffed.") !== -1)
		{
			result = importFromHearthStoneBuffedHTML(html);
		}
	}

	// Finally, check if there's deck and send it back
	if (result === null)
	{
		result =  { name: "", hero: 0, cards: [], errcode: texts[locale].emptyorinvalidhtml, errvalue: 1 };
	}

	callback(result);
}
// ///////////////
// Function called to process an url for a deck builder
function processBuilder(url, callback)
{
	var result = null;

	if (url.indexOf("hearthpwn") !== -1)
	{
		result = importFromHearthPwnBuilder(url);
	}
	else if (url.indexOf("hearthhead") !== -1)
	{
		result = importFromHearthHeadBuilder(url);
	}
	else if (url.indexOf("hearthstone.buffed.") !== -1)
	{
		result = importFromHearthStoneBuffedBuilder(url);
	}
	else if (url.indexOf("gosugamers.") !== -1)
	{
		result = importFromGosugamersBuilder(url);
	}

	// Finally, check if there's deck and send it back
	if (result === null)
	{
		result =  { name: "", hero: 0, cards: [], errcode: texts[locale].unknownurl, errvalue: 1 };
	}

	callback(result);
}
// ///////////////
// Get content from an url (HTML text or JSON data), and pass it as argument for the callback function
// theurl: URL to get content from
// callback: function to call using retrieved content as parameter :D
function processUrl(theurl, callback)
{
	// Check if good url
	var errcode   = "";

	if (theurl.length === 0)
	{
		errcode = texts[locale].nourl;
	}
	else if (theurl.indexOf('#...') >= 0)
	{
		errcode = texts[locale].wrongurl;
	}

	// Wrong url?
	if (errcode !== "")
	{
		callback( { name: "", hero: 0, cards: [], errcode: errcode, errvalue: 1 } );
	}
	// If it's a builder url, deck cames in there (no deck name, tho)
	else if ((theurl.indexOf("deckbuilder") !== -1) || (theurl.indexOf("builder/") !== -1))
	{
		processBuilder(theurl, callback);
	}
	else
	{
		// Let's show a waiting animation
		showSpinner();
		// Website url: let's crawl a bit
		var contentType = 'Content-type: text/plain; charset=utf-8';
		var aparams  = "";
		var aurl     = theurl;
		var amethod  = "get";
		var alang    = "utf-8";
		var ajson    = '1';

		// Do special filtering here if needed
		
		// Tempostorm? get JSON data using POST method and custom params
		if (aurl.indexOf('tempostorm.com') > -1)
		{
			var name = aurl.substr(aurl.indexOf('decks/') + 6);
			// aparams = '{"slug":"' + aurl.substr(aurl.indexOf('decks/') + 6) + '"}'
			// aurl    = 'https://tempostorm.com/deck';
			// amethod = "post";
			// new format for tempostorm...
			aurl= 'https://tempostorm.com/api/decks/findOne?filter=%7B%22where%22:%7B%22slug%22:%22' + name + '%22%7D,%22fields%22:%5B%22id%22,%22createdDate%22,%22name%22,%22description%22,%22playerClass%22,%22premium%22,%22dust%22,%22heroName%22,%22authorId%22,%22deckType%22,%22isPublic%22,%22chapters%22,%22youtubeId%22,%22gameModeType%22,%22isActive%22,%22isCommentable%22%5D,%22include%22:%5B%7B%22relation%22:%22cards%22,%22scope%22:%7B%22include%22:%22card%22,%22scope%22:%7B%22fields%22:%5B%22id%22,%22name%22,%22cardType%22,%22cost%22,%22dust%22,%22photoNames%22%5D%7D%7D%7D,%7B%22relation%22:%22comments%22,%22scope%22:%7B%22fields%22:%5B%22id%22,%22votes%22,%22authorId%22,%22createdDate%22,%22text%22%5D,%22include%22:%7B%22relation%22:%22author%22,%22scope%22:%7B%22fields%22:%5B%22id%22,%22username%22%5D%7D%7D%7D%7D,%7B%22relation%22:%22author%22,%22scope%22:%7B%22fields%22:%5B%22id%22,%22username%22%5D%7D%7D,%7B%22relation%22:%22matchups%22,%22scope%22:%7B%22fields%22:%5B%22forChance%22,%22deckName%22,%22className%22%5D%7D%7D,%7B%22relation%22:%22votes%22,%22fields%22:%5B%22id%22,%22direction%22,%22authorId%22%5D%7D%5D%7D';
		}
		// Arenavalue? get JSON data using GET method and custom params
		else if (aurl.indexOf('arenavalue') > -1)
		{
			aparams = 'deck=' + aurl.substr(aurl.indexOf('/s/') + 3);
			if (aparams.indexOf('#') > -1)
			{
				aparams = aparams.substr(0, aparams.indexOf('#'));
			}
			aurl    = 'http://www.arenavalue.com/helper/getdata.php';
			amethod = "post";
			ajson   = '1';
		}
		// Inven.co.kr? Use corean language for retrieved content
		else if (aurl.indexOf('inven.co.kr') > -1)
		{
			alang = "euc-kr";
		}
		// Elitedecks? No language tag and no JSON to use custom import method in PHP proxy
		else if (aurl.indexOf('elitedecks.net') > -1)
		{
			alang = "";
			ajson = '0';
		}
		// Hearthstonebuilder? Get deck as JSON from custom URL
		else if (aurl.indexOf('hearthstonebuilder') > -1)
		{
			var deckId = aurl;
			while (deckId.indexOf('/') !== -1)
			{
				deckId = deckId.substr(deckId.indexOf('/') + 1);
			}
			aurl = 'http://hearthstonebuilder.com/api/deck/' + deckId;
		}
		// Buffed.de? always use english locale to get data :D
		else if (aurl.indexOf('hearthstone.buffed.') !== -1) 
		{
			// Use english version for buffed.de, to get right card ID's from name :)
			// not english? do it english
			if (aurl.indexOf('/en/') == -1)
			{
				var deckname = aurl.substr(aurl.indexOf('guide/') + 6);
				aurl = 'http://hearthstone.buffed.de/en/guide/' + deckname;
			}
		}
		// Gameofhearthstone? Force display mode to 1 (text descriptions)
		else if ((aurl.indexOf('gameofhearthstone') !== -1) && (aurl.indexOf('?display') === -1))
		{
			// fix page mode for gameofhearthstone
			aurl = aurl + '?display=1';
		} 
		// Hearthstats/hss.io? Force the use of english locale (easy way: just remove locale value ^^)
		else if ((aurl.indexOf('hearthstats') !== -1) || (aurl.indexOf('hss.io') !== -1))
		{
			// Fix locales for hearthstats
			if (aurl.indexOf('?locale') !== -1)
				aurl = aurl.substr(0, aurl.indexOf('?locale'));
		}
/*
		// HearthPwn banned once my proxy script, so I can't get data from them with it. I used this as a workaround
		else if ((aurl.indexOf('hearthpwn') !== -1) || (aurl.indexOf('arenavalue') !== -1))
		{
			// I'll use cors.io while it's still up :/
			$.get(
  				"http://cors.io/?u=" + aurl
			).done(
				function(data)
				{
					var result = processContent(theurl, data);
					// Hide waiting animation
					hideSpinner();
					// Call original callback
					callback(result);
				}
			).fail(
				function(xhr, textStatus, errorThrown)
				{
					hideSpinner();
					callback({ name: "", hero: 0, cards: [], errcode: xhr.responseText + "' (" + errorThrown + " - " + textStatus + ")", errvalue: 1 } );
				}
			);
			return;
		}
*/
		// Custom POST request to our proxy
		$.post(
  			'http://hugojcastro.esy.es/hs_helper/import_deck.php',
			{
				url:         aurl,
				method:      amethod,
				params:      aparams,
				lang:        alang,
				json:        ajson,
				headers:     { 'Access-Control-Allow-Origin': '*' },
				crossDomain: true
			}
		).done(
			function(data)
			{
				var result = processContent(theurl, data);
				// Fixes for complex websites
				if (aurl.indexOf('playhscards.ru/arena/') !== -1)
				{
					result.isarena = true;
				}
				// Hide waiting animation
				hideSpinner();
				// Call original callback
				callback(result);
			}
		).fail(
			function(xhr, textStatus, errorThrown)
			{
				hideSpinner();
				callback({ name: "", hero: 0, cards: [], errcode: xhr.responseText + "' (" + errorThrown + " - " + textStatus + ")", errvalue: 1 } );
			}
		);
	}
}
// ///////////////
// Not sure if best place for this method but anyways :D
// From now, I'll use Blizzard's ID for cards, instead of an index from HearthHead.
// This will ease the updates from new content, even after HearthHead.
// I'm using this method to check imported decks and to update values in case it's necessary
function checkDeckIDs(cards)
{
	var result = false;
	// Check if uses old notation of Integers instead of strings as IDs
	if ($.isNumeric(cards[0].card))
	{
		for (var idx in cards)
		{
			cards[idx].card = hearthhead_cards[cards[idx].card].image;
		}
		result = true;
	}
	return result;
}
// ///////////////
function updateDeckData(decks)
{
	var result = false;
	// For each deck stored in array
	for (var i = 0; i < decks.length; i++)
	{
		// fix old versions for invalid arena flag
		if (typeof(decks[i].isarena) === "undefined")
		{
			decks[i].isarena = false;
			result = true;
		}
		// Check if uses old notation of Integers instead of strings as IDs
		if (checkDeckIDs(decks[i].cards))
		{
			result = true;
		}
	}
	return result;
}
// ///////////////
