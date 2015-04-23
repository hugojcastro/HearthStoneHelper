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
// Storage and Cookie stuff
// Store array into localStorage or cookie
function storeOnStorage(elem, storage)
{
	// Use localStorage before cookies
	if (typeof(localStorage) != "undefined")
	{
		// If no decks, clear storage
		if ((elem == null) || (elem.length == 0))
		{
			localStorage.removeItem(storage);
		} else {
			localStorage.setItem(storage, JSON.stringify(elem));
		}
	} else {
		// If no decks, clear cookie (assign null and delete it, to be sure)
		if ((elem == null) || (elem.length == 0))
		{
			$.cookie(storage, null, { expires: -1 });
			$.removeCookie(storage);
		} else {
			// Cookie expiration time: 1 year (365*24*60*60*1000 = 31536000000)
			var date = new Date();
			date.setTime(date.getTime() + 31536000000);
			$.cookie(storage, JSON.stringify(elem), { expires: date });
		}
	}
}
// ///////////////// ///////////////// ///////////////// ///////////////
// Retrieve array from localStorage or cookie
// Use: value = retrieveFromStorage(storageName);
function retrieveFromStorage(storage)
{
	var json_str = "";
	var value;

	// Use localStorage before cookies
	if (typeof(localStorage) != "undefined")
	{
		json_str = localStorage.getItem(storage);
	} else if (((typeof($.cookie()) != "undefined") && ($.cookie(storage) !== undefined))) {
		json_str = $.cookie(storage);
	}

	if (json_str != "")
	{
		value = JSON.parse(json_str);
		// Avoid null on first use
		if (value == null)
			value = [];
	}

	return value;
}
// ///////////////// ///////////////// ///////////////// ///////////////
