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
// Import deck from HearthHead HTML export
function importFromHearthHeadHTML(htmlText)
{
	var cardUrl   = 'http://www.hearthhead.com/card=';
	var innerText = '';
	var quantity  = 1;
	var idx       = 0;
	var result    = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try {
		// Read name
		result.name = $(htmlText).find('p > b > a, [class^=c]')[0].text;
		// Read hero from name class
		result.hero = parseInt($(htmlText).find('p > b > a, [class^=c]').attr('class').replace('c', ''));
		// Read cards from links and their quantity
		$(htmlText).find('li').each(function(index, element)
		{
			var innerText = $(this).html();
			var quantity = (innerText.indexOf('x2') > 0) ? 2 : 1;
			$(this).find('a').each(function(index, element)
			{
				var href = $(this).attr('href');
				if (href.indexOf(cardUrl) != -1)
				{
					var cardId = parseInt(href.substr(cardUrl.length));
					result.cards[result.cards.length] = { card: cardId, count: quantity };
				}
    	    });
	    });
	}
	catch(err)
	{
		result.errcode = texts[locale].parseerror + ":\n" + err.message;
		result.errvalue = 1;
	}

	return result;
}
// ///////////////
// Import deck from HearthPwn HTML export
function importFromHearthPwnHTML(html)
{
	var cardUrl   = 'http://www.hearthpwn.com/cards/';
	var innerText = '';
	var quantity	  = 1;
	var idx       = 0;
	var result    = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };

	try
	{
		var page = $.parseHTML(html);
		// Read name
		for (var idx in page)
			if ($(page[idx]).is("h3"))
			{
				result.name = $(page[idx]).text();
				break;
			}
		// Read cards and take hero if there's any class card
		$(page).find('li').each(function(index, element)
		{
			var quantity = ($(element).text().indexOf('2 x') != -1) ? 2 : 1;

			var href = $(element).find('a:first').attr('href');
			var separator = href.indexOf(cardUrl);
			if (separator != -1)
			{
				var cardId = hearthpwn_cards[parseInt(href.substr(0, href.indexOf('-')).substr(separator + cardUrl.length))].hearthheadid;

				result.cards[result.cards.length] = { card: cardId, count: quantity };

				// Check hero from HearthHead card class... If so, damn you HearthPwn for not help on this
				if (typeof(hs_cards[locale][cardId].classs) != "undefined")
					result.hero = hs_cards[locale][cardId].classs;
			}
	    });
	}
	catch(e)
	{
		result.errcode = e;
		result.errvalue = 1;
	}
	
	return result;
}
// ///////////////
// Import deck from HearthPwn HTML export
function importFromHearthStoneBuffedHTML(html)
{
	var result = { name: "", hero: 0, cards: [], errcode: "", errvalue: 0 };
	var alink  = '';
	var card   = '';
	var quantity;

	try
	{
		var page = $.parseHTML(html);

		// Cards
		$(page).each(function(index, element)
		{
			if ($(element).has("[href*='/card/']"))
			{
				alink = $(element).text().trim();
				if (alink != '')
				{
					quantity = (alink.indexOf('2x') != -1) ? 2 : ((alink.indexOf('1x') != -1) ? 1 : 0);
					if (quantity > 0)
					{
						card = $(element).attr('href');
						while (card.indexOf('-') != -1)
							card = card.substr(card.indexOf('-') + 1);

						card = parseInt(card);

						result.cards[result.cards.length] = { card: card, count: quantity };

						// Check hero from HearthHead card class... If so, damn you HearthStoneBuffed for not help on this
						if (typeof(hs_cards[locale][card].classs) != "undefined")
							result.hero = hs_cards[locale][card].classs;
					}
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
