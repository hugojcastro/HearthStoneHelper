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
// ///////////////
// Import from HearthHead deck url, after loading its html
function importFromHearthHead(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	try
	{
		var page = $.parseHTML(html);
		// Name
		var name = $(page).find('h1#deckguide-name').first().text();
		// Hero
		var hero = $(page).find('div.deckguide-hero').first().attr('data-class');
		// Arena
		if ($(page).find('span.deckguide-qf-arena.tip').first())
			result.isarena = true;

		// Cards
		var container = $(page).find('div.deckguide-cards').first();
		if (typeof(container) != "undefined")
		{
			$(container).find('div.deckguide-cards-type li > a.card:only-child').each(function(index, element)
			{
				var href = $(element).attr('href');
				var name = $(element).text();

				var cardId = href.substr(href.indexOf('card=') + 5);

				var count = $(element).parent().text();
				count = count.replace(name, '').trim();

				var cardCount = (count == '') ? 1 : parseInt(count.substr(1));

				result.cards[result.cards.length] = { card: cardId, count: cardCount };
			});

			result.name = name;
			result.hero = hero;
		}
	}
	catch(e)
	{
		result.errcode = texts[locale].exceptionthrown + e;
		result.errvalue = 1;
	}
	
	return result;
}
// ///////////////
// Import from HearthPwn deck url, after loading its html
function importFromHearthPwn(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try
	{
		var page = $.parseHTML(html);
		// Deck name
		var name = $($(page).find('h2.deck-title').first()).html();
		// Hero
		var hero = $(page).find('.t-deck-details-card-list > h4').first().html();
		hero = getHeroClassFromName(hero.substr(0, hero.indexOf(' ', 0)).toLowerCase());
		// Cards
		$(page).find('td.col-name > b > a').each(function(index, element)
		{
			var href = $(element).attr('href');
			href = href.substr(href.indexOf('cards/') + 6);
			var cardId = hearthpwn_cards[href.substr(0, href.indexOf('-'))].hearthheadid;
			var cardCount = ($(element).parent().parent().text().indexOf(' 2') > 0) ? 2 : 1;

			result.cards[result.cards.length] = { card: cardId, count: cardCount };
		});

		result.name = name;
		result.hero = hero;
	}
	catch(e)
	{
		result.errcode = e;
		result.errvalue = 1;
	}
	
	return result;
}
// ///////////////
// Import from HearthStoneTopDeck deck url, after loading its html
function importFromHearthStoneTopDeck(html)
{
	var result    = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try
	{
		var page = $.parseHTML(html);
		// Read hero
		var heroImg = $(page).find('div#infos > table > tbody > tr > td > img').first();
		var hero = $(heroImg).attr('src');
		result.hero = getHeroClassFromName(hero.substr(0, hero.indexOf('hero')).substr(hero.indexOf('/') + 1));
		// Read name
		var nameLine = $(page).find('div#center > div.headbar > div').first();
		result.name = $(nameLine).text().split(' - ')[1];

		$(page).find('div[class=cardname]').each(function(index, element)
		{
			var card = $(element).text().trim();
			var quantity = ((card.indexOf('2')) != -1) ? 2 : ((card.indexOf('1') != -1) ? 1 : 0);
			var cardname = card.substr(card.indexOf(quantity) + 1).trim();
			var cardid = getCardIdFromName('enus', cardname);

			result.cards[result.cards.length] = { card: cardid, count: quantity };
	    });
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromHearthArena(html)
{
	var result    = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: true };

	try
	{
		var page = $.parseHTML(html);

		// Name
		result.name = $(page).find('.deck-archetype-name').first().text();
		// Hero
		result.hero = getHeroClassFromName($($(page).find('.deck-archetype-name').first()).removeClass('deck-archetype-name').attr('class').toString());
		// Cards
		$(page).find('ul.deckList li.deckCard').each(function(index, element)
		{
			var quantity = $(element).find('span.quantity').first().text();
			var cardname = $(element).find('span.name').first().text();
			var cardid   = getCardIdFromName('enus', cardname);

			result.cards[result.cards.length] = { card: cardid, count: quantity };
	    });
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromHearthStoneDecks(html)
{
	var result    = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try
	{
		var page = $.parseHTML(html);

		// To check for unknown cards
		var out = '';
		// Name
		result.name = $(page).find('div.breadcrumb ul.linklist div').first().text();
		// Hero
		var hero = $(page).find('div.breadcrumb ul.linklist a[href*="/deck/"]').first().attr('href');
		hero = hero.substr(hero.indexOf('/deck/') + 6);
		result.hero = getHeroClassFromName('frfr', hero);
		// Cards
		$(page).find('div#liste_cartes td.zecha-popover > a').each(function(index, element)
		{
			var cardImage = $(element).attr('real_id');
			var cardName  = $(element).text().trim();
			var quantity  = $(element).attr('nb_card');
			// This site still lacks from GvG card info, so we must warn...
			if (cardImage != '')
			{
				var cardid = getCardIdFromImage(cardImage);
				result.cards[result.cards.length] = { card: cardid, count: quantity };
			} else {
				var cardid = getCardIdFromName('frfr', cardName);
				if (cardid != -1)
				{
					result.cards[result.cards.length] = { card: cardid, count: quantity };
				} else {
					out += '<br />' + quantity + 'x ' + cardName;
				}
			}
		});
		// errvalue 2 is warning; 1 is error; on warning, cards should be taken
		if (out != '')
		{
			result.errcode = texts[locale].deckMissingCards + ((CORSMETHOD == 3) ? decodeURIComponent(escape(out)) : out);
			result.errvalue = 2;
		}
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromHearthNews(html)
{
	var result    = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try
	{
		var page = $.parseHTML(html);

		var aSpan = $(page).find('span.deckName').first();
		// Name
		result.name = $(aSpan).text();
		// Hero
		$(aSpan).removeClass('deckName');
		var hero = $(aSpan).attr('class');
		result.hero = getHeroClassFromName('enus', hero.substr(hero.indexOf('deck_class_') + 11).toLowerCase());
		// Cards
		$(page).find('a.real_id').each(function(index, element)
		{
			var cardImage = $(element).attr('real_id');
			var name      = $(element).text().toLowerCase().trim();
			var cardid    = getCardIdFromImage(cardImage);
			var quantity  = $(element).attr('nb_card');

			result.cards[result.cards.length] = { card: cardid, count: quantity };
        });
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromHearthStats(html)
{
	var result    = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try
	{
		var page = $.parseHTML(html);

		// Name
		var name = $(page).find('.page-title').first().text();
		name = name.substr(0, name.indexOf('Deck Views')).trim();
		result.name = name;
		// Hero
		var heroImage = $(page).find('div.deck-details div.win-count > span > img').first().attr('src');
		result.hero = getHeroClassFromName(heroImage.substr(0,heroImage.indexOf('_Icon')).substr(heroImage.indexOf('/assets/Icons/Classes/') + 22));
		// Cards
		$(page).find('div.cardWrapper').each(function(index, element)
		{
			var name     = $(element).find('div.name').first().text();
			var cost     = parseInt($(element).find('div.mana').first().text());
			var cardid   = getCardIdFromNameCost('enus', name, cost);
			var quantity = parseInt($(element).find('div.qty').first().text());

			result.cards[result.cards.length] = { card: cardid, count: quantity };
        });
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromHearthStonePlayers(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	try
	{
		var page = $.parseHTML(html);

		// Name
		result.name = $(page).find('div#deck-list-title').first().text();
		// Hero
		var hero = $(page).find('ul.post-categories > li > a').first().attr('href');
		hero = hero.substr(0, hero.indexOf('-decks')).substr(hero.indexOf('category/') + 9);
		result.hero = getHeroClassFromName(hero);

		// Cards
		$(page).find('div.deck-list.guide-deck-list > div.class-cards div.card, div.deck-list.guide-deck-list > div.neutral-cards div.card').each(function(index, element)
		{
			var count = $(element).find('span.card-count').first();
			var quantity = ((typeof(count) != "undefined") && (parseInt($(count).text()) == 2)) ? 2 : 1;
			var name = $(element).find('span.card-title').first().text();
			var cost = $(element).find('span.mana-cost').first().text();
			var cardid = getCardIdFromNameCost('enus', name, cost);

			if ( result.hero == 0) result.hero = getHeroFromCard( cardid );

			// Check if card exists, just in case of arena decks
			var found = false;
			var idx = 0;
			while (( idx < result.cards.length ) && ( !found ))
			{
				if ( result.cards[idx].card == cardid )
				{
					result.cards[idx].count = result.cards[idx].count + quantity;
					result.isarena = true;
					found = true;
				}
				idx++;
			}

			if ( !found )
				result.cards[result.cards.length] = { card: cardid, count: quantity };
        });
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromHearthStoneTopDecks(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try
	{
		var page = $.parseHTML(html);

		// Name
		result.name = $(page).find('h1.entry-title').first().text();
		// Hero
		var hero = $(page).find('div.entry-meta span.deck-info a').first().attr('href');
		hero = hero.substr(hero.indexOf('deck-class/') + 11);
		hero = hero.substr(0, hero.indexOf('/'));
		result.hero = getHeroClassFromName(hero);
		// Cards
		var cards = $(page).find('ul.deck-class li').each(function(index, element)
		{
			var name     = $( element ).find( 'span.card-name' ).first().text();
			var quantity = $( element ).find( 'span.card-count' ).first().text();
			var cardid   = getCardIdFromName('enus', name);

			result.cards[result.cards.length] = { card: cardid, count: quantity };
		});
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromGameOfHearthStone(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	try
	{
		var page = $.parseHTML(html);

		// Name
		result.name = $(page).find('h3').first().text().trim();
		if (result.name.indexOf(' - ') != -1)
			result.name = result.name.substr(0, result.name.indexOf(' - '));
		// Hero
		var elem = $(page).find('#blog-left > div.single-archive > div.short-title > div.pull-right > div.text-center > a');
		$(elem).removeClass('deckbuilder-class-selection-class');
		result.hero = getHeroClassFromName($(elem).attr('class'));
		// Cards
		$(page).find('a.collapsed-card').each(function(index, element)
		{
			var quantity = $(element).attr('data-count');
			var name = $(element).find('span.name').first().text();
			var cardid = getCardIdFromName('enus', name);

			// Check for weird decks: more than 2 simple cards or more than 1 legendary
			if (( quantity > 2 ) || (( getQualityFromCard( cardid ) == 5 ) && ( quantity > 1 )))result.isarena = true;

			result.cards[result.cards.length] = { card: cardid, count: quantity };
        });
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromBuffed(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try
	{
		var page = $.parseHTML(html);

		// Name
		result.name = $(page).find('h3.panel-title').first().text();

		// Hero
		var hero = $(page).find("td > a[class^='clc-']").first().text().toLowerCase().trim();
		result.hero = getHeroClassFromName(hero);

		// Cards
		// This one is tricky; We get all rows with sortable cells and we'll filter them
		var cells  = $(page).find("table.table tr td[data-sort-value!='']");
		var ncells = cells.length;
		// Skip first 7 cells found (with class name and author name)
		var offs   = 7;
		// 5 cells represent a card: quantity, name, cost, attack, health
		var aRow   = 5;
		var idx    = 0;
		// predefine vars to help garbage compiler
		var count;
		var quantity;
		var name;
		var cardid;
		while ((pos = offs + idx*aRow) < ncells)
		{
			count = $(cells[pos]).text().trim();
			if (count != '')
			{
				quantity = (count.indexOf('2x') != -1) ? 2 : 1;
				name     = $(cells[pos + 1]).text().trim();
				cardid   = getCardIdFromName('enus', name);

				result.cards[result.cards.length] = { card: cardid, count: quantity };
			}

			idx++;
		}
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromGosugamers(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try
	{
		var page = $.parseHTML(html);

		var span = $(page).find("div.header span.deck-title").first();

		// Name
		result.name = $(span).text().trim();
		// Hero
		$(span).removeClass('deck-title');
		var hero = $(span).attr('class').toLowerCase();

		while (hero.indexOf('-') != -1)
			hero = hero.substr(hero.indexOf('-') + 1);

		result.hero = getHeroClassFromName(hero);

		// Cards
		$(page).find("a[id^='deck-card-']").each(function(index, element)
		{
			var name     = $(element).find("span[class*='name']").first().text().trim();
			var quantity = ($(element).find("span[class='count']").first().text().trim() == '') ? 1 : 2;

			// Adjust bad names
			if (name == 'Dr Boom') name = 'Dr. Boom';

			var cardid   = getCardIdFromName('enus', name);

			result.cards[result.cards.length] = { card: cardid, count: quantity };
        });
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromMilleniumBeta(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try
	{
		var page = $.parseHTML(html);

		// Name
		result.name = $(page).find("table > tbody tr td > h2 > span").first().text().trim();

		// Hero
		var hero = $(page).find("img[src*='hearthstone_heros_']").first().attr('src');
		hero = hero.substr(hero.indexOf('hearthstone_heros_') + 18);
		hero = hero.substr(0, hero.indexOf('.'));
		hero = hero.substr( hero.indexOf( '_' ) + 1 );

		result.hero = getHeroClassFromName('frfr', hero);

		// Cards
		$(page).find("tr td > span > strong > a[href*='hearthhead.com/card='], tr td > span > strong > a[href*='wowhead.com/hearthstone/card=']").each(function(index, element)
		{
			// cardid from url
			var cardid = $( element ).attr( 'href' );
			cardid = cardid.substr( cardid.indexOf( '/card=' ) + 6 );
			if ( cardid.indexOf( '/' ) != -1 )
				cardid = cardid.substr( 0, cardid.indexOf( '/' ) );
			var cardid = parseInt( cardid );

			// count
			var tr = $(element).parent().parent().parent().prev().text();
			var quantity = ( tr.indexOf( '2' ) != -1 ) ? 2 : ( ( tr.indexOf( '1' ) != -1 ) ? 1 : 0 );

			if ( quantity > 0 )
			{
				result.cards[result.cards.length] = { card: cardid, count: quantity };

				if ( result.hero == 0) result.hero = getHeroFromCard( cardid );
			}
        });
		$(page).find("tr td > strong > a[href*='hearthhead.com/card='], tr td > strong > a[href*='wowhead.com/hearthstone/card=']").each(function(index, element)
		{
			// cardid from url
			var cardid = $( element ).attr( 'href' );
			cardid = cardid.substr( cardid.indexOf( '/card=' ) + 6 );
			if ( cardid.indexOf( '/' ) != -1 )
				cardid = cardid.substr( 0, cardid.indexOf( '/' ) );
			var cardid = parseInt( cardid );

			// count
			var tr = $(element).parent().parent().prev().text();
			var quantity = ( tr.indexOf( '2' ) != -1 ) ? 2 : ( ( tr.indexOf( '1' ) != -1 ) ? 1 : 0 );

			if ( quantity > 0 )
			{
				result.cards[result.cards.length] = { card: cardid, count: quantity };

				if ( result.hero == 0) result.hero = getHeroFromCard( cardid );
			}
        });
		$(page).find("tr td > strong > a[href*='hearthhead.com/card='], tr td > strong > a[href*='wowhead.com/hearthstone/card=']").each(function(index, element)
		{
			var name = $(element).attr( 'href' );
			name = name.substr(name.indexOf('/card=') + 6);
			if (name.indexOf('/') != -1)
				name = name.substr(0, name.indexOf('/'));
			var cardid = parseInt(name);
			// count
			var tr = $(element).parent().parent().prev().prev().text();
			var quantity = ( tr.indexOf( '2' ) != -1 ) ? 2 : ( ( tr.indexOf( '1' ) != -1 ) ? 1 : 0 );

			result.cards[result.cards.length] = { card: cardid, count: quantity };

			if ( result.hero == 0) result.hero = getHeroFromCard( cardid );
        });
		$(page).find("tr td > strong > strong > a[href*='hearthhead.com/card='], tr td > strong > strong > a[href*='wowhead.com/hearthstone/card=']").each(function(index, element)
		{
			var name = $(element).attr( 'href' );
			name = name.substr(name.indexOf('/card=') + 6);
			if (name.indexOf('/') != -1)
				name = name.substr(0, name.indexOf('/'));
			var cardid = parseInt(name);
			// count
			var tr = $(element).parent().parent().parent().prev().text();
			var quantity = ( tr.indexOf( '2' ) != -1 ) ? 2 : ( ( tr.indexOf( '1' ) != -1 ) ? 1 : 0 );

			result.cards[result.cards.length] = { card: cardid, count: quantity };

			if ( result.hero == 0) result.hero = getHeroFromCard( cardid );
        });
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromMillenium(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try
	{
		var page = $.parseHTML(html);

		// Name
		result.name = $(page).find("h1#titreActu").first().text().trim();
		// Hero
		var hero = $(page).find("img[src*='hearthstone_heros_']").first().attr('src');
		hero = hero.substr(hero.indexOf('hearthstone_heros_') + 18);
		hero = hero.substr(0, hero.indexOf('.'));
		hero = hero.substr( hero.indexOf( '_' ) + 1 );

		result.hero = getHeroClassFromName('frfr', hero);

		// Cards
		$(page).find("tr td > a[href*='hearthhead.com/card=']").each(function(index, element)
		{
			var name = $( element ).attr( 'href' );
			name = name.substr( name.indexOf( 'hearthhead.com/card=' ) + 20 );
			if ( name.indexOf( '/' ) != -1 )
				name = name.substr( 0, name.indexOf( '/' ) );
			var cardid = parseInt( name );
			// count
			var tr = $(element).parent().prev().prev().text();
			var quantity = ( tr.indexOf( '2' ) != -1 ) ? 2 : ( ( tr.indexOf( '1' ) != -1 ) ? 1 : 0 );

			if ( quantity > 0 )
			{
				result.cards[result.cards.length] = { card: cardid, count: quantity };

				if ( result.hero == 0) result.hero = getHeroFromCard( cardid );
			}
        });

		$(page).find("tr td > strong > a[href*='hearthhead.com/card=']").each(function(index, element)
		{
			var name = $(element).attr( 'href' );
			name = name.substr(name.indexOf('hearthhead.com/card=') + 20);
			if (name.indexOf('/') != -1)
				name = name.substr(0, name.indexOf('/'));
			var cardid = parseInt(name);
			// count
			var tr = $(element).parent().parent().prev().prev().text();
			var quantity = ( tr.indexOf( '2' ) != -1 ) ? 2 : ( ( tr.indexOf( '1' ) != -1 ) ? 1 : 0 );

			result.cards[result.cards.length] = { card: cardid, count: quantity };

			if ( result.hero == 0) result.hero = getHeroFromCard( cardid );
        });
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromProESLGaming(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try
	{
		var page = $.parseHTML(html);

		// Name
		result.name = $(page).find("div.decklistdetails > h3").first().text().trim();

		// Cards
		$(page).find("div.cards > div.inner > div.decklist_compact div.carditem_container").each(function(index, element)
		{
			var quantity = parseInt($(element).find('div.num').first().text().trim());
			var image = $(element).find('div.image > img').first().attr('src');
			image = image.substr(image.indexOf('/cards/') + 7);
			image = image.substr(0, image.indexOf('.'));
			var cardid = getCardIdFromImage(image);

			result.cards[result.cards.length] = { card: cardid, count: quantity };

			if (typeof(hs_cards[locale][cardid].classs) != "undefined")
				result.hero = hs_cards[locale][cardid].classs;
        });
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromPlayHS(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	// 2 Druida, 3 Cazador, 4 Mago, 5 Paladín, 6 Sacerdote, 7 Pícaro, 8 Chamán, 9 Brujo, 10 Guerrero
	var playhs_heroes = [ 0, 0, 11, 3, 8, 2, 5, 4, 7, 9, 1 ];

	try
	{
		var page = $.parseHTML(html);
		var quantity;
		var name;
		var cells;
		var cardid;

		// Name
		// We should use decodeURIComponent + escape because of our fancy acented vowels and tilded n (mainly) :3
		result.name = decodeURIComponent(escape($(page).find("h1.itemTitle").first().text().trim()));
		// Hero
		var Ref = $(page).find("table.tablamolonaplayhs tbody tr td > a[href*='buscar/?clase='] > img[src*='/deckbuild/img/']").first().parent().attr('href');
		result.hero = playhs_heroes[parseInt(Ref.substr(Ref.indexOf('?clase=') + 7))];

		// Cards
		// Take second table and skip first line
		var line = 0;
		$(page).find("table.tablamolonaplayhs").eq(1).find('tbody > tr').each(function(index, element)
		{
			if (line++)
			{
				cells = $(element).find('td');
				if ($(cells[0]).text().trim() != '')
				{
					quantity = ($(cells[0]).text().trim() == '2x') ? 2 : 1;
					name     = decodeURIComponent(escape($(cells[1]).text().trim()));
					cardid   = getCardIdFromName('eses', name);

					result.cards[result.cards.length] = { card: cardid, count: quantity };
				}
				if ($(cells[3]).text().trim() != '')
				{
					quantity = ($(cells[3]).text().trim() == '2x') ? 2 : 1;
					name     = decodeURIComponent(escape($(cells[4]).text().trim()));
					cardid   = getCardIdFromName('eses', name);

					result.cards[result.cards.length] = { card: cardid, count: quantity };
				}
			}
		});
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromHeartstoneBuilder(aDeck)
{
	var result = { name: aDeck.name, hero: getHeroClassFromName(aDeck.class), cards: [], errcode: "", errvalue: 0 };

	for (var idx = 0; idx < aDeck.cards.length; idx++)
		result.cards[result.cards.length] = { card: aDeck.cards[idx].id, count: aDeck.cards[idx].qty };

	return result;
}
// ///////////////
function importFromEliteDecks(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	try
	{
		var page = $.parseHTML(html);

		// Name
		result.name = $(page).find("h2.dname").first().text().trim();

		// Hero
		var Hero = $(page).find("div.vmazoinfo img.heroedeck").first().attr('src');
		Hero = Hero.substr(0, Hero.indexOf('.')).substr(Hero.indexOf('decks/') + 7);

		result.isarena = (Hero == 'arena');

		if (!result.isarena)
			result.hero = getHeroClassFromName(Hero);

		// Cards
		// Take second table and skip first line
		$(page).find("div.vmazolayer div.vminions ul.vminionslist li, div.vmazolayer div.vspells ul.vspellslist li").each(function(index, element)
		{
			quantity = parseInt($(element).find('span.cantidad').first().text().trim());
			name     = decodeURIComponent(escape($(element).find('span.nombreCarta').first().text().trim()));
			cardid   = getCardIdFromName('eses', name);
			if (cardid == -1)
				cardid   = getCardIdFromName('enus', name);

			if ((result.isarena) && (typeof(hs_cards['enus'][cardid].classs) != "undefined"))
				result.hero = hs_cards['enus'][cardid].classs;

			result.cards[result.cards.length] = { card: cardid, count: quantity };
		});
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromInvenCoKr(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	try
	{
		var page = $.parseHTML(html);

		// Name
		result.name = unescape($(page).find("div.title-box div.title-box-left span.title").first().text().trim());
		// Hero
		var Hero = $(page).find("div.hero-detail-wrap div.name2").first().text().trim().toLowerCase();
		Hero = Hero.substr(0, Hero.indexOf(' :')).trim();

		result.hero = getHeroClassFromName(Hero);

		// Cards
		var countTable = html.substr(html.indexOf('hsDeckSimul_init'));
		countTable = countTable.substr(0, countTable.indexOf(']);')).substr(countTable.indexOf('[') + 1);
		countTable = countTable.split(',');
		total = countTable.length;

		var cards = [];
		for (var idx = 0; idx < total; idx++)
		{
			if (!cards[countTable[idx]])
				cards[countTable[idx]] = 1;
			else
				cards[countTable[idx]] = cards[countTable[idx]] + 1;
		}
		for (var cardid in cards)
			result.cards[result.cards.length] = {  card: cardid, count: cards[cardid] };
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromHearthBuilder(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	try
	{
		var page = $.parseHTML(html);

		// Name
		result.name = unescape(escape($(page).find('div.single-deck-title-wrap h2').first().text().trim()));
		// Hero
		var Hero = $(page).find('div > h4').first().text().trim().toLowerCase();
		Hero = Hero.substr(0, Hero.indexOf('cards -')).trim();
		result.hero = getHeroClassFromName(Hero);

		// Cards
		$(page).find("td > div[data-card-load*='/card/']").each(function(index, element)
		{
            var cardname = $(element).text().trim().toLowerCase();
			var idx = cardname.indexOf('x ');
			var quantity = 1;
			if (idx != -1)
				quantity = parseInt(cardname.substr(idx + 2).trim());

			if( quantity > 1)
				cardname = cardname.substr(0, idx).trim();

			var cardid = getCardIdFromName('enus', cardname);

			result.cards[result.cards.length] = { card: cardid, count: quantity };
        });
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromBlizzpro(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	try
	{
		var page = $.parseHTML(html);

		// Name
		result.name = unescape(escape($(page).find("p strong > a[href*='/deck=']").first().text().trim()));
		// Hero
		var Hero = $(page).find("p strong > a[href*='/deck=']").first().parent().parent().text().trim();
		Hero = Hero.substr(Hero.indexOf('Class: ') + 7).toLowerCase();
		result.hero = getHeroClassFromName(Hero);

		// Cards
		$(page).find("ul li > a[href*='/card=']").each(function(index, element)
		{
            var cardname = $(element).text().trim().toLowerCase();
			var linetext = $(element).parent().text().trim().toLowerCase().replace(cardname, '');

			var quantity = 1;
			var idx = linetext.indexOf('x');
			if (idx != -1)
				quantity = parseInt(linetext.substr(idx + 1).trim());

			var cardid = getCardIdFromName('enus', cardname);

			result.cards[result.cards.length] = { card: cardid, count: quantity };
        });
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromHSDeck(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };
	// Check for missing cards (this page has weird cards O.o)
	var out = '';

	try
	{
		var page = $.parseHTML(html);

		// Hero
		var Hero = $(page).find("div.deck-viewer-options span.hero-portrait-transparent").first();
		$(Hero).removeClass('hero-portrait-transparent');
		Hero = $(Hero).attr('class').toLowerCase();

		result.hero = getHeroClassFromName(Hero);

		// Cards
		$(page).find("div.card-list-wrapper > ul li").each(function(index, element)
		{
            var cardname = $(element).attr('ctitle');
            var quantity = parseInt($(element).attr('ccount'));
			var cardid = getCardIdFromName('enus', cardname);

			if (cardid != -1)
			{
				result.cards[result.cards.length] = { card: cardid, count: quantity };
			} else {
				out += '<br />' + quantity + 'x ' + cardname;
			}
        });
		// errvalue 2 is warning; 1 is error; on warning, cards should be taken
		if (out != '')
		{
			result.errcode = texts[locale].deckMissingCards + ((CORSMETHOD == 3) ? decodeURIComponent(escape(out)) : out);
			result.errvalue = 2;
		}
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromPlayHSCards(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	try
	{
		var page = $.parseHTML(html);
		var out  = '';

		// Name
		var name = $(page).find("div.main div.main-header").first().text().trim();
		if (name == '')
			name = $(page).find("div.main h1.main-header").first().text().trim();
		result.name = name;

		// Hero (this one is another aproach not language based)
		// var Hero = $(page).find("div.guide-view div.class div.image").first();
		// $(Hero).removeClass('image');
		// Hero = $(Hero).attr('class').substr($(Hero).attr('class').indexOf('-') + 1);
		var Hero = $(page).find("div.guide-view div.class div.title").first().text();
		result.hero = getHeroClassFromName('ruru', Hero);

		// Cards
		$(page).find("a[href*='playhscards.ru/cards/'][class*='single']").each(function(index, element)
		{
            var cardname = $(element).find('div.title').first().text();
            var quantity = parseInt($(element).find('div.a-few').first().text().substr(1));
			if (isNaN(quantity))
				quantity = 1;

			var cardid = getCardIdFromName('ruru', cardname);
			if (cardid != -1)
			{
				result.cards[result.cards.length] = { card: cardid, count: quantity };
			} else {
				out += '<br />' + quantity + 'x ' + cardname;
			}
        });

		// errvalue 2 is warning; 1 is error; on warning, cards should be taken
		if (out != '')
		{
			result.errcode = texts[locale].deckMissingCards + ((CORSMETHOD == 3) ? decodeURIComponent(escape(out)) : out);
			result.errvalue = 2;
		}
	}
	catch(err)
	{
		result.errcode = err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
function importFromIcyVeins(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	try
	{
		var page = $.parseHTML(html);
		// Name
		var name = $(page).find('h2#sec-2').first();
		$(name).find('span').remove();
		name = $(name).text().replace('2. ', '');
		// Hero
		var hero = getHeroClassFromName('enus', $(page).find('table.deck_card_list tr th > span').first().attr('class'));
		// Cards
		$(page).find('table.deck_card_list tr td ul li').each(function(index, element)
		{
			var cname  = $(element).find('a').first().text();
			var count  = parseInt($(element).text().charAt(0));
			var cardId = getCardIdFromName('enus', cname);
			// Arena
			if ((count > 2) || ( (getQualityFromCard(cardId) == 5) && (count > 1))) result.isarena = true;

			result.cards[result.cards.length] = { card: cardId, count: count };
		});

		result.name = name;
		result.hero = hero;
	}
	catch(e)
	{
		result.errcode  = texts[locale].exceptionthrown + e;
		result.errvalue = 1;
	}
	
	return result;
}
// ///////////////
function importFromTempoStorm(data)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	try
	{
		var deckInfo = JSON.parse(data);
		// Name
		result.name = deckInfo.deck.name;
		// Hero
		result.hero = getHeroClassFromName('enus', deckInfo.deck.playerClass.toLowerCase());
		// Cards
		for (var i in deckInfo.deck.cards)
		{
			var cardId = getCardIdFromNameCost('enus', deckInfo.deck.cards[i].card.name, deckInfo.deck.cards[i].card.cost);
			var count  = deckInfo.deck.cards[i].qty;
			// Arena
			if ((count > 2) || ( (getQualityFromCard(cardId) == 5) && (count > 1))) result.isarena = true;
			result.cards[result.cards.length] = { card: cardId, count: count };
		}
	}
	catch(e)
	{
		result.errcode  = texts[locale].exceptionthrown + e;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////