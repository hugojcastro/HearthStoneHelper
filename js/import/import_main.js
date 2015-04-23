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
// Which method to use to download web pages getting ride of CORS
var CORSMETHOD     = 3;
var MAINCORSMETHOD = 3;
var MAXCORSMETHOD  = 4;
// ///////////////// ///////////////// ///////////////// ///////////////

// ///////////////// ///////////////// ///////////////// ///////////////
// Import/Export stuff
// ///////////////

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
// Based on URL, call the parser for html text
function processContent(url, html)
{
	var result = null;

	if ((url.indexOf("hearthstats.") != -1) || (url.indexOf("hss.io") != -1))
		result = importFromHearthStats(html);
	else if (url.indexOf("hearthpwn.") != -1) 
		result = importFromHearthPwn(html);
	else if (url.indexOf("hearthhead.") != -1)
		result = importFromHearthHead(html);
	else if (url.indexOf("heartharena") != -1)
		result = importFromHearthArena(html);
	else if (url.indexOf("hearthstoneplayers.") != -1)
		result = importFromHearthStonePlayers(html);
	else if (url.indexOf("hearthstonetopdecks.") != -1)
		result = importFromHearthStoneTopDecks(html);
	else if (url.indexOf("hearthstonetopdeck.") != -1)
		result = importFromHearthStoneTopDeck(html);
	else if (url.indexOf("hearthnews.fr") != -1) 
		result = importFromHearthNews(html);
	else if (url.indexOf("hearthstone-decks.") != -1)
		result = importFromHearthStoneDecks(html);
	else if (url.indexOf("gameofhearthstone.") != -1)
		result = importFromGameOfHearthStone(html);
	else if (url.indexOf("hearthstone.buffed.") != -1)
		result = importFromBuffed(html);
	else if (url.indexOf("gosugamers.") != -1)
		result = importFromGosugamers(html);
	else if (url.indexOf("millenium.") != -1)
	{
		if ( url.indexOf("/accueil/") != -1 )
			result = importFromMilleniumBeta(html);
		else
			result = importFromMillenium(html);
	} else if (url.indexOf("pro.eslgaming.") != -1)
		result = importFromProESLGaming(html);
	else if (url.indexOf("playhs.es") != -1)
		result = importFromPlayHS(html);
	else if (url.indexOf("hearthstonebuilder.com") != -1)
		result = importFromHeartstoneBuilder(html);
	else if (url.indexOf("elitedecks.net") != -1)
		result = importFromEliteDecks(html);
	else if (url.indexOf(".inven.co.kr") != -1)
		result = importFromInvenCoKr(html);
	else if (url.indexOf("hearthbuilder.") != -1)
		result = importFromHearthBuilder(html);
	else if (url.indexOf("blizzpro.") != -1)
		result = importFromBlizzpro(html);
	else if (url.indexOf(".hsdeck.") != -1)
		result = importFromHSDeck(html);
	else if (url.indexOf("playhscards.ru") != -1)
		result = importFromPlayHSCards(html);

/* TODO
	else if (url.indexOf("arenavalue") != -1)
		result = importFromArenaValue(html);
	else if (url.indexOf("tempostorm") != -1)
		result = importFromTempoStorm(html);
*/
	if (result == null)
		result = { name: "", hero: 0, cards: [], errcode: texts[locale].unknownurl, errvalue: 1 };

	return result;
}
// ///////////////
// Function called to process a html text
function processHTML(html, callback)
{
	var result = null;

	if (html.length > 0)
	{
		if (html.indexOf("hearthpwn") != -1)
			result = importFromHearthPwnHTML(html);
		else if (html.indexOf("hearthhead") != -1)
			result = importFromHearthHeadHTML(html);
		else if (html.indexOf("hearthstone.buffed.") != -1)
			result = importFromHearthStoneBuffedHTML(html);
	}

	// Finally, check if there's deck and send it back
	if (result == null)
		result =  { name: "", hero: 0, cards: [], errcode: texts[locale].emptyorinvalidhtml, errvalue: 1 };

	callback(result);
}
// ///////////////
// Function called to process an url for a deck builder
function processBuilder(url, callback)
{
	var result = null;

	if (url.indexOf("hearthpwn") != -1)
		result = importFromHearthPwnBuilder(url);
	else if (url.indexOf("hearthhead") != -1)
		result = importFromHearthHeadBuilder(url);
	else if (url.indexOf("hearthstone.buffed.") != -1)
		result = importFromHearthStoneBuffedBuilder(url);
	else if (url.indexOf("gosugamers.") != -1)
		result = importFromGosugamersBuilder(url);

	// Finally, check if there's deck and send it back
	if (result == null)
		result =  { name: "", hero: 0, cards: [], errcode: texts[locale].unknownurl, errvalue: 1 };

	callback(result);
}
// ///////////////
// Function called to process an url and get the underlying page
function processUrl(url, callback)
{
	// Check if good url
	var errcode   = "";
	var isRussian = false;

	if (url.length == 0)
		errcode = texts[locale].nourl;
	else if (url.indexOf('#...') >= 0)
		errcode = texts[locale].wrongurl;

	// Wrong url?
	if (errcode != "")
		callback( { name: "", hero: 0, cards: [], errcode: errcode, errvalue: 1 } );
	// If it's a builder url, deck cames in there (no deck name, tho)
	else if ((url.indexOf("deckbuilder") != -1) || (url.indexOf("builder/") != -1))
		processBuilder(url, callback);
	else
	{
		var contentType = 'Content-type: text/plain; charset=utf-8';

		// Using russian encoding for russian pages. Check if CORS method allows it
		if (url.indexOf('.ru/') != -1)
		{
			isRussian = true;
			CORSMETHOD = 2;
			contentType = 'Content-type: text/plain; charset=iso-8859-1';
		}

		// Fix locales for hearthstats
		if ((url.indexOf('hearthstats') != -1) || (url.indexOf('hss.io') != -1))
			if (url.indexOf('?locale') != -1)
				url = url.substr(0, url.indexOf('?locale'));

		// fix page mode for gameofhearthstone
		if ((url.indexOf('gameofhearthstone') != -1) && (url.indexOf('?display') == -1))
			url = url + '?display=1';

		// Use english version for buffed.de, to get right card ID's from name :)
		if (url.indexOf('hearthstone.buffed.') != -1)
		{
			// not english? do it english
			if (url.indexOf('/en/') == -1)
			{
				// http://hearthstone.buffed.de/en/guide/Mein-Aktuelles-Magier-Deck-01012014-394
				var deckname = url.substr(url.indexOf('guide/') + 6);
				url = 'http://hearthstone.buffed.de/en/guide/' + deckname;
			}
		}

		if (url.indexOf('hearthstonebuilder.com') != -1)
		{
			var deckId = url;
			while (deckId.indexOf('/') != -1)
				deckId = deckId.substr(deckId.indexOf('/') + 1);
			url = 'http://hearthstonebuilder.com/api/deck/' + deckId;
		}

		// 1 use corsproxy (sometimes fails), 2 use whateverorigin (don't process GET request in url), 3 use anyorigin (not recommended)
		var finalurl = '';
		var dataType = '';

		// Method #1: Using corsproxy, with http:// stripped from url
		if (CORSMETHOD == 1)
		{
			var question = url.indexOf('://');
			if (question != -1)
				url = url.substr(question + 3);
			finalurl = 'http://www.corsproxy.com/' + url;
		// Method #2: Using whateverorigin. Big issue: It does not support urls with GET params (http://..../page.php?a=b&b=c&c=d...)
		} else if (CORSMETHOD == 2) {
			finalurl = 'http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?';
			dataType = 'json';
		// Method #3: Using anyorigin. Owner demands payment, so it's not safe at all
		} else if (CORSMETHOD == 3) {
			finalurl = 'http://anyorigin.com/dev/get?url=' + escape(url) + '&callback=?';
			dataType = 'json';
		// Method #4: Using another corsproxy url
		} else if (CORSMETHOD == 4) {
			finalurl = 'http://cors.corsproxy.io/url=' + url;
		}

		if (finalurl != "")
		{
			$.ajax(
			{
				url: finalurl,
				timeout: 10000,
				crossDomain: true,
				async: false,
				dataType: dataType,
				contentType: contentType,
				beforeSend: function (xhr)
				{
					showSpinner();
					if (isRussian)
						xhr.overrideMimeType('text/plain; charset=iso-8859-1');
				},
				complete: function(xhr,status)
				{
					hideSpinner();
				},
				error: function(httpReq, textStatus, exceptionThrown)
				{
					// Error? Try next CORS method
					CORSMETHOD++;
					if (CORSMETHOD > MAXCORSMETHOD)
						CORSMETHOD = 1;
					if (CORSMETHOD == MAINCORSMETHOD)
					{
						callback({ name: "", hero: 0, cards: [], errcode: httpReq.responseText + "' (" + textStatus + ")", errvalue: 1 } );
					} else {
						processUrl(url, callback);
					}
				},
				success: function(data, status, xhr)
				{
					// Take response and process it
					var result = processContent(url, (((CORSMETHOD == 4) || (CORSMETHOD == 1)) ? data : data.contents));
					// Fixes for complex websites
					if (url.indexOf('playhscards.ru/arena/') != -1)
						result.isarena = true;
					// Call original callback
					callback(result);
					// Hide waiting animation
					hideSpinner();
				},
				
			});
		} else {
			$.simplyToast(texts[locale].noCORSmethod, 'error');
			// alert(texts[locale].noCORSmethod);
		}
	}
}
// ///////////////