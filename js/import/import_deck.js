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
// Import deck from HearthHead deckbuilder URL
function importFromHearthHeadBuilder(url)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	var hash = url.substring(url.indexOf('#'));
	var deck = $WH.calc.hash.getCardsFrom(hash, true);
	if (!deck)
	{
		result.errcode = texts[locale].urlerror;
		result.errvalue = 1;
	} else {
		// Read hero
		result.hero = deck.classs;
		// Read cards
		for (var card in deck.cards)
			result.cards[result.cards.length] = { card: deck.cards[card].id, count: deck.cards[card].count };
	}

	return result;
}
// ///////////////
// Import deck from HearthPwn deckbuilder URL
function importFromHearthPwnBuilder(url)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	var deckStr = url.substr(url.indexOf('deckbuilder/') + 12);
	// Check if it ends in ; to avoid an empty card error
	if (deckStr.charAt(deckStr.length - 1) === ';')
		deckStr = deckStr.substr(0, deckStr.length - 1);

	var separator = deckStr.indexOf('#');

	result.hero = getHeroClassFromName(deckStr.substr(0, separator));

	var cards = deckStr.substr(separator + 1).split(';');

	for (var idx in cards)
	{
		var aux = cards[idx].split(':');
		result.cards[result.cards.length] = { card: hearthpwn_cards[aux[0]].hearthheadid, count: aux[1] };
	}

	return result;
}
// ///////////////
// Import deck from HearthStone.Buffed.de deckbuilder URL
function importFromHearthStoneBuffedBuilder(url)
{

	var heroes = [ 'neutral', '?', 'druid', 'hunter', 'mage', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior' ];

	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	var deckStr = Base64.decode(url.substr(url.indexOf('#') + 1));

	var separator = deckStr.indexOf('|');

	var hero = heroes[parseInt(deckStr.substr(0, separator))];
	result.hero = getHeroClassFromName(hero);

	var cards = deckStr.substr(separator + 1).split(';');

	for (var idx in cards)
	{
		var aux       = cards[idx].split(':');
		var cardid    = parseInt(aux[0]);
		var cardcount = parseInt(aux[1]);

		result.cards[result.cards.length] = { card: cardid, count: cardcount };
	}

	return result;
}
// ///////////////
// Import deck from Gosugamers deckbuilder URL
function importFromGosugamersBuilder(url)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };
	var hash   = url;

	while (hash.indexOf('/') != -1)
		hash = hash.substr(hash.indexOf('/') + 1);
	hash = hash.split('#');

	var hero = hash[0];
	var Cards = Base64.decode(hash[1]);
	Cards = Cards.split(';');

	result.hero = getHeroClassFromName(hero);

	var name;
	var cardid;
	var pos;
	var idx;

	for (idx = 1; idx < Cards.length; idx++)
	{
		name = gosugamers_cards[parseInt(Cards[idx])].name;
		cardid = parseInt(getCardIdFromName('enus', name));

		for (pos = 0; pos < result.cards.length; pos++)
			if (result.cards[pos].id == cardid)
			{
				result.cards[pos].count++;
				break;
			}
		if (pos >= result.cards.length)
			result.cards[result.cards.length] = { card: cardid, count: 1 };
	}

	return result;
}
// ///////////////