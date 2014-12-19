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
// Flipper functions
// ///////////////
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