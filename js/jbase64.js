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
// ////////////////////////////77
// Base64 object, with methods to encode/decode strings
var Base64 = 
{
    _charTable: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(input)
	{
        var output = '';
        var index  = 0;
        var enc1, enc2, enc3;
		var dec1, dec2, dec3, dec4;
 
        input = Base64._utf8_encode(input);
 
        while (index < input.length)
		{
            enc1 = input.charCodeAt(index++);
            enc2 = input.charCodeAt(index++);
            enc3 = input.charCodeAt(index++);

            dec1 = enc1 >> 2;
            dec2 = (enc1 & 3) << 4 | enc2 >> 4;
            dec3 = (enc2 & 15) << 2 | enc3 >> 6;
            dec4 = enc3 & 63;

            if (isNaN(enc2))
                dec3 = dec4 = 64;
            else if (isNaN(enc3))
                dec4 = 64;

            output += this._charTable.charAt(dec1) + this._charTable.charAt(dec2) + this._charTable.charAt(dec3) + this._charTable.charAt(dec4);
        }
        return output;
    },
    decode: function(input)
	{
        var output = '';
        var idx    = 0;
        var dec1, dec2, dec3;
        var enc1, enc2, enc3, enc4;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        while (idx < input.length)
		{
            enc1 = this._charTable.indexOf(input.charAt(idx++));
            enc2 = this._charTable.indexOf(input.charAt(idx++));
            enc3 = this._charTable.indexOf(input.charAt(idx++));
            enc4 = this._charTable.indexOf(input.charAt(idx++));

            dec1 = enc1 << 2 | enc2 >> 4;
            dec2 = (enc2 & 15) << 4 | enc3 >> 2;
            dec3 = (enc3 & 3) << 6 | enc4;

            output = output + String.fromCharCode(dec1);

            if (enc3 != 64)
                output += String.fromCharCode(dec2);
            if (enc4 != 64)
                output += String.fromCharCode(dec3);
        }

        output = Base64._utf8_decode(output);
        return output;
    },
    _utf8_encode: function(input)
	{
        input      = input.replace(/\r\n/g, "\n");
        var output = '';

        for (var idx = 0; idx < input.length; idx++)
		{
            var character = input.charCodeAt(idx);
            if (character < 128)
                output += String.fromCharCode(character);
            else if (character > 127 && character < 2048)
			{
                output += String.fromCharCode(character >> 6 | 192);
                output += String.fromCharCode(character & 63 | 128);
            } else {
                output += String.fromCharCode(character >> 12 | 224);
                output += String.fromCharCode(character >> 6 & 63 | 128);
                output += String.fromCharCode(character & 63 | 128);
            }
        }
        return output;
    },
    _utf8_decode: function(input)
	{
        var output = '';
        var idx = 0;
        var character = dec2 = dec3 = 0;
        while (idx < input.length)
		{
            character = input.charCodeAt(idx);
            if (character < 128)
			{
                output += String.fromCharCode(character);
                idx++;
            } else if (character > 191 && character < 224) {
                dec2 = input.charCodeAt(idx + 1);
                output += String.fromCharCode((character & 31) << 6 | dec2 & 63);
                idx += 2;
            } else {
                dec2 = input.charCodeAt(idx + 1);
                dec3 = input.charCodeAt(idx + 2);
                output += String.fromCharCode((character & 15) << 12 | (dec2 & 63) << 6 | dec3 & 63);
                idx += 3;
            }
        }
        return output;
    }
}

// Example: alert(Base64.decode(Base64.encode('Test encoding and decoding')));