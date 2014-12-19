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

g_hearthstone_heroes = { // Actualmente no se usan para nada más que el color del nombre del mazo, así que se indican aquí
	0: "neutral",
	1: "warrior",
	2: "paladin",
	3: "hunter",
	4: "rogue",
	5: "priest",
	6: "deathknight",
	7: "shaman",
	8: "mage",
	9: "warlock",
	10: "monk",
	11: "druid"
};

var preurl			= "http://wow.zamimg.com/images/hearthstone/cards/";
var card_size		= "/medium/";
var card_extension	= ".png";
var cardSetUrl		= "images/sets/";
var heroesUrl		= "images/heroes/";
var my_deck_cards	= [];
var my_deck_hero		= 0;
var my_deck_name		= texts[locale].unnamed;
// ///////////////

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
	var card_url = preurl + locale + card_size + card.image /* + ((ispremium(card)) ? "_premium" : "") */ + card_extension;
	// Get card set
	var cardset = cardSet[card.set];
	if (typeof(cardset) == "undefined") cardset = "";
	if (cardset != "")
		cardset = 'url("' + cardSetUrl + cardset + card_extension + '")';
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
	// Bind mousemove to show card as tooltip
	$(elem).bind('mouseleave', function(e) {
		if (typeof($('#tooltip_card')) != "undefined")
			$('#tooltip_card').remove();
	});
	// Bind mousemove to show card as tooltip
	$(elem).bind('mouseenter', function(e) {
		var tooltipX = $(this).width() + $(this).position().left + 4; // = e.pageX + 10; // <-- to move next to the pointer
		var tooltipY = e.pageY - 150;

		if (typeof($('#tooltip_card')) != "undefined")
			$('#tooltip_card').remove();

		var tooltip = document.createElement('img');
		$(tooltip).attr('id', 'tooltip_card');
		$(tooltip).attr('src', card_url);
		$(tooltip).appendTo('body');
		$(tooltip).css({ top: tooltipY, left: tooltipX });
		$(tooltip).delay(500).fadeIn();
	});
	// Bind mousemove to show card as tooltip
	$(elem).bind('mousemove', function(e) {
		var tooltipX = $(this).width() + $(this).position().left + 4; // = e.pageX + 10; // <-- to move next to the pointer
		var tooltipY = e.pageY - 150;

		$('#tooltip_card').css({ top: tooltipY, left: tooltipX });
	});
	// Bind mousedown to pick card
	$(elem).bind('mousedown', function(e) { pickCard(e, this); });
	// Bind swipe for touch devices
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
	// Disable right click menu
	$(elem).bind('contextmenu', function(e) { return false; }); 
	// Create card elements: card name
	$(elem).append(anItem('span', 'name ' + g_hearthstone_qualities[card.quality], card.name, cardset));
	// card background
	$(elem).append(anItem('span', 'bg', '', 'url(' + card_url + ')'));
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
	var card_id		 = $(card).attr('card_id');
	var card_count	 = parseInt($(card).attr('card_count'));
	var card_quality	 = parseInt($(card).attr('card_quality'));
	var card_cost	 = parseInt($(card).attr('card_cost'));
	var card_name	 = $(card).attr('card_name');

	if (card_count == 0) return;
	card_count--;
	cardCounterDraw();
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
	var card_id		 = $(card).attr('card_id');
	var card_count	 = parseInt($(card).attr('card_count'));
	var card_quality	 = parseInt($(card).attr('card_quality'));
	var card_cost	 = parseInt($(card).attr('card_cost'));
	var card_name	 = $(card).attr('card_name');

	if ((card_count == 2) || ((card_count == 1) && (card_quality == 5))) return;
	card_count++;
	cardCounterRestore();
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
	var card			 = $('#card_' + card_id);
	var card_count	 = parseInt($(card).attr('card_count'));
	var card_quality = parseInt($(card).attr('card_quality'));
	var card_cost	 = parseInt($(card).attr('card_cost'));
	var card_name	 = g_hearthstone_cards[locale][card_id].name;

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
// Card counter stuff
// ///////////////
function cardCounterShow() { $('#card_counter').show(250); }
function cardCounterHide() { $('#card_counter').hide(); }
function cardCounterSet(cards) { $('#cards_total').text(cards); }
function cardCounterRemain(cards)
{
	// Assign color according to quantity
	var theClass = "zero";
	var total = parseInt($('#cards_total').text());
	if (cards > 0) theClass = "few";
	if (cards > 0.3333*total) theClass = "middle";
	if (cards > 0.6666*total) theClass = "many";
	$('#cards_remain').removeClass().addClass(theClass);
	// Set card number
	$('#cards_remain').text(cards);
}
function cardCounterReset()
{
	var total = 0;
	var remain = 0;
	if (my_deck_cards.length != 0)
	{
		for (var idx in my_deck_cards)
			total = total + parseInt(my_deck_cards[idx].count);
		remain = total;
	}
	cardCounterSet(total);
	cardCounterRemain(remain);

	if (my_deck_cards.length != 0)
		cardCounterShow();
	else
		cardCounterHide();
}
function cardCounterDraw()
{
	var remain = parseInt($('#cards_remain').text());
	if (remain > 0)
		cardCounterRemain(remain - 1);
}
function cardCounterRestore()
{
	var remain = parseInt($('#cards_remain').text());
	var total = parseInt($('#cards_total').text());
	if (remain < total)
		cardCounterRemain(remain + 1);
}

// ///////////////// ///////////////// ///////////////// ///////////////
// Deck Stuff
// ///////////////
// Deck functions
// ///////////////
function showDeckCore()
{
	// If no deck, finish here
	if (my_deck_cards.length == 0) return;
	// Delete previous deck
	visibleControls(false);
	$("#deck > li").remove();
	// Add hero
	var hero_id = g_hearthstone_classes[locale][my_deck_hero].card_id;
	var hero_image = g_hearthstone_cards[locale][hero_id].image;

	var card_url = preurl + locale + card_size + hero_image + /* ((ispremium(card)) ? "_premium" : "") + */ card_extension;
	$('#deck_class').css('background-image', 'url(' + card_url+ ')');
	// Put deck name, fit to area
	$('#deck_name').attr('class', g_hearthstone_heroes[my_deck_hero]);
	$('#deck_name').html(my_deck_name);
	$('#deck_name').fitname();
	// Add one by one
	for (var idx = 0; idx < my_deck_cards.length; idx++)
	{
		addCard(my_deck_cards[idx].card);
		if (my_deck_cards[idx].count == 2)
			addCard(my_deck_cards[idx].card);
	}
	// Show controls
	visibleControls(true);
	// Reset card counter
	cardCounterReset();

}
// ///////////////
function restoreDeck()
{
	for (var idx = 0; idx < my_deck_cards.length; idx++)
	{
		restoreCard(my_deck_cards[idx].card);
	}
	cardCounterReset();
}
// ///////////////
function deleteDeck()
{
	visibleControls(false);
	$("#deck > li").remove();
	// Remove internal data
	if (my_deck_cards.length > 0)
		my_deck_cards.splice(0, my_deck_cards.length);
	cardCounterReset();
}
// ///////////////

// ///////////////
// Import deck from HearthHead URL
function loadFromUrl()
{
	// If using default name, error
	if (($('#internnameurl').val() == texts[locale].deckname) || ($('#internnameurl').val() == ""))
	{
		alert(texts[locale].givedeckname);
		return;
	}

	var url = $('#theurl').val();

	var result = loadFromHearthHeadUrl(url);
	if (result == null)
	{
		alert(texts[locale].urlimporterror);
		return null;
	}

	// Delete previous deck
	if (my_deck_cards.length > 0)
		my_deck_cards.splice(0, my_deck_cards.length);

	// Get name from textbox
	my_deck_name = $('#internnameurl').val();

	// And deck data (hero and cards) from url
	my_deck_hero = result.hero;
	my_deck_cards = fullCopy(result.cards);

	// Show new deck
	showDeckCore();

	// Hide subview
	importFromUrl();

	// Show save button
	$('.save.store').show(400, 'swing');
}
// ///////////////
// Auxiliary: Create a html item for a deck
// Use: createDeckLine(deck index)
function createDeckLine(idx)
{
	// Check if valid value
	if (idx >= jDecks.length)
		return;
	// Take deck name
	var name = jDecks[idx].name;
	var heroname = g_hearthstone_heroes[jDecks[idx].hero];

	// Create line holder
	var elem = document.createElement('li');
	$(elem).attr('id', 'deck_' + idx);
	$(elem).attr('class', 'deckline ' + heroname);
	// Get Deck max. expansion for line background
	var deckMaxSet = getDeckSet(idx);	
	$(elem).css('backgroundImage', 'url("' + cardSetUrl + 'bg_' + deckMaxSet + card_extension + '")');

	$(elem).bind('mousemove', function() { $(this).removeClass('lineoff').addClass('lineon'); });
	$(elem).bind('mouseout', function() { $(this).removeClass('lineon').addClass('lineoff'); });
	$(elem).bind('click', function() { localLoadDeck(idx); });

	// Deck class icon
	var aSpan = document.createElement('span');
	$(aSpan).attr('class', 'classicon');
	$(aSpan).css('backgroundImage', 'url("' + heroesUrl + heroname + card_extension + '")');
	$(elem).append(aSpan);

	// Deck name text
	var aSpan = document.createElement('span');
	$(aSpan).attr('class', 'decklinename ' + heroname);
	$(aSpan).html(name);
	$(aSpan).fitname();
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
	var deckCount = (jDecks == null) ? 0 : jDecks.length;
	
	// Sort decks
	if (deckCount > 0)
		sortDecks();

	// For each one, add to deck list container
	for (var idx = 0; idx < deckCount; idx++)
		$(container).append(createDeckLine(idx));

	// For each one, add to deck list container
	// Finally, show status message
	if (deckCount == 0)
	{
		$('#deckliststatus').attr('title', 'emptydecklist');
		$('#deckliststatus').html(texts[locale].emptydecklist);
	} else {
		$('#deckliststatus').attr('title', 'loaddeckmsg');
		$('#deckliststatus').html(texts[locale].loaddeckmsg);
	}
}
// ///////////////
function addDeck2List(deckName)
{
	my_deck_name = deckName;

	$('#deck_name').html(my_deck_name);
	$('#deck_name').fitname();
	
	addADeck(deckName, my_deck_hero, my_deck_cards);
	updateDeckList();
}
// ///////////////
function deleteDeckFromList(idx)
{
	var result = deleteADeck(idx);
	if (result)
		updateDeckList();
	return result;
}
// ///////////////
// retrieves a deck from list
function loadDeckFromList(idx)
{
	var result = true;
	// Check if idx and values are ok
	if ((idx < 0) || (idx > jDecks.length))
	{
		alert(texts[locale].errornodeck);
		result = false;
	} else if (typeof(jDecks[idx].name) == "undefined") {
		alert(texts[locale].errornoname);
		result = false;
	} else if (typeof(jDecks[idx].hero) == "undefined") {
		alert(texts[locale].errornohero);
		result = false;
	} else if (typeof(jDecks[idx].cards) == "undefined") {
		alert(texts[locale].errornocards);
		result = false;
	}

	if (result)
	{
		// Delete previous deck
		if (my_deck_cards.length > 0)
			my_deck_cards.splice(0, my_deck_cards.length);
		// Load hero and deck from list
		my_deck_cards = fullCopy(jDecks[idx].cards);
		my_deck_hero = parseInt(jDecks[idx].hero);
		my_deck_name = jDecks[idx].name;
	}
	return result;
}
// ///////////////
// Store deck on list with given name
function localSaveDeck()
{
	// Oke. Take new name and store deck with it
	addDeck2List(my_deck_name);
	// Warn about success
	alert(texts[locale].decksaved);
	// Hide save button
	$('.save.store').hide(400, 'swing');
	// Check if load button should be visible
	if (jDecks.length > 0)
		$('.load.store').show(400, 'swing');
	else
		$('.load.store').hide(400, 'swing');
	// Hide list window if necessary
	// subviewStatus(0);
}
// ///////////////
// Deletes a deck from lists
function localDeleteDeck(idx)
{
	// If delete actual one, show again button
	var name = jDecks[idx].name;
	// Delete it
	if (deleteDeckFromList(idx))
	{
		// Show store button if necessary
		if (name == my_deck_name)
			$('.save.store').show(400, 'swing');
		// Finally, update list: Hide window, update and show it again
		subviewStatus(0);
		// Check if load button should be saved
		if (jDecks.length > 0)
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

	$('#internnameurl').val(texts[locale].deckname);
	$('#internnamehtml').val(texts[locale].deckname);
	
	// Help card locale swap
	var oldClass = (locale == "eses") ? "enus" : "eses";
	$("#flip_card").removeClass(oldClass);
	$("#flip_card").addClass(locale);
	
	// Card counter
	$('#counter_text').text(texts[locale].cardcounter);
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
			$('#importintern').hide(400, 'swing');
			$('#internnameurl').val(texts[locale].deckname);
			$('#internnamehtml').val(texts[locale].deckname);
			$('#deck_content').val('');
			$('#theurl').val('http://hearthhead.com/deckbuilder#....');
		break;
		case 1: // show import url
			$('#importhtml').hide(400, 'swing');
			$('#importurl').show(400, 'swing');
			$('#importintern').hide(400, 'swing');
		break;
		case 2: // show import html
			$('#importhtml').show(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#importintern').hide(400, 'swing');
		break;
		case 3: // show load window
			$('#importhtml').hide(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#importintern').show(400, 'swing');
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
		$('.save.store').hide();
	}
}

// ///////////////// ///////////////// ///////////////// ///////////////
// Import/Export stuff
// ///////////////
function loadFromHTML()
{
	// If using default name, error
	if (($('#internnamehtml').val() == texts[locale].deckname) ||  ($('#internnamehtml').val() == ""))
	{
		alert(texts[locale].givedeckname);
		return;
	}

	// Take HTML and create deck	
	var result = loadHearthHeadHTML($('#deck_content').val());
	if (result == null)
	{
		alert(texts[locale].urlimporterror);
		return null;
	}

	// Delete previous deck if necessary
	if (my_deck_cards.length > 0)
		my_deck_cards.splice(0, my_deck_cards.length);

	// Get deck name, hero and cards from html result
	my_deck_name  = result.name;
	my_deck_hero  = result.hero;
	my_deck_cards = fullCopy(result.cards);

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
	$('#internnameurl').val(texts[locale].deckname);
	$('#internnamehtml').val(texts[locale].deckname);
	
	// Get decks from storage
	retrieveDecksFromStore();

	// No saved decks? Don't show the load button
	if ((jDecks == null) || (jDecks.length == 0))
		$('.load.store').hide();

	// Update list from retrieved decks
	updateDeckList();
	
	// Reset counter
	cardCounterReset()
	
	// Assign current locale
	refreshLocale(locale);
});
// ///////////////