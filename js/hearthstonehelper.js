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
// Init vars
g_hearthstone_qualities = { // Actualmente no se usan para nada más que el color del nombre, así que no se han traducido
	0: "soulbound",
	1: "common",
	2: "common",
	3: "rare",
	4: "epic",
	5: "legendary"
};
var preurl			= "http://wow.zamimg.com/images/hearthstone/cards/";
var locale			= "eses";
var card_size		= "/mediumj/";
var card_extension	= ".jpg";
var cardSetUrl		= "images/sets/";
var my_deck_cards	= new Array();
var my_deck_hero		= 0;
var hayCookies		= ((typeof($.cookie()) != "undefined") && ($.cookie('numDecks') !== undefined));
var cardSet			= ["", "", "", "classic", "", "", "", "", "", "", "", "", "naxx", "gvg"];
// ///////////////

// ///////////////
// Debug function
// ///////////////
function debugAlert(obj)
{
	var txt = "";
	for (var it in obj)
		txt += it + "=" + obj[it] + "; ";
	alert(txt);
}
// ///////////////


// ///////////////// ///////////////// ///////////////// ///////////////
// Card stuff
// ///////////////
function cardPair(cardId, cardCount)
{
	this.card = cardId;
	this.count = cardCount;
}
// ///////////////
// Auxiliary: Create a html item for append to card
// Use: anItem('tag'[[[, 'class'], 'html'], 'bg'])
// if a value in the middle is not used, you must put '' instead
function anItem()
{
	var sub_elem = document.createElement(arguments[0]);
	if ((typeof(arguments[1]) != "undefined") && (arguments[1] != '')) $(sub_elem).attr('class', arguments[1]);
	if ((typeof(arguments[2]) != "undefined") && ((arguments[2] != '') || (arguments[2] == 0))) $(sub_elem).html(arguments[2]);
	if ((typeof(arguments[3]) != "undefined") && (arguments[3] != '')) $(sub_elem).css('backgroundImage', arguments[3]);

	return sub_elem;
}
// ///////////////
// Auxiliary: Create a html item for a card
// Use: createCard(g_hearthstone_cards card)
function createCard(card)
{
	// Get card background
	var card_url = preurl + locale + card_size + card.image + /* ((ispremium(card)) ? "_premium" : "") + */ card_extension;
	// Get card set
	var cardset = cardSet[card.set];
	if (typeof(cardset) == "undefined") cardset = "";
	if (cardset != "")
		cardset = 'url("' + cardSetUrl + cardset + '.png")';
	// Create card holder
	var elem = document.createElement('li');
	$(elem).attr('id', 'card_' + card.id);
	$(elem).attr('card_id', card.id);
	$(elem).attr('card_count', 1);
	$(elem).attr('card_cost', card.cost);
	$(elem).attr('card_name', card.name);
	$(elem).attr('card_quality', card.quality);
	$(elem).attr('card_set', card.set);
	$(elem).attr('class', 'card');
	$(elem).bind('mousedown', function(e) { pickCard(e, this); });
	$(elem).swipe( {
		//Generic swipe handler for all directions
		swipeLeft:function(event, direction, distance, duration, fingerCount) {
			pickRightCard(this);
			event.preventDefault();
		},
		swipeRight:function(event, direction, distance, duration, fingerCount) {
			pickWrongCard(this);
			event.preventDefault();
		},
		threshold:10
	});
	$(elem).bind('contextmenu', function(e) { return false; }); 
	// Create card elements: card name
	$(elem).append(anItem('span', 'name ' + g_hearthstone_qualities[card.quality], card.name, cardset));
	// card background
	$(elem).append(anItem('span', 'bg', '<div></div>', 'url(' + card_url + ')'));
	// card count
	$(elem).append(anItem('span', 'count', $(elem).attr('card_count')));
	// card cost
	$(elem).append(anItem('span', 'icon cost', card.cost));
	// card shadow overlay
	$(elem).append(anItem('span', 'shadow-overlay'));
	// and card cover
	$(elem).append(anItem('span', 'cover'));
	// return new card
	return elem;
}
// ///////////////
// Add card to graphic holder
function addCard(card_id)
{
	// If card not found on DB, warn and finish
	if (typeof(g_hearthstone_cards[locale][card_id]) == "undefined")
		{ alert(texts[locale].cardnotfound); return; }
	// Get deck from page
	var deck = $('#deck');
	// Get card as single object
	var card = g_hearthstone_cards[locale][card_id];
	// Check if card on deck
	if ($('#card_' + card.id).length > 0)
	{
		// Does it is? Take card count
		var theItem = $('#card_' + card.id);
		var count = parseInt(theItem.attr('card_count'));
		// Does it is 2? Error and exit
		if (count == 2)
			{ alert(texts[locale].onlytwo + theItem.attr('card_name') + "'!"); return; }
		// Does it is 1 and legendary? Error and exit
		var kind = parseInt(theItem.attr('card_quality'));
		if ((count == 1) && (kind == 5))
			{ alert(texts[locale].onlyone + theItem.attr('card_name') + "'!"); return; }
		// All is Ok? Inc it and exit
		theItem.attr('card_count', 2);
		theItem.find('span.count').html('2');
		return;
	}
	// No card found? Add it! (speed up things taking now some re-used values)
	var newCard = createCard(card);
	var newCost = parseInt($(newCard).attr('card_cost'))
	var newName = $(newCard).attr('card_name');
	// Look for the right position ordered by cost and then name
	var inserted = false;
	var cards = $(deck).children('li');
	for (var ctr = 0; ctr < cards.length; ctr++)
	{
		var actualValue = parseInt($(cards[ctr]).attr('card_cost'));
		var actualName = $(cards[ctr]).attr('card_name');
		if ((newCost < actualValue) || ((newCost == actualValue) && (newName.localeCompare(actualName) < 0)))
		{
			cards[ctr].parentNode.insertBefore(newCard, cards[ctr]);
			inserted = true;
			break;
		}
	}
	// If an order is not found, insert at the end
	if (inserted == false)
		$(deck).append(newCard);
}
// ///////////////
function removeCard(card_id)
{
	var idText = '#card_' + card_id;
	if ($(idText).length > 0)
		$(idText).remove();
}
// ///////////////
function pickCard(event, card)
{
	switch(event.which)
	{
		case 1 : // left click
			pickRightCard(card);
			break;
		case 3 : // right click
			pickWrongCard(card);
			break;
	}
}
// ///////////////
function pickRightCard(card)
{
	var card_id		= $(card).attr('card_id');
	var card_count		= parseInt($(card).attr('card_count'));
	var card_quality	= parseInt($(card).attr('card_quality'));
	var card_cost		= parseInt($(card).attr('card_cost'));
	var card_name		= $(card).attr('card_name');

	if (card_count == 0) return;
	card_count--;
	$(card).attr('card_count', card_count);
	if (card_count == 0)
	{
		$(card).find('span.count').html('');
		$(card).find('span.cover').css('background-color', 'rgba(0, 0, 0, 0.75)');
	} else {
		$(card).find('span.count').html(card_count);
	}
}
// ///////////////
function pickWrongCard(card)
{
	var card_id		= $(card).attr('card_id');
	var card_count		= parseInt($(card).attr('card_count'));
	var card_quality	= parseInt($(card).attr('card_quality'));
	var card_cost		= parseInt($(card).attr('card_cost'));
	var card_name		= $(card).attr('card_name');

	if ((card_count == 2) || ((card_count == 1) && (card_quality == 5))) return;
	card_count++;
	for (var idx = 0; idx < my_deck_cards.length; idx++)
	{
		if (my_deck_cards[idx].card == card_id)
		{
			if (card_count <= my_deck_cards[idx].count)
			{
				$(card).find('span.cover').css('background-color', 'rgba(0, 0, 0, 0)');
				$(card).attr('card_count', card_count);
				$(card).find('span.count').html(card_count);
			}
			break;
		}
	}
}
// ///////////////
function restoreCard(card_id)
{
	var card			= $('#card_' + card_id);
	var card_count		= parseInt($(card).attr('card_count'));
	var card_quality	= parseInt($(card).attr('card_quality'));
	var card_cost		= parseInt($(card).attr('card_cost'));
	var card_name		= g_hearthstone_cards[locale][card_id].name;

	if ((card_count == 2) || ((card_count == 1) && (card_quality == 5))) return;

	for (var idx = 0; idx < my_deck_cards.length; idx++)
	{
		if (my_deck_cards[idx].card == card_id)
		{
			$(card).find('span.cover').css('background-color', 'rgba(0, 0, 0, 0)');
			$(card).attr('card_count', my_deck_cards[idx].count);
			$(card).find('span.count').html(my_deck_cards[idx].count);
			$(card).attr('card_name', card_name);
			$(card).find('span.name').html(card_name);
			break;
		}
	}
}
// ///////////////


// ///////////////// ///////////////// ///////////////// ///////////////
// Deck Stuff
// ///////////////
// Deck functions
// ///////////////
function showDeckCore()
{
	if (my_deck_cards.length == 0) return;
	// Delete previous deck
	deleteDeck();
	// Add hero
	var hero_id = g_hearthstone_classes[locale][my_deck_hero].card_id;
	var hero_image = g_hearthstone_cards[locale][hero_id].image;

	var card_url = preurl + locale + card_size + hero_image + /* ((ispremium(card)) ? "_premium" : "") + */ card_extension;
	$('#deck_class').css('background-image', 'url(' + card_url+ ')');

	// Add one by one
	for (var idx = 0; idx < my_deck_cards.length; idx++)
	{
		addCard(my_deck_cards[idx].card);
		if (my_deck_cards[idx].count == 2)
			addCard(my_deck_cards[idx].card);
	}

	visibleControls(true);
}
// ///////////////
function restoreDeck()
{
	for (var idx = 0; idx < my_deck_cards.length; idx++)
	{
		restoreCard(my_deck_cards[idx].card);
	}
}
// ///////////////
function deleteDeck()
{
	visibleControls(false);
	$("#deck > li").remove();
}
// ///////////////


// ///////////////// ///////////////// ///////////////// ///////////////
// Import/Export stuff
// ///////////////
// Import deck from HearthHead HTML export
function loadHTML()
{
	// Get card list
	var deck_cards = $('#deck_content').val();
	if (deck_cards.trim().length == 0) return;
	if (my_deck_cards.length > 0)
		my_deck_cards.splice(0, my_deck_cards.length);
	var LENGTH 		= 0;
	var cardUrl	= 'http://www.hearthhead.com/card=';
	var innerText	= '';
	var quantity	= 1;
	var idx			= 0;
	
	my_deck_hero = parseInt($(deck_cards).find('p > b > a, [class^=c]').attr('class').replace('c', ''));

	$(deck_cards).find('li').each(function(index, element)
	{
		var innerText = $(this).html();
		var quantity = (innerText.indexOf('x2') > 0) ? 2 : 1;
		$(this).find('a').each(function(index, element)
		{
			var href = $(this).attr('href');
			if (href.indexOf(cardUrl) >= 0)
			{
				var cardId = parseInt(href.substr(cardUrl.length));
				my_deck_cards[LENGTH++] = new cardPair(cardId, quantity);
			}
        });
    });
}
// ///////////////
// Import deck from HearthHead URL
function loadFromUrl()
{
	var url = $('#theurl').val().trim();
	if (url.length == 0) return;
	if (url.indexOf('http') < 0) return;
	if (url.indexOf('#...') >= 0) return;
	if ((url.indexOf('hearthhead') >= 0) && (url.indexOf('#') >= 0))
	{
		var hash = url.substring(url.indexOf('#'));
		var deck = $WH.calc.hash.getCardsFrom(hash, true);

		if (!deck)
		{
			alert(texts[locale].urlerror);
			return;
		}

		// Delete previous deck
		if (my_deck_cards.length > 0)
			my_deck_cards.splice(0, my_deck_cards.length);

		// Load hero
		my_deck_hero = deck.classs;

		// Load deck
		var LENGTH = 0;
		for (var card in deck.cards)
			my_deck_cards[LENGTH++] = new cardPair(deck.cards[card].id, deck.cards[card].count);

		// Show new deck
		showDeckCore();

		// Hide subview
		importFromUrl();

		// Show save button
		$('.save.store').show(400, 'swing');
	} else {
		alert(texts[locale].wrongurl);
	}
}
// ///////////////
// Functions to internally store decks using cookies
// Get string representation for a car pair
function getStringFromCard(card)
{
	return ('[' + card.card + ' ' + card.count + ']');
}
// ///////////////
// Get the card pair array from a string representation
function getCardFromString(str)
{
	var values = str.split(' ');
	var card = new Array();
	card.card = parseInt(values[0].replace('[', ''));
	card.count = parseInt(values[1].replace(']', ''));
	return card;
}
// ///////////////
// Auxiliary: Get the string representation for a deck, to store it on cookie
function getStringFromDeck()
{
	var result = '';
	for (var idx = 0; idx < my_deck_cards.length; idx++)
	{
		if (idx != 0) result += ',';
		result += getStringFromCard(my_deck_cards[idx]);
	}
	return result;
}
// ///////////////
// Auxiliary: Get the deck array from the string representation, to retrieve it from cookie
function getDeckFromString(str)
{
	var result = str.split(',');
	for (var idx = 0; idx < result.length; idx++)
	{
		result[idx] = getCardFromString(result[idx]);
	}
	return result;
}
// ///////////////
// Auxiliary: Create a html item for a deck
// Use: createDeckLine(deck name, cookie idx)
function createDeckLine(name, idx)
{
	// Create line holder
	var elem = document.createElement('li');
	$(elem).attr('id', 'deck_' + idx);
	$(elem).attr('class', 'deckline');
	$(elem).bind('mousemove', function() { $(this).removeClass('lineoff').addClass('lineon'); });
	$(elem).bind('mouseout', function() { $(this).removeClass('lineon').addClass('lineoff'); });
	$(elem).bind('click', function() { localLoadDeck(idx); });
	// Deck name text
	var aSpan = document.createElement('span');
	$(aSpan).attr('class', 'decklinename');
	$(aSpan).html(name);
	$(elem).append(aSpan);
	// Delete button
	aSpan = document.createElement('span');
	$(aSpan).attr('class', 'store delete');
	$(aSpan).attr('title', 'Borrar Mazo');
	$(aSpan).attr('title_eses', 'Borrar Mazo');
	$(aSpan).attr('title_enus', 'Delete Deck');
	$(aSpan).bind('click', function() { localDeleteDeck(idx); });
	$(aSpan).mouseenter(function(e){
		if (typeof($(this).attr('title_' + locale)) != "undefined")
		{
			var tooltip = document.createElement('DIV');
			tooltip.id = 'tooltip';
    		$(tooltip).html($(this).attr('title_' + locale));
    		$(tooltip).css({
				"top" : $(this).offset().top + $(this).height(),
				"left" : $(this).offset().left
    		});
			$('body').append(tooltip);
		}
	});
	$(aSpan).mouseleave(function(){
		if ($('#tooltip').length > 0)
    		$('#tooltip').remove();
	});
	$(elem).append(aSpan);
	// return new line
	return elem;
}
// ///////////////
function updateDeckList()
{
	// Clear container
	$("#importinterncontent > li").remove();
	// Take it
	var container = $('#importinterncontent');
	// Take number of stored decks
	var deckCount = (!hayCookies) ? 0 : parseInt($.cookie('numDecks'));
	// How many decks we found
	var decksFound = 0;
	// For each one, add to deck list container
	for (var idx = 1; idx <= deckCount; idx++)
	{
		// If deck found...
		if ($.cookie('deck_' + idx + '_name') !== undefined)
		{
			// Found one more
			decksFound++;
			// Show it
			var deckName = $.cookie('deck_' + idx + '_name');
			$(container).append(createDeckLine(deckName, idx));
		}
	}

	// For each one, add to deck list container
	// Finally, show status message
	var message;
	if (decksFound == 0)
	{
		message = texts[locale].emptydecklist;
		$('#deckliststatus').attr('title', 'emptydecklist');
		$.cookie('numDecks', 0);
	} else {
		message = texts[locale].loaddeckmsg;
		$('#deckliststatus').attr('title', 'loaddeckmsg');
	}
	$('#deckliststatus').html(message);
}
// ///////////////
function addDeck2List(deckName)
{
	// Take deck number
	var storedDecks = (!hayCookies) ? 1 : parseInt($.cookie('numDecks')) + 1;
	// Inc and save
	$.cookie('numDecks', storedDecks);
	// Save new deck
	$.cookie('deck_' + storedDecks + '_name', deckName);
	$.cookie('deck_' + storedDecks + '_hero', my_deck_hero);
	$.cookie('deck_' + storedDecks + '_deck', getStringFromDeck());
	// Update cookies!
	hayCookies	= true;
}
// ///////////////
function deleteDeckFromList(idx)
{
	// Get deck counter
	if ( $.cookie('deck_' + idx + '_name') === undefined) return false;
	$.removeCookie('deck_' + idx + '_name');
	$.removeCookie('deck_' + idx + '_hero');
	$.removeCookie('deck_' + idx + '_deck');
	// Let's do a little cleanup here
	var storedDecks = parseInt($.cookie('numDecks'));
	var found = false;
	// Check the stored decks counter; Try to read, at least, one
	for (var idx = 1; idx <= storedDecks; idx++)
	{
		// If one, nothing will be done
		if ($.cookie('deck_' + idx + '_name') !== undefined)
		{
			found = true;
			break;
		}
	}
	// If no decks found, we need to reset the counter to zero
	if (!found)
	{
		$.cookie('numDecks', 0);
	}
	// Ok. All right and finish
	return true;
}
// ///////////////
// retrieves a deck from cookies
function loadDeckFromList(idx)
{
	// Check if all cookies are ok
	var cookiesok = true;
	if ($.cookie('deck_' + idx + '_name') === undefined)
	{
		alert(texts[locale].cookieerrornoname);
		cookiesok = false;
	} else if ($.cookie('deck_' + idx + '_hero') === undefined) {
		alert(texts[locale].cookieerrornohero);
		cookiesok = false;
	} else if ($.cookie('deck_' + idx + '_deck') === undefined) {
		alert(texts[locale].cookieerrornodeck);
		cookiesok = false;
	}
	if (!cookiesok) return false;
	// Delete previous deck
	if (my_deck_cards.length > 0)
		my_deck_cards.splice(0, my_deck_cards.length);
	// Load hero and deck from cookies
	my_deck_cards = getDeckFromString($.cookie('deck_' + idx + '_deck'));
	my_deck_hero = parseInt($.cookie('deck_' + idx + '_hero'));
	return true;
}
// ///////////////
// Store deck on cookies with given name
function localSaveDeck()
{
	// Take deck name
	var deckName = $('#internname').val();
	// If it's the default, error
	if (deckName == texts[locale].deckname)
	{
		alert(texts[locale].givedeckname);
		return;
	}
	// Oke. Take new name and store deck with it
	addDeck2List(deckName);
	// Finally, update list
	updateDeckList();
	// Warn about success
	alert(texts[locale].decksaved);
	// Toggle Window
	saveDeck();
	// Hide save button
	$('.save.store').hide(400, 'swing');
	// Check if load button should be saved
	if (hayCookies && (parseInt($.cookie('numDecks')) > 0))
		$('.load.store').show(400, 'swing');
	else
		$('.load.store').hide(400, 'swing');
}
// ///////////////
// Deletes a deck from cookie and list
function localDeleteDeck(idx)
{
	// Delete it
	if (deleteDeckFromList(idx))
	{
		// Finally, update list: Hide window, update and show it again
		subviewStatus(0);
		updateDeckList();
		// Check if load button should be saved
		if (hayCookies && (parseInt($.cookie('numDecks')) > 0))
		{
			$('.load.store').show(400, 'swing');
			subviewStatus(3);
		} else {
			$('.load.store').hide(400, 'swing');
		}
	}
}
// ///////////////
function localLoadDeck(idx)
{
	// Get it from the list
	if (loadDeckFromList(idx))
	{
		// Show the new deck
		showDeckCore();
		// hide subviews
		subviewStatus(0);
	}
}
// ///////////////


// ///////////////// ///////////////// ///////////////// ///////////////
// Web controls stuff (subviews, etc)
// ///////////////
function refreshLocale(loc)
{
	var card;
	var card_name;
	var card_id;

	locale = loc;
	subviewStatus(0);

	$('.card').each(function(index, element) {
		card		= $(element);
		card_id		= card.attr('card_id');
		card_name	= g_hearthstone_cards[locale][card_id].name;
		$(card).attr('card_name', card_name);
		$(card).find('span.name').html(card_name);        
    });

	$('.localized').each(function(index, element) {
		$(element).html(texts[locale][$(element).attr('title')]);
    });
	
	$('#internname').val(texts[locale].deckname);
	
	// Help card locale swap
	var oldClass = (locale == "eses") ? "enus" : "eses";
	$("#flip_card").removeClass(oldClass);
	$("#flip_card").addClass(locale);
}
// ///////////////
// Show / Toggle Export to Internal Data controls
function saveDeck()
{
	// Toggle?
	var toggle = ($('#exportintern').css('display') != 'none') ? 0 : 4;
	subviewStatus(toggle);
}
// ///////////////
// Show / Toggle Import from Internal Data controls
function loadDeck()
{
	// Toggle?
	var toggle = ($('#importintern').css('display') != 'none') ? 0 : 3;
	subviewStatus(toggle);
}
// ///////////////
// Show / Toggle Import from HTML controls
function importFromHtml()
{
	// Toggle?
	var toggle = ($('#importhtml').css('display') != 'none') ? 0 : 2;
	subviewStatus(toggle);
}
// ///////////////
// Show / Toggle Import from URL controls
function importFromUrl()
{
	// Toggle?
	var toggle = ($('#importurl').css('display') != 'none') ? 0 : 1;
	subviewStatus(toggle);
}
// ///////////////
// Show/Hide subwindow
function subviewStatus(status)
{
	switch (status)
	{
		case 0: // hide all and reset text values
			$('#importhtml').hide(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#exportintern').hide(400, 'swing');
			$('#importintern').hide(400, 'swing');
			$('#internname').val(texts[locale].deckname);
			$('#deck_content').val('');
			$('#theurl').val('http://hearthhead.com/deckbuilder#....');
		break;
		case 1: // show import url
			$('#importhtml').hide(400, 'swing');
			$('#importurl').show(400, 'swing');
			$('#exportintern').hide(400, 'swing');
			$('#importintern').hide(400, 'swing');
		break;
		case 2: // show import html
			$('#importhtml').show(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#exportintern').hide(400, 'swing');
			$('#importintern').hide(400, 'swing');
		break;
		case 3: // show load window
			$('#importhtml').hide(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#exportintern').hide(400, 'swing');
			$('#importintern').show(400, 'swing');
		break;
		case 4: // show save window
			$('#importhtml').hide(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#exportintern').show(400, 'swing');
			$('#importintern').hide(400, 'swing');
		break;
	}
}
// ///////////////
// Show/Hide controls based on content
function visibleControls(active)
{
	if (active)
	{
		$('#toolbox').show(400, 'swing');
		$('.withcontent').show(400, 'swing');
		$('#holder').show(400, 'swing');
	} else {
		$('#toolbox').hide(400, 'swing');
		$('.withcontent').hide(400, 'swing');
		$('#holder').hide(400, 'swing');
	}
}
// ///////////////
function loadFromHTML()
{
	// Take HTML and create deck
	loadHTML();
	// Show it
	showDeckCore();
	// Toggle visibility of the subwindow
	importFromHtml();
	// Show store button
	$('.save.store').show(400, 'swing');
}
// ///////////////

// ///////////////
// Help stuff
// ///////////////
function showHelp()
{
	$('#help').show(200, 'linear');
}
// ///////////////
function hideHelp()
{
	$('#help').hide(200, 'linear');
}
// ///////////////

// ///////////////
// Flipper functions
function flipFront(e)
{
	var event = e || window.event;
	$(".flipbox").flippy({
    	duration: "400",
		depth: "7.5",
    	verso: "<div id=\"flip_card\" class=\"flip_middle " + locale + "\" onclick=\"flipMiddle(event);\"></div>"
 	});
	event.stopPropagation();
}
// ///////////////
function flipMiddle(e)
{
	var event = e || window.event;
	$(".flipbox").flippy({
    	duration: "400",
		depth: "7.5",
    	verso: "<div id=\"flip_card\" class=\"flip_back " + locale + "\" onclick=\"flipBack(event);\"></div>"
 	});
	event.stopPropagation();
}
// ///////////////
function flipBack(e)
{
	var event = e || window.event;
	$(".flipbox").flippy({
    	duration: "400",
		depth: "7.5",
    	verso: "<div id=\"flip_card\" class=\"flip_front " + locale + "\" onclick=\"flipFront(event);\"></div>"
 	});
	event.stopPropagation();
}
// ///////////////

// ///////////////// ///////////////// ///////////////// ///////////////
// Actions when page has been loaded
// ///////////////
var global_flipstatus = 0;
$(document).ready(function(e)
{
	// Init controls
	visibleControls(false);

	// Start tooltips for present elements
	$('.icon, .flag, .import, .store').bind('mouseenter', function(e) {
		if (typeof($(this).attr('title_' + locale)) != "undefined")
		{
			if ($('#tooltip').length > 0) $('#tooltip').remove();
			var tooltip = document.createElement('DIV');
			tooltip.id = 'tooltip';
    		$(tooltip).html($(this).attr('title_' + locale));
    		$(tooltip).css({
				"top" : $(this).offset().top + $(this).height(),
				"left" : $(this).offset().left
    		});
			$('body').append(tooltip);
		}
	});
	$('.icon, .flag, .import, .store').bind('mouseleave', function(){
		if ($('#tooltip').length > 0)
    		$('#tooltip').remove();
	});

	// For touchscreens, this will rotate buttons on click
	$('.icon, .flag, .import, .store').bind('touchstart', function(){
		this.classList.toggle('hover');
	});
	
	// Init subview contents
	$('#internname').val(texts[locale].deckname);
	
	// No saved decks? Don't show the load button
	if (!hayCookies) $('.load.store').hide();
	$('.save.store').hide();
	
	updateDeckList();
});
// ///////////////