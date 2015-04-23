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
var eyeIsOpen = false; // Eye state. will swap from true to false

// ///////////////
// After a random timeout (smaller for closed eye) it will swap eye cursor state (to simulate a blink :3)
function swapEyeState()
{
	var oldState = '';
	var newState = '';
	var maxseed = 5000;
	var minseed = 2000;

	if ( eyeIsOpen )
	{
		oldState = 'open';
		newState = 'closed';	
		maxseed = 200;
		minseed = 100;
	} else {
		oldState = 'closed';
		newState = 'open';
	}

	eyeIsOpen = !eyeIsOpen;

	$( '.eye' ).removeClass( oldState );
	$( '.eye' ).addClass( newState );

	setTimeout( swapEyeState, minseed + maxseed*Math.random() );
}
// ///////////////
// Start things at the begining ^^
$( document ).ready(function(e) {
	swapEyeState();
});