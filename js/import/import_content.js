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

	// Name
	result.name = $(html).find('h1#deckguide-name').first().text();
	// Hero
	result.hero = $(html).find('div.deckguide-hero').first().attr('data-class');
	// Arena
	if (
		(typeof($(html).find('span.deckguide-qf-type').first()) != "undefined") && 
		($(html).find('span.deckguide-qf-type').first().text().trim() == "Arena Deck")
	)
		result.isarena = true;

	// Cards
	var container = $(html).find('div.deckguide-cards').first();
	$(container).find('div.deckguide-cards-type li > a.card:only-child').each(function(index, element)
	{
		var href  = $(element).attr('href');
		var cname = $(element).text();

		var cardId = href.substr(href.indexOf('card=') + 5);

		var count = $(element).parent().text();
		count = count.replace(cname, '').trim();

		var cardCount = (count == '') ? 1 : parseInt(count.substr(1));

		result.cards[result.cards.length] = { card: hearthhead_cards[cardId].image, count: cardCount };
	});
	
	return result;
}
// ///////////////
// Import from HearthPwn deck url, after loading its html
function importFromHearthPwn(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	// Deck name
	result.name = $($(html).find('h2.deck-title').first()).html();
	// Hero
	var hero = $(html).find('.t-deck-details-card-list > h4').first().html();
	result.hero = getHeroClassFromName(hero.substr(0, hero.indexOf(' ', 0)).toLowerCase());
	// Cards
	$(html).find('td.col-name > b > a').each(function(index, element)
	{
		var href = $(element).attr('href');

		href = href.substr(href.indexOf('cards/') + 6);

		var cardId    = hearthpwn_cards[href.substr(0, href.indexOf('-'))].image;
		var cardCount = ($(element).parent().parent().text().indexOf(' 2') > 0) ? 2 : 1;

		result.cards[result.cards.length] = { card: cardId, count: cardCount };
	});
	
	return result;
}
// ///////////////
// Import from HearthStoneTopDeck deck url, after loading its html
function importFromHearthStoneTopDeck(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	// Read hero
	var heroImg = $(html).find('div#infos > table > tbody > tr > td > img').first();
	var hero    = $(heroImg).attr('src');
	hero        = hero.substr(0, hero.indexOf('hero')).substr(hero.indexOf('interface/') + 10);
	result.hero = getHeroClassFromName(hero);
	// Read name
	var name = $(html).find('div.panel-heading h3.panel-title').eq(2).text().trim();
	name = name.substr(name.indexOf(' - ') + 3);
	result.name = name.substr(0, name.indexOf(' - '));

	$(html).find('div[class=cardname]').each(function(index, element)
	{
		var card = $(element).text().trim();
		var quantity = ((card.indexOf('2')) != -1) ? 2 : ((card.indexOf('1') != -1) ? 1 : 0);
		var cardname = card.substr(card.indexOf(quantity) + 1).trim();
		var cardid = getCardIdFromName('enus', cardname);

		result.cards[result.cards.length] = { card: cardid, count: quantity };
	});

	return result;
}
// ///////////////
function importFromHearthArena(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: true };

	// Name
	result.name = $(html).find('.deck-archetype-name').first().text();
	// Hero
	result.hero = getHeroClassFromName($($(html).find('.deck-archetype-name').first()).removeClass('deck-archetype-name').attr('class').toString());
	// Cards
	$(html).find('ul.deckList li.deckCard').each(function(index, element)
	{
		var quantity = parseInt($(element).find('span.quantity').first().text());
		var cardname = $(element).find('span.name').first().text();
		var cardcost = parseInt($(element).find('span.mana').first().text());
		var cardid   = getCardIdFromNameCost('enus', cardname, cardcost);

		result.cards[result.cards.length] = { card: cardid, count: quantity };
	});
	// All decks from here are arena decks
	result.isarena = true;

	return result;
}
// ///////////////
function importFromHearthStoneDecks(html)
{
	var result    = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	// To check for unknown cards
	var out = '';
	// Name
	result.name = $(html).find('div.breadcrumb div[itemprop="title"]').first().text();
	// Hero
	var heros = [0, 11, 5, 1, 2, 7, 4, 3, 9, 8]; // // 9-mage, 7-hunter, 5-shaman, 8-warlock, 1-druid, 3-warrior, 4-paladin, 2-priest, 6-rogue
	var hero  = $(html).find('div#portrait-heros > img').attr('src');
	hero        = hero.substr(hero.indexOf('/heros/') + 7);
	hero        = hero.substr(0, hero.indexOf('.jpg'));
	result.hero = heros[parseInt(hero)];
	// Cards
	$(html).find('div#liste_cartes table tr.alt td.zecha-popover a').each(function(index, element)
	{
		var cardid   = $(element).attr('real_id');
		var cardName = $(element).text().trim();
		var quantity = parseInt($(element).attr('nb_card'));
		var cardcost = parseInt($(element).parent().next('td').next('td').find('span.mana').text().trim());
		// This site still lacks from some card info, so we must warn...
		if (cardid == '')
			cardid = getCardIdFromNameCost('frfr', cardName, cardCost);

		if (cardid != -1)
		{
			result.cards[result.cards.length] = { card: cardid, count: quantity };
		} else {
			out += '<br />' + quantity + 'x ' + cardName;
		}
	});
	// errvalue 2 is warning; 1 is error; on warning, cards should be taken
	if (out != '')
	{
		result.errcode = texts[locale].deckMissingCards + out;
		result.errvalue = 2;
	}

	return result;
}
// ///////////////
function importFromHearthNews(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	var aSpan = $(html).find('span.deckName').first();
	// Name
	result.name = $(aSpan).text();
	// Hero
	$(aSpan).removeClass('deckName');
	var hero = $(aSpan).attr('class');
	result.hero = getHeroClassFromName('enus', hero.substr(hero.indexOf('deck_class_') + 11).toLowerCase());
	// Cards
	$(html).find('a.real_id').each(function(index, element)
	{
		var cardid = $(element).attr('real_id');
		// var cname     = $(element).text().toLowerCase().trim();
		var quantity  = $(element).attr('nb_card');

		result.cards[result.cards.length] = { card: cardid, count: quantity };
	});

	return result;
}
// ///////////////
function importFromHearthStats(html)
{
	var result  = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	// Name
	var name = $(html).find('.page-title').first().text();
	result.name = name.substr(0, name.indexOf('Deck Views')).trim();
	// Hero
	var heroImage = $(html).find('div.deck-details div.win-count > span > img').first().attr('src');
	result.hero = getHeroClassFromName(heroImage.substr(0,heroImage.indexOf('_Icon')).substr(heroImage.indexOf('/assets/Icons/Classes/') + 22));
	// Cards
	$(html).find('div.cardWrapper').each(function(index, element)
	{
		var cname     = $(element).find('div.name').first().text();
		var cost     = parseInt($(element).find('div.mana').first().text());
		var cardid   = getCardIdFromNameCost('enus', cname, cost);
		var quantity = parseInt($(element).find('div.qty').first().text());

		result.cards[result.cards.length] = { card: cardid, count: quantity };
	});

	return result;
}
// ///////////////
function importFromHearthStonePlayers(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	// Name
	result.name = $(html).find('div#deck-list-title').first().text();
	// Hero
	var hero = $(html).find('ul.post-categories > li > a').first().attr('href');
	hero = hero.substr(0, hero.indexOf('-decks')).substr(hero.indexOf('category/') + 9);
	result.hero = getHeroClassFromName(hero);
	// Cards
	$(html).find('div.deck-list.guide-deck-list > div.class-cards div.card, div.deck-list.guide-deck-list > div.neutral-cards div.card').each(function(index, element)
	{
		var count    = $(element).find('span.card-count').first();
		var quantity = ((typeof(count) != "undefined") && (parseInt($(count).text()) == 2)) ? 2 : 1;
		var cname    = $(element).find('span.card-title').first().text();
		var cost     = parseInt($(element).find('span.mana-cost').first().text());
		var cardid   = getCardIdFromNameCost('enus', cname, cost);

		if ( result.hero == 0)
			result.hero = getHeroFromCard( cardid );

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

	return result;
}
// ///////////////
function importFromHearthStoneTopDecks(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	// Name
	result.name = $(html).find('header.entry-header h1.entry-title').first().text().trim();
	// Cards
	var cards = $(html).find('ul.deck-class li').each(function(index, element)
	{
		var cname    = $( element ).find( 'span.card-name' ).first().text();
		var quantity = parseInt($( element ).find( 'span.card-count' ).first().text());
		var cost     = parseInt($( element ).find( 'span.card-cost' ).first().text());
		var cardid   = getCardIdFromNameCost('enus', cname, cost);

		if ( result.hero == 0)
			result.hero = getHeroFromCard( cardid );

		result.cards[result.cards.length] = { card: cardid, count: quantity };
	});

	return result;
}
// ///////////////
function importFromGameOfHearthStone(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	// Name
	result.name = $(html).find('h3').first().text().trim();
	if (result.name.indexOf(' - ') != -1)
		result.name = result.name.substr(0, result.name.indexOf(' - '));
	// Hero
	var elem = $(html).find('#blog-left > div.single-archive > div.short-title > div.pull-right > div.text-center > a');
	$(elem).removeClass('deckbuilder-class-selection-class');
	result.hero = getHeroClassFromName($(elem).attr('class'));
	// Cards
	$(html).find('a.collapsed-card').each(function(index, element)
	{
		var quantity = parseInt($(element).attr('data-count'));
		var name     = $(element).find('span.name').first().text();
		var cost     = parseInt($(element).find('span.cost').first().text());
		var cardid   = getCardIdFromNameCost('enus', name, cost);

		// Check for weird decks: more than 2 simple cards or more than 1 legendary
		if (( quantity > 2 ) || (( getQualityFromCard( cardid ) == 5 ) && ( quantity > 1 ))) result.isarena = true;

		result.cards[result.cards.length] = { card: cardid, count: quantity };
	});

	return result;
}
// ///////////////
function importFromBuffed(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	// Name
	result.name = $(html).find('h3.panel-title').first().text();
	// Hero
	var hero = $(html).find("td > a[class^='clc-']").first().text().toLowerCase().trim();
	result.hero = getHeroClassFromName(hero);
	// Cards
	// This one is tricky; We get all rows with sortable cells and we'll filter them
	var cells  = $(html).find("table.table tr td[data-sort-value!='']");
	var ncells = cells.length;
	// Skip first 7 cells found (with class name and author name)
	var offs   = 7;
	// 5 cells represent a card: quantity, name, cost, attack, health
	var aRow   = 5;
	var idx    = 0;
	// predefine vars to help garbage compiler
	var count;
	var cost
	var quantity;
	var name;
	var cardid;
	while ((pos = offs + idx*aRow) < ncells)
	{
		count = $(cells[pos]).text().trim();
		if (count != '')
		{
			quantity = parseInt(count.substr(0, count.indexOf('x')));
			name     = $(cells[pos + 1]).text().trim();
			cost     = parseInt($(cells[pos + 2]).text().trim());
			cardid   = getCardIdFromNameCost('enus', name, cost);

			result.cards[result.cards.length] = { card: cardid, count: quantity };
		}

		idx++;
	}

	return result;
}
// ///////////////
function importFromGosugamers(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	var span = $(html).find("div.header span.deck-title").first();
	// Name
	result.name = $(span).text().trim();
	// Hero
	$(span).removeClass('deck-title');
	var hero = $(span).attr('class').toLowerCase();
	while (hero.indexOf('-') != -1)
		hero = hero.substr(hero.indexOf('-') + 1);
	result.hero = getHeroClassFromName(hero);
	// Cards
	$(html).find("a[id^='deck-card-']").each(function(index, element)
	{
		var name     = $(element).find("span[class*='name']").first().text().trim();
		var cost     = parseInt($(element).find("span[class*='mana']").first().text().trim());
		var quantity = $(element).find("span[class='count']").first().text().trim();
		if (quantity == '')
			quantity = 1;
		else
			quantity = parseInt(quantity);

		// Adjust bad names
		if (name == 'Dr Boom') name = 'Dr. Boom';

		var cardid   = getCardIdFromNameCost('enus', name, cost);

		result.cards[result.cards.length] = { card: cardid, count: quantity };
	});

	return result;
}
// ///////////////
function importFromMillenium(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	// Name
	result.name = $(html).find("h1#titreActu").first().text().trim();
	// Hero
	var hero = $(html).find("img[src*='hearthstone_heros_']").first().attr('src');
	hero = hero.substr(hero.indexOf('hearthstone_heros_') + 18);
	hero = hero.substr(0, hero.indexOf('.'));
	hero = hero.substr( hero.indexOf( '_' ) + 1 );
	result.hero = getHeroClassFromName('frfr', hero);
	// Cards
	$(html).find("tr td > a[href*='hearthhead.com/card=']").each(function(index, element)
	{
		var cname = $( element ).attr( 'href' );
		cname = cname.substr( cname.indexOf( 'hearthhead.com/card=' ) + 20 );
		if ( cname.indexOf( '/' ) != -1 )
			cname = cname.substr( 0, cname.indexOf( '/' ) );
		var cardid = hearthhead_cards[parseInt( cname )].image;
		// count
		var tr = $(element).parent().prev().prev().text();
		var quantity = ( tr.indexOf( '2' ) != -1 ) ? 2 : ( ( tr.indexOf( '1' ) != -1 ) ? 1 : 0 );
		if ( quantity > 0 )
		{
			result.cards[result.cards.length] = { card: cardid, count: quantity };
			if ( result.hero == 0)
				result.hero = getHeroFromCard( cardid );
		}
	});
	$(html).find("tr td > strong > a[href*='hearthhead.com/card=']").each(function(index, element)
	{
		var cname = $(element).attr( 'href' );
		cname = cname.substr(cname.indexOf('hearthhead.com/card=') + 20);
		if (cname.indexOf('/') != -1)
			cname = cname.substr(0, cname.indexOf('/'));
		var cardid = hearthhead_cards[parseInt( cname )].image;
		// count
		var tr = $(element).parent().parent().prev().prev().text();
		var quantity = ( tr.indexOf( '2' ) != -1 ) ? 2 : ( ( tr.indexOf( '1' ) != -1 ) ? 1 : 0 );
		result.cards[result.cards.length] = { card: cardid, count: quantity };
			if ( result.hero == 0) 
				result.hero = getHeroFromCard( cardid );
	});

	return result;
}
// ///////////////
function importFromProESLGaming(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	// Name
	result.name = $(html).find("div.decklistdetails > h3").first().text().trim();
	// Cards
	$(html).find("div.cards > div.inner > div.decklist_compact div.carditem_container").each(function(index, element)
	{
		var quantity = parseInt($(element).find('div.num').first().text().trim());
		var cardid    = $(element).find('div.image > img').first().attr('src');
		cardid = cardid.substr(cardid.indexOf('/cards/') + 7);
		cardid = cardid.substr(0, cardid.indexOf('.'));
		result.cards[result.cards.length] = { card: cardid, count: quantity };
		if (result.hero == 0)
			result.hero = getHeroFromCard(cardid);
	});

	return result;
}
// ///////////////
function importFromPlayHS(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	// 2 Druida, 3 Cazador, 4 Mago, 5 Paladín, 6 Sacerdote, 7 Pícaro, 8 Chamán, 9 Brujo, 10 Guerrero
	var playhs_heroes = [ 0, 0, 11, 3, 8, 2, 5, 4, 7, 9, 1 ];
	var out  = '';
	// Name
	// We should use decodeURIComponent + escape because of our fancy acented vowels and tilded n (mainly) :3
	result.name = decodeURIComponent(escape($(html).find("h1.itemTitle").first().text().trim()));
	// Hero
	var Ref = $(html).find("table.tablamolonaplayhs tbody tr td > a[href*='buscar/?clase='] > img[src*='/deckbuild/img/']").first().parent().attr('href');
	result.hero = playhs_heroes[parseInt(Ref.substr(Ref.indexOf('?clase=') + 7))];
	// Cards
	$(html).find("table.tablamolonaplayhs tbody tr td > a[href*='/cartas-hs/es/'] > span").each(function(index, element)
	{
		var cname = $(element).text().trim();
		if (cname == "Retador de carnero") cname = "Criador de carneros";
		var count    = $(element).parent().parent().prev('td').text().trim();
		var quantity = parseInt(count.substr(0, count.indexOf('x')));
		var cost     = parseInt($(element).parent().parent().next('td').text().trim());
		var cardid   = getCardIdFromNameCost('eses', cname, cost);
		if (cardid != -1)
		{
			result.cards[result.cards.length] = { card: cardid, count: quantity };
		} else {
			out += '<br />' + quantity + 'x ' + cname;
		}
	});
	// errvalue 2 is warning; 1 is error; on warning, cards should be taken
	if (out != '')
	{
		result.errcode = "missing cards: " + out; // texts[locale].deckMissingCards + out;
		result.errvalue = 2;
	}

	return result;
}
// ///////////////
function importFromHeartstoneBuilder(jsonCards)
{
	var aDeck = JSON.parse(jsonCards);

	var result = { name: aDeck.name, hero: getHeroClassFromName(aDeck.class), cards: [], errcode: "", errvalue: 0 };

	for (var idx = 0; idx < aDeck.cards.length; idx++)
		result.cards[result.cards.length] = { card: hearthhead_cards[aDeck.cards[idx].id].image, count: aDeck.cards[idx].qty };

	return result;
}
// ///////////////
function importFromEliteDecks(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	// Check for missing cards (this page has weird spanish card names O.o)
	var out = '';
	// Name
	result.name = $(html).find("h2.dname").first().text().trim();
	// Hero
	var Hero = $(html).find("div.vmazoinfo img.heroedeck").first().attr('src');
	Hero = Hero.substr(0, Hero.indexOf('.')).substr(Hero.indexOf('decks/') + 7);
	if (Hero == 'arena')
		result.isarena = true;
	if (!result.isarena)
		result.hero = getHeroClassFromName(Hero);
	// Cards
	$(html).find("div.vmazolayer div.vminions ul.vminionslist li, div.vmazolayer div.vspells ul.vspellslist li").each(function(index, element)
	{
		var quantity = parseInt($(element).find('span.cantidad').first().text().trim());
		var coste    = parseInt($(element).find('span.costeCarta').first().text().trim());
		var name     = $(element).find('span.nombreCarta').first().text().trim();
		// Fix weird spanish card names
		if (name == "Raíces vivientes")
			name = "Raíces vivas";
		else if (name == "Robot sanador solariego")
			name = "Sanabot antiguo";

		var cardid = getCardIdFromNameCost('eses', name, coste);
		if (cardid == -1)
			cardid = getCardIdFromNameCost('enus', name, coste);

		if (cardid != -1)
		{
			if (result.hero == 0)
				result.hero = getHeroFromCard( cardid );
			result.cards[result.cards.length] = { card: cardid, count: quantity };
		}
		else
			out += '<br />' + quantity + 'x ' + name;
	});
	// errvalue 2 is warning; 1 is error; on warning, cards should be taken
	if (out != '')
	{
		result.errcode = texts[locale].deckMissingCards + out;
		result.errvalue = 2;
	}
	return result;
}
// ///////////////
function importFromInvenCoKr(html, text)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	// Name
	result.name = unescape($(html).find("div.title-box div.title-box-left span.title").first().text().trim());
	// Hero
	var Hero = $(html).find("div.hero-detail-wrap div.name2").first().text().trim().toLowerCase();
	Hero = Hero.substr(0, Hero.indexOf(' :')).trim();
	result.hero = getHeroClassFromName(Hero);
	// Cards
	var countTable = text.substr(text.indexOf('hsDeckSimul_init'));
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
		result.cards[result.cards.length] = {  card: hearthhead_cards[cardid].image, count: cards[cardid] };

	return result;
}
// ///////////////
function importFromHearthBuilder(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	// Name
	result.name = unescape(escape($(html).find('div.single-deck-title-wrap h2').first().text().trim()));
	// Hero
	var Hero = $(html).find('div > h4').first().text().trim().toLowerCase();
	Hero = Hero.substr(0, Hero.indexOf('cards -')).trim();
	result.hero = getHeroClassFromName(Hero);
	// Cards
	$(html).find("td > div[data-card-load*='/card/']").each(function(index, element)
	{
		var cardname = $(element).text().trim().toLowerCase();
		var idx      = cardname.indexOf('x ');
		var quantity = 1;
		if (idx != -1)
			quantity = parseInt(cardname.substr(idx + 2).trim());
		if( quantity > 1)
			cardname = cardname.substr(0, idx).trim();
		var cardcost = parseInt($(element).parent().next('td').next('td').text().trim());
		var cardid   = getCardIdFromNameCost('enus', cardname, cardcost);
		result.cards[result.cards.length] = { card: cardid, count: quantity };
	});

	return result;
}
// ///////////////
function importFromBlizzpro(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	// Name
	result.name = unescape(escape($(html).find("p strong > a[href*='/deck=']").first().text().trim()));
	if (result.name == "")
		result.name = $(html).find("div.trans-content h1.entry-title").first().text().trim();
	// Hero
	var Hero = $(html).find("p strong > a[href*='/deck=']").first().parent().parent().text().trim();
	Hero = Hero.substr(Hero.indexOf('Class: ') + 7).toLowerCase();
	result.hero = getHeroClassFromName(Hero);
	// Cards
	$(html).find("ul li > a[href*='/card=']").each(function(index, element)
	{
		var cardname = $(element).text().trim().toLowerCase();
		var linetext = $(element).parent().text().trim().toLowerCase().replace(cardname, '');
		var quantity = 1;
		var hhid = $(element).attr('href');
		hhid = parseInt(hhid.substr(hhid.indexOf('=') + 1, hhid.length));
		var idx      = linetext.indexOf('x');
		if (idx != -1)
			quantity = parseInt(linetext.substr(idx + 1).trim());
		var cardid = hearthhead_cards[hhid].image; // getCardIdFromName('enus', cardname);
		result.cards[result.cards.length] = { card: cardid, count: quantity };
		if (result.hero == 0)
			result.hero = getHeroFromCard( cardid );
	});

	return result;
}
// ///////////////
function importFromHSDeck(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	// Check for missing cards (this page has weird cards O.o)
	var out = '';
	// Hero
	var Hero = $(html).find("div.deck-viewer-options span.hero-portrait-transparent").first();
	$(Hero).removeClass('hero-portrait-transparent');
	Hero = $(Hero).attr('class').toLowerCase();
	result.hero = getHeroClassFromName(Hero);
	// Cards
	$(html).find("div.card-list-wrapper > ul li").each(function(index, element)
	{
		var cardname = $(element).attr('ctitle');
		var quantity = parseInt($(element).attr('ccount'));
		var cost     = parseInt($(element).attr('mana'));
		var cardid   = getCardIdFromNameCost('enus', cardname, cost);
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
		result.errcode = texts[locale].deckMissingCards + out;
		result.errvalue = 2;
	}

	return result;
}
// ///////////////
function importFromPlayHSCards(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	var out = '';
	// Name
	var name = $(html).find("div.main div.main-header").first().text().trim();
	if (name == '')
		name = $(html).find("div.main h1.main-header").first().text().trim();
	result.name = name;
	// Hero (this one is another aproach not language based)
	// var Hero = $(html).find("div.guide-view div.class div.image").first();
	// $(Hero).removeClass('image');
	// Hero = $(Hero).attr('class').substr($(Hero).attr('class').indexOf('-') + 1);
	var Hero = $(html).find("div.guide-view div.class div.title").first().text();
	result.hero = getHeroClassFromName('ruru', Hero);
	// Cards
	$(html).find("a[href*='playhscards.ru/cards/'][class*='single']").each(function(index, element)
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

	return result;
}
// ///////////////
function importFromIcyVeins(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0, isarena: false };

	// Name
	var name = $(html).find('h2#sec-2').first();
	$(name).find('span').remove();
	result.name = $(name).text().replace('2. ', '');
	// Hero
	result.hero = getHeroClassFromName('enus', $(html).find('table.deck_card_list tr th > span').first().attr('class'));
	// Cards
	$(html).find('table.deck_card_list tr td ul li').each(function(index, element)
	{
		var cname  = $(element).find('a').first().text();
		var count  = parseInt($(element).text().charAt(0));
		var hpwnid = $(element).find('a').first().attr('data-tooltip-href');
		hpwnid     = parseInt(hpwnid.substr(hpwnid.indexOf('cards/') + 6));
		var cardId = hearthpwn_cards[hpwnid].image; // getCardIdFromName('enus', cname);
		// Arena
		if ((count > 2) || ( (getQualityFromCard(cardId) == 5) && (count > 1))) result.isarena = true;
		result.cards[result.cards.length] = { card: cardId, count: count };
	});
	
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
		result.errcode  = texts[locale].exceptionthrown + e.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////