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
var defaultContainer = 'jhschartcontainer'; // Default ID to use for chart container
var BARHEIGHT        = 84; // Height for bars in the chart
var barLeft          = [24, 46, 68, 91, 113, 135, 157, 180]; // X coord. for texts and bars
// ///////////////
// I'll use this object to show my bar
var ajHSChart = null;
$(document).ready(function(e) 
{
	ajHSChart = new jHSChart(0, 0, '', defaultContainer);
});
// ///////////////
// Class to define a HS chart for mana, health and attack values of cards in deck
function jHSChart(x, y, type, container, valuesMana, valuesAttack, valuesHealth, valuesPie)
{
	this.container  = document.createElement('div');
	this.image      = document.createElement('div');
	this.background = document.createElement('div');
	this.mana       = [0, 0, 0, 0, 0, 0, 0, 0];
	this.attack     = [0, 0, 0, 0, 0, 0, 0, 0];
	this.health     = [0, 0, 0, 0, 0, 0, 0, 0];
	this.piedata    = [ { name:'', value:0 }, { name:'', value:0 }, { name:'', value:0 }];
	this.pieChart   = null;
	this.pieCanvas  = null;
	this.MAXMANA    = 1;
	this.MAXATTACK  = 1;
	this.MAXHEALTH  = 1;
	var parent = this;

	// Update values
	if (typeof(valuesMana)   != "undefined") this.setMana(valuesMana);
	if (typeof(valuesAttack) != "undefined") this.setAttack(valuesAttack);
	if (typeof(valuesHealth) != "undefined") this.setHealth(valuesHealth);
	if (typeof(valuesPie)    != "undefined") this.setPie(valuesPie);

	// Style stuff
	$(this.background).attr('class', 'jhschartbackground');
	$(this.container).attr('id', container);
	$(this.container).append(this.image);
	$(this.container).append(this.background);

	// Create buttons
	var btAttack = document.createElement('span');
	var btCost   = document.createElement('span');
	var btHealth = document.createElement('span');
	var btPie    = document.createElement('span');
	var btClose  = document.createElement('span');

	$(btAttack).addClass('jhschartbutton').addClass('jhschartbtattack');
	$(btAttack).bind('click', function(e)
	{
		parent.setType('attack');
	});
	$(btCost).addClass('jhschartbutton').addClass('jhschartbtcost');
	$(btCost).bind('click', function(e)
	{
		parent.setType('mana');
	});
	$(btHealth).addClass('jhschartbutton').addClass('jhschartbthealth');
	$(btHealth).bind('click', function(e)
	{
		parent.setType('health');
	});
	$(btPie).addClass('jhschartbutton').addClass('jhschartbtpie');
	$(btPie).bind('click', function(e)
	{
		parent.setType('pie');
	});
	$(btClose).addClass('jhschartbutton').addClass('jhschartbtclose');
	$(btClose).bind('click', function(e)
	{
		parent.Hide();
	});

	$(this.container).append(btAttack);
	$(this.container).append(btCost);
	$(this.container).append(btHealth);
	$(this.container).append(btPie);
	$(this.container).append(btClose);

	this.setType(type);
	this.MoveTo(x, y);
	$(this.container).hide();

	$(document.body).append(this.container);
}
jHSChart.prototype.addABar = function(parent, idx, counter, height)
{
	var column = document.createElement('span');
	$(column).attr('class', 'jhschartbar');
	$(column).css('height', height + 'px');
	$(column).css('left', barLeft[idx] + 'px');
	$(parent).append(column);

	var count = document.createElement('span');
	$(count).attr('class', 'jhschartcounter');
	$(count).css('left', barLeft[idx] + 'px');
	$(count).html(counter);

	$(parent).append(count);
}
jHSChart.prototype.Populate = function()
{
	var values;
	var MAX;

	this.Clear();
	if (this.type == 'attack')
	{
		values = this.attack;
		MAX    = this.MAXATTACK;
	} else if (this.type == 'mana') {
		values = this.mana;
		MAX    = this.MAXMANA;
	} else if (this.type == 'health') {
		values = this.health;
		MAX    = this.MAXHEALTH;
	} else if (this.type == 'pie') {
		// Do a pie chart
		this.Clear();

		var data = [
    	{
        	value: this.piedata[0].value, // minion
        	color: "#FDB45C",
        	highlight: "#FFC870",
        	label: this.piedata[0].name
    	},
    	{
        	value: this.piedata[1].value, // spell
        	color: "#46BFBD",
        	highlight: "#5AD3D1",
        	label: this.piedata[1].name
    	},
    	{
        	value: this.piedata[2].value, // weapon
        	color:"#F7464A",
        	highlight: "#FF5A5E",
        	label: this.piedata[2].name
    	}];

		this.pieCanvas = document.createElement('canvas');
		$(this.pieCanvas).addClass('jhschartpiechart');
		$(this.container).append(this.pieCanvas);

		$('.jhschartpiechart').each(function(index, element)
		{
			var context = element.getContext('2d');
			this.pieChart = new Chart(context).Pie(data);
		});
		return;
	} else
		return;
	// Do bar chart
	for (var idx = 0; idx < values.length; idx++)
		this.addABar(this.container, idx, values[idx], Math.floor(values[idx]*BARHEIGHT / MAX));
}
jHSChart.prototype.setType = function(type)
{
	if ((type != 'attack') && (type != 'health') && (type != 'mana') && (type != 'pie')) return;

	$(this.image).removeClass('jhschart' + this.type);
	this.type = type;
	$(this.image).addClass('jhschart' + this.type);
	this.Populate();
}
jHSChart.prototype.Clear = function()
{
	$(this.container).find('span.jhschartbar').remove();
	$(this.container).find('span.jhschartcounter').remove();
	$(this.container).find('.jhschartpiechart').remove();
	if (this.pieCanvas != null)
	{
		$(this.pieCanvas).remove();
		delete this.pieChart;
		delete this.pieCanvas;
		this.pieChart  = null;
		this.pieCanvas = null;
	}
}
jHSChart.prototype.Remove = function()
{
	this.Clear();
	$(this.image).remove();
	$(this.background).remove();
	$(this.container).remove();
}
jHSChart.prototype.setMana = function(mana)
{
	// Assign values
	this.mana    = mana.slice();
	this.MAXMANA = 1;
	// Calculate max. value
	for (var idx = 0; idx < mana.length; idx++)
	{
		if (this.mana[idx] > this.MAXMANA)
			this.MAXMANA = this.mana[idx];
	}
	// Populate if necessary
	if (this.type == 'mana')
	{
		this.Populate();
	}
}
jHSChart.prototype.setAttack = function(attack)
{
	// Assign values
	this.attack    = attack.slice();
	this.MAXATTACK = 1;
	// Calculate max. value
	for (var idx = 0; idx < attack.length; idx++)
	{
		if (this.attack[idx] > this.MAXATTACK)
			this.MAXATTACK = this.attack[idx];
	}
	// Populate if necessary
	if (this.type == 'attack')
	{
		this.Populate();
	}
}
jHSChart.prototype.setHealth = function(health)
{
	// Assign values
	this.health    = health.slice();
	this.MAXHEALTH = 1;
	// Calculate max. value
	for (var idx = 0; idx < health.length; idx++)
	{
		if (this.health[idx] > this.MAXHEALTH)
			this.MAXHEALTH = this.health[idx];
	}
	// Populate if necessary
	if (this.type == 'health')
	{
		this.Populate();
	}
}
jHSChart.prototype.setPie = function(pie)
{
	// Assign values
	this.piedata    = pie.slice();
	// Populate if necessary
	if (this.type == 'pie')
	{
		this.Populate();
	}
}
jHSChart.prototype.updatePieLabels = function(minion, spell, weapon)
{
	console.log('updating to ' + minion + ', ' + spell + ', ' + weapon);
	if (this.piedata == null) return;
	console.log('updated');
	this.piedata[0].name = minion;
	this.piedata[1].name = spell;
	this.piedata[2].name = weapon;
	// Populate if necessary
	if (this.type == 'pie')
	{
		this.Populate();
	}
}
jHSChart.prototype.Hide = function(delay)
{
	delay = delay | 500;
	$(this.container).hide(delay);
}
jHSChart.prototype.Show = function(delay)
{
	delay = delay | 500;
	$(this.container).show(delay);
}
jHSChart.prototype.MoveTo = function(x, y)
{
	$(this.container).css('top', y + 'px');
	$(this.container).css('left', x + 'px');
}
// ///////////////
