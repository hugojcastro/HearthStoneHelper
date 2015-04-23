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
var locale          = 'eses';
var storageDecks    = 'HSHelperDecks'; // name for deck storage (cookie or localStorage)
var storageLocale   = 'HSHelperLocale'; // name for locale storage (cookie or localStorage)
var hearthheadurl	= 'http://wow.zamimg.com/images/hearthstone/cards/'; // Old, to get cards from hearthhead
var preurl			= 'images/cards/';
var card_extension	= '.png';
var helpUrl         = 'images/help/';
var cardSetUrl		= 'images/sets/';
var heroesUrl		= 'images/heroes/';
var hs_quality      = [ 'soulbound', 'common', 'common', 'rare', 'epic', 'legendary' ]; // Only used for css text colors, so no translation needed
var cardSet         = { 3: 'classic', 12: 'naxx', 13: 'gvg', 14: 'brm' }; // Array of expansion names
var jDecks          = []; // Array of custom decks
var my_deck_cards	= [];
var my_deck_hero	    = 0;
var my_deck_name	    = texts[locale].unnamed;
var my_deck_isarena = false;
var allLocales      = [ 'dede', 'engb', 'enus', 'eses', 'esla', 'frfr', 'itit', 'kokr', 'plpl', 'ptbr', 'ptpt', 'ruru', 'zhcn', 'zhtw' ];
// I'll use this trick to save space for same cards pictures
// As I'll use google translator for locale_xxxx.js files, 'similarLocale' will be used when loading pictures only, to avoid non existent folders for them
var similarLocale  = { 'esla': 'eses', 'ptpt': 'ptbr', 'zhtw': 'zhcn', 'engb':'enus' };
// ///////////////// ///////////////// ///////////////// ///////////////
// Aux to get card url (from local or hearthhead)
function getCardUrl(locale, card_image)
{
	var loc = (typeof(similarLocale[locale]) != "undefined") ? similarLocale[locale] : locale;
	return ( preurl + loc + '/' + card_image + card_extension);
}
// ///////////////
// Aux to get quality from card
function getQualityFromCard( cardid )
{
	if ( typeof( hs_cards['enus'][cardid].quality != 'undefined' ) )
		return hs_cards['enus'][cardid].quality;
	return 0;
}
// ///////////////
// Aux to get hero from card (if linked to class, 0 otherwise)
function getHeroFromCard( cardid )
{
	if ( typeof( hs_cards['enus'][cardid].classs != 'undefined' ) )
		return hs_cards['enus'][cardid].classs;
	return 0;
}
// ///////////////
// Aux to get card id from name using a locale
function getCardIdFromName(locale, name)
{
	// Get rid of types and foreigner chars
	var lname = name.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-');
	var ghc = hs_cards[locale];

	for (var idx in ghc)
		if (ghc[idx].name.toLowerCase() == lname)
		{
			// Avoid 'choose one' cards
			var letter = ghc[idx].image.substr(ghc[idx].image.length - 1);
			if ((letter != 'a') && (letter != 'b'))
				return ghc[idx].id;
		}
	// For some reason, non utf-8 cards will give bad search results; so, let's use decodeURI over their foreighn chars to avoid it
	try {
		lname = decodeURI(escape(name)).toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-');
		for (var idx in ghc)
			if (ghc[idx].name.toLowerCase() == lname)
			{
				// Avoid 'choose one' cards
				var letter = ghc[idx].image.substr(ghc[idx].image.length - 1);
				if ((letter != 'a') && (letter != 'b'))
					return ghc[idx].id;
			}
	} catch(err) {}

	return -1;
}
// ///////////////
// Aux to get card id from name and cost
function getCardIdFromNameCost(locale, name, cost)
{
	// Get rid of types and foreigner chars
	var nam = name.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-');
	var ost = parseInt(cost);

	for (var idx in hs_cards[locale])
		if ((hs_cards[locale][idx].name.toLowerCase() == nam) && (hs_cards[locale][idx].cost == ost))
			return hs_cards[locale][idx].id;
	// For some reason, non utf-8 cards will give bad search results; so, let's use decodeURI over their foreighn chars to avoid it
	try {
		nam = decodeURI(escape(name)).toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-');
	for (var idx in hs_cards[locale])
		if ((hs_cards[locale][idx].name.toLowerCase() == nam) && (hs_cards[locale][idx].cost == ost))
			return hs_cards[locale][idx].id;
	} catch (err) {}

	return -1;
}
// ///////////////
// Aux to get hero value from its name
function getHeroClassFromName(localeorname, name)
{
	var locale;
	var nam = '';

	if (typeof(name) == "undefined")
	{
		locale = 'enus';
		nam = localeorname.toLowerCase();
	} else {
		locale = localeorname;
		nam = name.toLowerCase();
	}

	for (var idx in factions[locale])
		if (factions[locale][idx] == nam)
			return idx;
	// For some reason, non utf-8 cards will give bad search results; so, let's use decodeURI over their foreighn chars to avoid it
	if (typeof(name) == "undefined")
	{
		locale = 'enus';
		nam = localeorname;
	} else {
		locale = localeorname;
		nam = name;
	}

	for (var idx in factions[locale])
		if (factions[locale][idx] == nam)
			return idx;

	return 0;
}
// ///////////////
// Aux to get card id from its image name
function getCardIdFromImage(img)
{
	var cards = hs_cards[locale];
	var theImg = img.toLowerCase().trim();

	for (var idx in cards)
		if (cards[idx].image.toLowerCase() == theImg)
			return cards[idx].id;
}
// ///////////////// ///////////////// ///////////////// ///////////////
// To sort deck names
function sortDecks( aDeck )
{
	if ( aDeck )
		aDeck.sort(
			function( elem1, elem2 )
			{
				var hero1 = parseInt( elem1.hero );
				var hero2 = parseInt( elem2.hero );
				if ( hero1 > hero2 ) return 1;
				if ( hero1 < hero2 ) return -1;
				return elem1.name.localeCompare( elem2.name );
			}
		);
}
// ///////////////// ///////////////// ///////////////// ///////////////
// Aux to get max. set card from a deck (i.e. classic, naxx, GvG...)
function getDeckSet( cards )
{
	var result = 'classic';
	var maxExpFound = 0;

	// check each card on deck for max value
	for ( var aCard in cards )
		if ( hs_cards[locale][cards[aCard].card].set > maxExpFound )
			maxExpFound = hs_cards[locale][cards[aCard].card].set;

	if (( typeof( cardSet[maxExpFound] ) != "undefined" ) && ( cardSet[maxExpFound] != "" ))
		result = cardSet[maxExpFound];

	return result;
}
// ///////////////// ///////////////// ///////////////// ///////////////
// Delete a deck from the arrays
function deleteADeck( decks, idx )
{
	if (( idx >= 0 ) && ( idx < decks.length ))
	{
		decks.splice( idx, 1 );
		storeOnStorage( decks, storageDecks );
		return true;
	}

	return false;
}
// ///////////////// ///////////////// ///////////////// ///////////////
// Add a deck to array
function addADeck( decks, name, hero, cards, isarena )
{
	var idx = ( decks == null ) ? 0 : decks.length;
	decks[idx] = { name: name, hero: hero, cards: fullCopy( cards ), isarena: isarena };
	storeOnStorage( decks, storageDecks );
}
// ///////////////// ///////////////// ///////////////// ///////////////

// ///////////////
// Spinner stuff (waiting animation)
function showSpinner()
{
	$('#spinner').show();
}
function hideSpinner()
{
	$('#spinner').hide();
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
			maxFont   : 24,
			minFont   : 8,
			fontRatio : 20
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

// ///////////////// ///////////////// ///////////////// ///////////////
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
// Use: createCard(hs_cards card)
function createCard( card )
{
	var card_image = card.image;
	// Get card background (always local, because no text is shown)
	var card_url = getCardUrl('eses', card_image);
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
		var tooltipY = e.pageY - 75;

		if (typeof($('#tooltip_card')) != "undefined")
			$('#tooltip_card').remove();

		var tooltip = document.createElement('img');
		$(tooltip).attr('id', 'tooltip_card');
		var cardpicture = getCardUrl(locale, card_image);
		$(tooltip).attr('src', cardpicture);
		$(tooltip).appendTo('body');
		$(tooltip).css({ top: tooltipY, left: tooltipX });
		$(tooltip).delay(500).fadeIn();
	});
	// Bind mousemove to show card as tooltip
	$(elem).bind('mousemove', function(e) {
		var tooltipX = $(this).width() + $(this).position().left + 4; // = e.pageX + 10; // <-- to move next to the pointer
		var tooltipY = e.pageY - 75;

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
	$(elem).append(anItem('span', 'name ' + hs_quality[card.quality], card.name, cardset));
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
	if (typeof(hs_cards[locale][card_id]) == "undefined")
	{
		$.simplyToast(texts[locale].cardnotfound, 'danger');
		return;
	}
	// Get deck from page
	var deck = $('#deck');
	// Get card as single object
	var card = hs_cards[locale][card_id];
	// Check if card on deck
	if ($('#card_' + card.id).length > 0)
	{
		// Does it is? Take card count
		var theItem = $('#card_' + card.id);
		var count = parseInt(theItem.attr('card_count'));
		// Does it is 2? Error and exit
		if ((!my_deck_isarena) && (count == 2))
		{
			$.simplyToast(texts[locale].onlytwo + theItem.attr('card_name') + "'!", 'danger');
			return;
		}
		// Does it is 1 and legendary? Error and exit
		var kind = parseInt(theItem.attr('card_quality'));
		if ((!my_deck_isarena) && ((count == 1) && (kind == 5)))
		{
			$.simplyToast(texts[locale].onlyone + theItem.attr('card_name') + "'!", 'danger');
			return;
		}
		// All is Ok? Inc it and exit
		count++;
		theItem.attr('card_count', count);
		theItem.find('span.count').html(count);
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
	var card_quality = parseInt($(card).attr('card_quality'));
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
	var card_quality = parseInt($(card).attr('card_quality'));
	var card_cost	 = parseInt($(card).attr('card_cost'));
	var card_name	 = $(card).attr('card_name');

	if ((!my_deck_isarena) && ((card_count == 2) || ((card_count == 1) && (card_quality == 5)))) return;

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
	var card	         = $('#card_' + card_id);
	var card_count	 = parseInt($(card).attr('card_count'));
	var card_quality = parseInt($(card).attr('card_quality'));
	var card_cost	 = parseInt($(card).attr('card_cost'));
	var card_name	 = hs_cards[locale][card_id].name;

	if ((!my_deck_isarena) && ((card_count == 2) || ((card_count == 1) && (card_quality == 5)))) return;

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

	// Hide subwindows
	subviewStatus(0);
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
	var card_url = heroesUrl + 'hero' + my_deck_hero + '.jpg';
	var count;

	$('#deck_class').css('background-image', 'url(' + card_url+ ')');
	// Put deck name, fit to area
	$('#deck_name').attr('class', factions['enus'][my_deck_hero]);
	$('#deck_name').val(my_deck_name);
	$('#deck_name').fitname();
	// Add one by one
	for (var idx = 0; idx < my_deck_cards.length; idx++)
	{
		count = my_deck_cards[idx].count;
		while (count--)
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
	my_deck_hero	= 0;
	my_deck_name	= texts[locale].unnamed;
	my_deck_isarena = false;

	cardCounterReset();
}
// ///////////////
// Auxiliary: Create a html item for a deck
// Use: createDeckLine( source deck, deck index )
function createDeckLine( deck, idx, candelete )
{
	// Check if valid value
	if ( idx >= deck.length )
		return;

	// Do unique IDs
	var midId = ( deck == jDecks ) ? 'custom_' : 'basic_';

	// check if deck can be deleted
	var allowdel = ( typeof( candelete ) == 'undefined' ) ? true : candelete;

	// Take deck name
	var name = deck[idx].name;
	var heroname = factions['enus'][deck[idx].hero];

	// Create line holder
	var elem = document.createElement('li');
	$(elem).attr('id', 'deck_' + midId + idx);
	$(elem).attr('class', 'deckline ' + heroname);
	// Get Deck max. expansion for line background
	var deckMaxSet = getDeckSet( deck[idx].cards );
	$(elem).css('backgroundImage', 'url("' + cardSetUrl + 'bg_' + deckMaxSet + card_extension + '")');

	$(elem).bind('mousemove', function() { $(this).removeClass('lineoff').addClass('lineon'); });
	$(elem).bind('mouseout', function() { $(this).removeClass('lineon').addClass('lineoff'); });
	$(elem).bind('click', function() {
		// Get it from the list
		if ( loadDeckFromList( deck, idx ) )
		{
			// Show the new deck
			showDeckCore();
			// hide subviews
			subviewStatus(0);
		}
	});

	// Deck class icon
	var aSpan = document.createElement('span');
	$(aSpan).attr('class', 'classicon');
	$(aSpan).css('backgroundImage', 'url("' + heroesUrl + heroname + card_extension + '")');
	$(elem).append( aSpan );

	// Deck name text
	var aSpan = document.createElement('span');
	$(aSpan).attr('class', 'decklinename ' + heroname);
	$(aSpan).html(name);
	$(aSpan).fitname();
	$(elem).append(aSpan);

	// Delete button
	if ( allowdel )
	{
		aSpan = document.createElement('span');
		$(aSpan).attr('class', 'store delete');
		$(aSpan).attr('title', 'Borrar Mazo');
		$(aSpan).attr('title_eses', 'Borrar Mazo');
		$(aSpan).attr('title_enus', 'Delete Deck');
		$(aSpan).bind('click', function(){

			// If delete actual one, show again button
			var name = deck[idx].name;
			// Delete it
			if ( deleteDeckFromList( deck, idx ) )
			{
				// Show store button if necessary
				if ( name == my_deck_name )
					$('.save.store').show( 400, 'swing' );
				// Finally, update list: Hide window, update and show it again
				subviewStatus( 0 );
				// Check if load button should be saved
				if ( deck.length > 0 )
				{
					$( '.load.store' ).show( 400, 'swing' );
					$( '.put.store' ).show( 400, 'swing' );
					subviewStatus( 3 );
				} else {
					$( '.load.store' ).hide( 400, 'swing' );
					$( '.put.store' ).hide( 400, 'swing' );
				}
			}

			while ( $( '#tooltip' ).length > 0 )
    			$( '#tooltip' ).remove();
		});
	}

	$(aSpan).mouseenter(function(e){
		if (typeof($(this).attr('title_' + locale)) != "undefined")
		{
			var tooltip = document.createElement('DIV');
			tooltip.id = 'tooltip';
    		$(tooltip).html($(this).attr('title_' + locale));
    		$(tooltip).css({
				"top" : $(this).offset().top + $(this).height() - $(document).scrollTop(),
				"left" : $(this).offset().left
    		});
			$('body').append(tooltip);
		}
	});

	$( aSpan ).mouseleave( function(){
		while ( $( '#tooltip' ).length > 0)
    		$( '#tooltip' ).remove();
	});

	$( elem ).append( aSpan );
	// return new line
	return elem;
}
// ///////////////
function updateDeckList( deck )
{
	// Take custom decks by default
	var dList     = $( '#importinterncontent > li' );
	var container = $( '#importinterncontent' );
	var deckCount = ( jDecks == null ) ? 0 : jDecks.length;
	var candelete = true;

	if ( deck == jBasicDecks ) {
		dList     = $( '#importbasiccontent > li' );
		container = $('#importbasiccontent');
		deckCount = jBasicDecks.length;
		candelete = false;
	} else if ( deck != jDecks ) {
		$.simplyToast( 'uh oh!', 'danger' );
		return;
	}

	// Clear container
	dList.remove();
	
	// Sort decks
	if ( deckCount > 0 )
		sortDecks( deck );

	// For each one, add to deck list container
	for (var idx = 0; idx < deckCount; idx++ )
		$( container ).append( createDeckLine( deck, idx, candelete ) );

	// Basic decks? finish
	if ( deck == jBasicDecks )
		return;

	// Finally, show status message
	if ( deckCount == 0 )
	{
		$( '#deckliststatus' ).attr('title', 'emptydecklist');
		$( '#deckliststatus' ).html(texts[locale].emptydecklist);
	} else {
		$( '#deckliststatus' ).attr('title', 'loaddeckmsg');
		$( '#deckliststatus' ).html(texts[locale].loaddeckmsg);
	}
}
// ///////////////
function addDeck2List(deckName)
{
	my_deck_name = deckName;

	$('#deck_name').val(my_deck_name);
	$('#deck_name').fitname();
	
	addADeck(jDecks, deckName, my_deck_hero, my_deck_cards, my_deck_isarena);
	updateDeckList( jDecks );
}
// ///////////////
function deleteDeckFromList( deck, idx )
{
	var result = deleteADeck( deck, idx);
	if ( result )
		updateDeckList( deck );
	return result;
}
// ///////////////
// retrieves a deck from list
function loadDeckFromList( deck, idx )
{
	var result = true;
	// Check if idx and values are ok
	if (( idx < 0 ) || ( idx > deck.length ))
	{
		$.simplyToast( texts[locale].errornodeck, 'danger' );
		result = false;
	} else if ( typeof(deck[idx].name ) == "undefined" ) {
		$.simplyToast( texts[locale].errornoname, 'danger' );
		result = false;
	} else if ( typeof( deck[idx].hero ) == "undefined" ) {
		$.simplyToast( texts[locale].errornohero, 'danger' );
		result = false;
	} else if ( typeof(deck[idx].cards) == "undefined" ) {
		$.simplyToast( texts[locale].errornocards, 'danger' );
		result = false;
	}

	if ( result )
	{
		// Delete previous deck
		if ( my_deck_cards.length > 0 )
			my_deck_cards.splice( 0, my_deck_cards.length );
		// Load hero and deck from list
		my_deck_cards = fullCopy( deck[idx].cards );
		my_deck_hero = parseInt( deck[idx].hero );
		my_deck_name = deck[idx].name;
		my_deck_isarena = ( typeof( deck[idx].isarena ) == "undefined" ) ? false : deck[idx].isarena;
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
	$.simplyToast(texts[locale].decksaved, 'success');
	// Hide save button
	$('.save.store').hide(400, 'swing');
	// Check if load button should be visible
	if (jDecks.length > 0)
	{
		$('.load.store').show(400, 'swing');
		$('.put.store').show(400, 'swing');
	} else {
		$('.load.store').hide(400, 'swing');
		$('.put.store').hide(400, 'swing');
	}
}
// ///////////////
// Retrieve all decks from json archive; Show / Toggle Import all decks
function getDecks()
{
	// Toggle?
	var toggle = ($('#importdecks').css('display') != 'none') ? 7 : 5;
	subviewStatus(toggle);
}
// ///////////////
// Store all decks in json archive
function exportAllDecks()
{
	// Get file name
	var filename = $('#jsonfilename').val();
	if ((filename == '') || (filename == texts[locale].jsonfilename))
	{
		$.simplyToast(texts[locale].jsonerror, 'danger');
		return;
	}
	// Check for extension
	if (filename.indexOf('.') == -1)
		filename += '.deck.json';

	// Get text
	var text = JSON.stringify(jDecks);
	if (text == '')
	{
		$.simplyToast(texts[locale].noexporterror, 'danger');
		return;
	}

	// finally, save deck data
	var result = downloadFile(text, filename, 'application/json');

	// Warn if something gone wrong
	if (!result)
		$.simplyToast(texts[locale].jsonexporterror, 'danger');

	// Hide window
	subviewStatus(0);
}
// ///////////////
// This only will work with latest browsers
function importAllDecks(e)
{
	// Get first pointed file. If none, finish.
	var file = e.target.files[0];
	if (!file) return;

	// Let's read the file. As soon as it's readed (onload), do the magic
	var reader = new FileReader();
	reader.onload = function(e)
	{
		// Get file contents (all decks in json format)
		var contents = e.target.result;
		try
		{
			// Import decks: exception will throw on errors
			var newDecks = JSON.parse(contents);
			var dName = '';
			var deckDupped;

			// Check each deck to avoid duplicates
			var nDecks = jDecks.length;
			var isarena;
			for (var i = 0; i < newDecks.length; i++)
			{
				deckDupped = false;
				dName = newDecks[i].name.toLowerCase();
				// search for duplicated deck. We'll assume there aren't dupped decks in imported list
				// so we can check each one with the actual list, avoiding the new ones added at the end 
				for (var j = 0; j < nDecks; j++)
					if (
						(dName == jDecks[j].name.toLowerCase()) && 
						(newDecks[i].cards.length == jDecks[j].cards.length) && 
						(newDecks[i].hero == jDecks[j].hero)
					) deckDupped = true;

				// Found a valid one... copy it
				isarena = (typeof(newDecks[i].isarena) == "undefined") ? false : newDecks[i].isarena;
				if (!deckDupped)
					addADeck(jDecks, newDecks[i].name, newDecks[i].hero, newDecks[i].cards, isarena);
			}

			// Show buttons if needed
			// No saved decks? Don't show the load button
			if ((jDecks == null) || (jDecks.length == 0))
			{
				$('.load.store').hide();
				$('.put.store').hide();
			} else {
				$('.load.store').show(400, 'swing');
				$('.put.store').show(400, 'swing');
			}

			// Update and sort list from retrieved decks
			updateDeckList( jDecks );

		} catch(exception) {
			$.simplyToast(texts[locale].errorbadimport, 'danger');
		}
	};

	reader.readAsText(file);

	// Hide window
	subviewStatus(0);
}
// ///////////////

// ///////////////// ///////////////// ///////////////// ///////////////
// Web controls stuff (subviews, etc)
// ///////////////
function toggleFlags()
{
	var toggle = ($('#flagsfolder').css('display') != 'none') ? 0 : 8;
	subviewStatus(toggle);
}
// ///////////////
function refreshLocale(loc)
{
	var card;
	var card_name;
	var card_id;

	// Update flag button
	$('#flagbutton').removeClass(locale);
	$('#flagbutton').addClass(loc);
	$('#flagbutton').attr('data-localized', 'locale' + loc);

	for (var idx in allLocales)
		$('#flagbutton').attr('title_' + allLocales[idx], $('.' + loc + '.flag').attr('title_' + allLocales[idx]));

	$('#flagbutton').attr('title', $('.' + loc + '.flag').attr('title_' + loc));

	// Reset name (just in case)
	if (my_deck_name == texts[locale].unnamed)
		my_deck_name = texts[loc].unnamed;

	// Store new locale
	locale = loc;

	// Hide windows and do stuff
	subviewStatus(0);

	$('.card').each(function(index, element) {
		card		= $(element);
		card_id		= card.attr('card_id');
		card_name	= hs_cards[locale][card_id].name;
		$(card).attr('card_name', card_name);
		$(card).find('span.name').html(card_name);        
    });

	$('.localized').each(function(index, element) {
		$(element).html(texts[locale][$(element).attr('title')]);
    });

	$('#theurl').val(texts[locale].deckurl);

	// Help card locale swap
	updateFlipLocale(locale);

	// Card counter
	$('#counter_text').text(texts[locale].cardcounter);

	// store new locale
	storeOnStorage(locale, storageLocale);
}
// ///////////////
// Show / Toggle import folder
function toggleImportFolder()
{
	var toggle = ($('#importfolder').css('display') != 'none') ? 0 : 6;
	subviewStatus(toggle);
}
// Show / Toggle storage folder
function toggleStoreFolder()
{
	var toggle = ($('#storefolder').css('display') != 'none') ? 0 : 7;
	subviewStatus(toggle);
}
// Show / Toggle Import from Internal Data controls
function loadDeck()
{
	// Toggle?
	var toggle = ($('#importintern').css('display') != 'none') ? 0 : 3;
	subviewStatus(toggle);
}
// Show / Toggle Import from Basic Decks
function loadBasicDeck()
{
	// Toggle?
	var toggle = ($('#importbasic').css('display') != 'none') ? 0 : 9;
	subviewStatus(toggle);
}
// ///////////////
// Show / Toggle Import from HTML controls
function importFromHtml()
{
	// Toggle?
	var toggle = ($('#importhtml').css('display') != 'none') ? 6 : 2;
	subviewStatus(toggle);
}
// ///////////////
// Show / Toggle Import from URL controls
function importFromUrl()
{
	// Toggle?
	var toggle = ($('#importurl').css('display') != 'none') ? 6 : 1;
	subviewStatus(toggle);
}
// ///////////////
// Show / Toggle Export all decks
function putDecks()
{
	// Toggle?
	var toggle = ($('#exportdecks').css('display') != 'none') ? 7 : 4;
	subviewStatus(toggle);
}
// ///////////////
// Show/Hide subwindow
function subviewStatus(status)
{
	switch (status)
	{
		default:
		case 0: // hide all and reset text values
			$('#importhtml').hide(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#importintern').hide(400, 'swing');
			$('#importbasic').hide(400, 'swing');
			$('#exportdecks').hide(400, 'swing');
			$('#importdecks').hide(400, 'swing');
			$('#importfolder').hide(400, 'swing');
			$('#storefolder').hide(400, 'swing');
			$('#flagsfolder').hide(400, 'swing');
		break;
		case 1: // show import url
			$('#importhtml').hide(400, 'swing');
			$('#importurl').show(400, 'swing');
			$('#importintern').hide(400, 'swing');
			$('#importbasic').hide(400, 'swing');
			$('#exportdecks').hide(400, 'swing');
			$('#importdecks').hide(400, 'swing');
			$('#importfolder').hide(400, 'swing');
			$('#storefolder').hide(400, 'swing');
			$('#flagsfolder').hide(400, 'swing');
		break;
		case 2: // show import html
			$('#importhtml').show(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#importintern').hide(400, 'swing');
			$('#importbasic').hide(400, 'swing');
			$('#exportdecks').hide(400, 'swing');
			$('#importdecks').hide(400, 'swing');
			$('#importfolder').hide(400, 'swing');
			$('#storefolder').hide(400, 'swing');
			$('#flagsfolder').hide(400, 'swing');
		break;
		case 3: // show load window
			$('#importhtml').hide(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#importintern').show(400, 'swing');
			$('#importbasic').hide(400, 'swing');
			$('#exportdecks').hide(400, 'swing');
			$('#importdecks').hide(400, 'swing');
			$('#importfolder').hide(400, 'swing');
			$('#storefolder').hide(400, 'swing');
			$('#flagsfolder').hide(400, 'swing');
		break;
		case 4: // show export all decks window
			$('#importhtml').hide(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#importintern').hide(400, 'swing');
			$('#importbasic').hide(400, 'swing');
			$('#exportdecks').show(400, 'swing');
			$('#importdecks').hide(400, 'swing');
			$('#importfolder').hide(400, 'swing');
			$('#storefolder').hide(400, 'swing');
			$('#flagsfolder').hide(400, 'swing');
		break;
		case 5: // show import all decks window
			$('#importhtml').hide(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#importintern').hide(400, 'swing');
			$('#importbasic').hide(400, 'swing');
			$('#exportdecks').hide(400, 'swing');
			$('#importdecks').show(400, 'swing');
			$('#importfolder').hide(400, 'swing');
			$('#storefolder').hide(400, 'swing');
			$('#flagsfolder').hide(400, 'swing');
		break;
		case 6: // show import folder
			$('#importhtml').hide(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#importintern').hide(400, 'swing');
			$('#importbasic').hide(400, 'swing');
			$('#exportdecks').hide(400, 'swing');
			$('#importdecks').hide(400, 'swing');
			$('#importfolder').show(400, 'swing');
			$('#storefolder').hide(400, 'swing');
			$('#flagsfolder').hide(400, 'swing');
		break;
		case 7: // show store folder
			$('#importhtml').hide(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#importintern').hide(400, 'swing');
			$('#importbasic').hide(400, 'swing');
			$('#exportdecks').hide(400, 'swing');
			$('#importdecks').hide(400, 'swing');
			$('#importfolder').hide(400, 'swing');
			$('#storefolder').show(400, 'swing');
			$('#flagsfolder').hide(400, 'swing');
		break;
		case 8: // show flags window
			$('#importhtml').hide(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#importintern').hide(400, 'swing');
			$('#importbasic').hide(400, 'swing');
			$('#exportdecks').hide(400, 'swing');
			$('#importdecks').hide(400, 'swing');
			$('#importfolder').hide(400, 'swing');
			$('#storefolder').hide(400, 'swing');
			$('#flagsfolder').show(400, 'swing');
		break;
		case 9: // show import basic decks window
			$('#importhtml').hide(400, 'swing');
			$('#importurl').hide(400, 'swing');
			$('#importintern').hide(400, 'swing');
			$('#importbasic').show(400, 'swing');
			$('#exportdecks').hide(400, 'swing');
			$('#importdecks').hide(400, 'swing');
			$('#importfolder').hide(400, 'swing');
			$('#storefolder').hide(400, 'swing');
			$('#flagsfolder').hide(400, 'swing');
		break;
	}
	// Reset text fields in any case
	$('#deck_content').val('');
	$('#theurl').val(texts[locale].deckurl);
	$('#jsonfilename').val(texts[locale].jsonfilename);
	$('#deck_file').val('');
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
	// Take HTML and create deck
	var html = $('#deck_content').val();

	processHTML(html, importSuccessful);
}
// ///////////////
// Import deck from HearthHead URL
function loadFromUrl()
{
	// Take URL and create deck
	var url = $('#theurl').val();

	processUrl(url, importSuccessful);
}
// ///////////////
function importSuccessful(result)
{
	if (result == null)
	{
		$.simplyToast(texts[locale].urlimporterror, 'danger');
		return;
	}

	var toast = (result.errvalue == 1) ? 'danger' : 'warning';

	if (result.errcode != "")
	{
		$.simplyToast(result.errcode, toast);
		if (result.errvalue == 1)
			return;
	}

	// Empty cards? warning
	if (result.cards.length == 0)
	{
		$.simplyToast(texts[locale].errornocards, 'danger');
		return;
	}

	// No name? use default
	if (result.name == '')
	{
		// search for default name in deck list
		var tmpname = texts[locale].unnamed;
		var count = 0;
		var allright = false;
		// We will suggest a new name based on default
		while (!allright)
		{
			// If default name is used, we will number the next one
			for (var idx = 0; idx < jDecks.length; idx++)
				if (tmpname == jDecks[idx].name)
				{
					count++;
					// So, now, let's try default name + count to see if its used
					tmpname = texts[locale].unnamed + ' (' + count + ')';
					break;
				}
			allright = (idx == jDecks.length);
		}
		// found valid name: assign it (default one, or default + count)
		result.name = tmpname;
	}

	// Got name and stuff? Create deck
	my_deck_name = result.name;

	// Delete previous deck
	if (my_deck_cards.length > 0)
		my_deck_cards.splice(0, my_deck_cards.length);

	// And deck data (hero and cards) from url
	my_deck_hero = result.hero;
	my_deck_cards = fullCopy(result.cards);
	my_deck_isarena = (typeof(result.isarena) == "undefined") ? false : result.isarena;

	// Show new deck
	showDeckCore();

	// Toggle visibility of subwindow based on import type
	subviewStatus(0);

	// Show save button
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
// Change active deck name
function changeName()
{
	var newname = $('#deck_name').val();
	var oldname = my_deck_name;

	// If name on textbox is same as 
	if (newname == my_deck_name)
		return;

	// Assign new name to active deck
	my_deck_name = newname;

	// Check if active deck is saved;
	if ($('.save.store').css('display') != 'none')
		// No? End
		return;

	// Yes? Update name in deck array: check each entry
	for (var i = 0; i < jDecks.length; i++)
	{
		// If deck in position has same name and same hero and same arena kind ...
		if ((jDecks[i].name == oldname) && (jDecks[i].hero == my_deck_hero) && (jDecks[i].isarena == my_deck_isarena))
		{
			jDecks[i].name = newname;
			// Store deck array
			storeOnStorage( jDecks, storageDecks );
			break;
		}
	}

	// Update list
	updateDeckList( jDecks );
}
// ///////////////

// ///////////////// ///////////////// ///////////////// ///////////////
// Actions when page has been loaded
// ///////////////
var global_flipstatus = 0;
$(document).ready(function(e)
{
	// First of all, we'll create all duplicated locales
	for (var idx in similarLocale)
	{
		factions[idx] = fullCopy(texts[similarLocale[idx]]);
		races[idx]    = fullCopy(texts[similarLocale[idx]]);
		texts[idx]    = fullCopy(texts[similarLocale[idx]]);
	}

	// After loading, assign enter key to click event of button referred on 'data-bindedto' attrib
	// for all textarea and input type text controls
	$('input[type=text]').on('keydown', function (e)
	{
		if (e.which == 13)
		{
			//  data-bindcontrol='mainButton'
			var mainButton = $(this).attr('data-bindedto');
			if (mainButton)
				$('#' + mainButton).trigger('click');
			else
				$(this).blur();

			return false;
		} else if (e.which == 27) {
			if ($(this).attr('id') == 'deck_name')
				$(this).val(my_deck_name);
			$(this).blur();

			return false;
		}
	});

	$('#deck_name').on('focusout', function(e)
	{
		changeName();
	});
	$('#deck_name').on('focusin', function(e)
	{
		subviewStatus(0);
	});

	// Init controls
	visibleControls(false);

	// Localize all content
	$('[data-localized]').each(function(index, element) {
        // localize each one
		var loc;
		for (var idx in allLocales)
		{
			loc = allLocales[idx];
			$(element).attr('title_' + loc, texts[loc][$(element).attr('data-localized')])
		}
    });

    $('.icon, .flag, .import, .store, .folder, .hscounter, .intern').mouseover( function ( e ) {
        $this = $( this );
        $this.data( 'title', $this.attr( 'title' ) );
        // Using null here wouldn't work in IE, but empty string will work just fine.
        $this.attr( 'title', '' );
    }).mouseout(function ( e ) {
        $this = $( this );
        $this.attr( 'title', $this.data( 'title' ) );
    });

	// Start tooltips for present elements
	$('.icon, .flag, .import, .store, .folder, .hscounter, .intern').bind('mouseenter', function(e) {
		if (typeof($(this).attr('title_' + locale)) != "undefined")
		{
			// Delete previous one(s)
			while ($('#tooltip').length > 0)
				$('#tooltip').remove();
			// And create one for this element
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
	$('.icon, .flag, .import, .store, .folder, .hscounter, .intern').bind('mouseleave', function(){
		while ($('#tooltip').length > 0)
    		$('#tooltip').remove();
	});

	// For touchscreens, this will rotate buttons on click
	$('.icon, .flag, .import, .store, .folder, .hscounter, .intern').bind('touchstart', function(){
		this.classList.toggle('hover');
	});
	
	// Init subview contents
	$('#theurl').val(texts[locale].deckurl);
	$('#jsonfilename').val(texts[locale].jsonfilename);
	$('#deck_file').val('');
	
	// Get decks from storage
	jDecks = retrieveFromStorage(storageDecks);

	// fix old versions for invalid arena flag
	for (var i = 0; i < jDecks.length; i++)
		if (typeof(jDecks[i].isarena) == "undefined")
			jDecks[i].isarena = false;

	// No saved decks? Don't show the load button
	if ((jDecks == null) || (jDecks.length == 0))
	{
		$('.load.store').hide();
		$('.put.store').hide();
	}

	// Update list from retrieved decks
	updateDeckList( jDecks );
	// and the basic decks
	updateDeckList( jBasicDecks );
	
	// Reset counter
	cardCounterReset()

	// Get locale from storage (spanish as default ^^)
	locale = retrieveFromStorage(storageLocale);
	if (allLocales.indexOf(locale) == -1)
		locale = 'eses';

	// Assign retrieved locale
	refreshLocale(locale);

	// Setup toast messages
	$.extend(true, $.simplyToast.defaultOptions,
	{
		'align': 'left',
		'delay' : 3000,
	});

	// Setup folders
	// Import
    var pos    = $('.fimport').position();
    var height = $('.fimport').outerHeight();
    $("#importfolder").css({
        top: (pos.top + height) + "px",
        left: pos.left + "px"
    });
	// Storage
    pos    = $('.fstore').position();
    height = $('.fstore').outerHeight();
    $("#storefolder").css({
        top: (pos.top + height) + "px",
        left: pos.left + "px"
    });

	// Flags
    pos    = $('#flagbutton').position();
    $("#flagsfolder").css({
        right: pos.right + "px"
    });

	// Add event to load file control
	$('#deck_file').bind('change', importAllDecks);

	// Hide spinner
	$('#spinner').hide();
});
// ///////////////