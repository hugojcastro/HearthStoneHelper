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
// Assigns to "body" a cursor with an eye blinking :D
(function( eyeCursor, $, undefined )
{
	// ///////////////
	// Define states for eye cursor
	var EYESTATES =
	{
		CLOSED: { value:0, name: "Closed", next: null, maxseed: 200,  minseed: 100,  file: "url(images/eye_closed.png), auto" },
		HALFED: { value:1, name: "Halfed", next: null, maxseed: 100,  minseed: 50,   file: "url(images/eye_halfed.png), auto" },
		OPENED: { value:2, name: "Opened", next: null, maxseed: 5000, minseed: 1500, file: "url(images/eye_opened.png), auto" }
	};
	// Define "flow" of states
	EYESTATES.CLOSED.next = EYESTATES.HALFED;
	EYESTATES.HALFED.next = EYESTATES.OPENED;
	EYESTATES.OPENED.next = EYESTATES.CLOSED;
	// Initialize
	var eyeState = EYESTATES.CLOSED;

	// ///////////////
	// Travel across eye states, using short delays for blink, longer delays for open eye
	eyeCursor.blink = function()
	{
		eyeState = eyeState.next;
		$( 'body' ).css( 'cursor', eyeState.file );

		setTimeout( eyeCursor.blink, eyeState.minseed + eyeState.maxseed*Math.random() );
	}
}( window.eyeCursor = window.eyeCursor || {}, jQuery ));

// ///////////////
// Start things at the begining ^^
$( document ).ready( function( e )
{
	eyeCursor.blink();
} );

