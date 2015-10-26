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
// ///////////////
// Conversion table for non translated help files yet
var flipTranslations = {
	'enus':'enus', 'engb':'enus', 'eses':'eses', 'esla':'eses', // done
	'itit':'enus', 'frfr':'enus', 'dede':'enus', 'plpl':'enus',
	'ptpt':'enus', 'ptbr':'enus', 'ruru':'enus', 'kokr':'enus',
	'zhcn':'enus', 'zhtw':'enus', 'jajp':'enus'
	};

// ///////////////
// Flipper functions
// ///////////////
function flipFront(e)
{
	var event = e || window.event;
	$(".flipbox").flippy({
    	duration: "400",
		depth: "7.5", 
    	verso: "<div id=\"flip_card\" class=\"flip_middle\" style=\"background-image:url('" + helpUrl + flipTranslations[locale] + "/hearthhelper.jpg');\" onclick=\"flipMiddle(event);\"></div>"
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
    	verso: "<div id=\"flip_card\" class=\"flip_back\" style=\"background-image:url('" + helpUrl + flipTranslations[locale] + "/hearthhelper_back.jpg');\" onclick=\"flipBack(event);\"></div>"
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
    	verso: "<div id=\"flip_card\" class=\"flip_front\" style=\"background-image:url('" + helpUrl + flipTranslations[locale] + "/hearthhelper_front.jpg');\" onclick=\"flipFront(event);\"></div>"
 	});
	event.stopPropagation();
}
// ///////////////
function updateFlipLocale(locale)
{
	if ($('#flip_card').hasClass('flip_middle'))
    	$('#flip_card').css("background-image", "url('" + helpUrl + flipTranslations[locale] + "/hearthhelper.jpg')");
	else if ($('#flip_card').hasClass('flip_back'))
    	$('#flip_card').css("background-image", "url('" + helpUrl + flipTranslations[locale] + "/hearthhelper_back.jpg')");
	else if ($('#flip_card').hasClass('flip_front'))
    	$('#flip_card').css("background-image", "url('" + helpUrl + flipTranslations[locale] + "/hearthhelper_front.jpg')");
}