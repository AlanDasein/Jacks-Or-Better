$(document).ready(function() {
	
	var dom = new function() {
		
		this.form = $("section.form"),
		this.screen = $("section.screen"),
		
		this.amount = $("#amount"),
		this.credits = $("#credits"),
		this.start = $("#start")
		
	}
	
	var cons = new function() {
		
		this.LABELS = ["ROYAL FLUSH", "STRAIGHT FLUSH", "4 OF A KIND", "FULL HOUSE", "FLUSH", "STRAIGHT", "3 OF A KIND", "TWO PAIR", "JACKS OR BETTER"],
		this.VALUES = [250, 50, 25, 9, 6, 4, 3, 2, 1],
		this.SUITES = [24, 27, 29, 30], //spade, club, heart, diamond
		this.COLORS = ["black", "black", "red", "red"], //suite colors, black for spade and club, red for heart and diamond
		this.BETS = 5,
		this.CARDS = 5
		
	}
	
	var vars = new function() {
		
		this.amount = 100,
		this.credits = 100,
		this.bet = 1,
		this.hand = 0,
		this.blinking = 0,
		this.addition = 0
		
	}
	
	var tools = new function() {
		
		this.numeric = function (_key, _decimal) {
			
			var aux = _decimal ? _key == 110 || _key == 190 : _key == 13;
			
			return aux || _key == 8 || _key == 9 || _key == 46 || (_key >= 35 && _key <= 40) || (_key >= 48 && _key <= 57) || (_key >= 96 && _key <= 105);
			
		}
		
	}
	
	var app = new function() {
		
		this.init = function() {
			
			var row, style;
			var table = $("<table/>");
			
			if(dom.amount.val() > 0 && dom.credits.val() > 0) {
				
				vars.amount = dom.amount.val();
				vars.credits = dom.credits.val();
				
			}
			
			vars.amount /= vars.credits;
			
			table.appendTo(dom.screen);
			
			for(var i = 0, j = cons.LABELS.length;i < j;i++) {
				
				row = $("<tr/>");
				row.appendTo(table);
				
				$("<td/>", {"class": "labels", "html": cons.LABELS[i]}).appendTo(row);
				
				for(var k = 0;k < cons.BETS;k++) {
				
					style = k == 0 ? "bets selected" : k == (cons.BETS - 1) ? "bets max" : "bets";
					
					$("<td/>", {"class": style, "html": (i == 0 && k == cons.BETS - 1) ? "4000" : cons.VALUES[i] * (k + 1)}).appendTo(row);
					
				}
				
			}
			
			for(var i = 0;i < cons.CARDS;i++) {
				
				row = $("<div/>", {"class": "columnleft panel"});
				row.appendTo(dom.screen);
				
				$("<div/>", {"class": "led invisible", "html": "HOLD"}).appendTo(row);
				$("<div/>", {"class": "card back"}).appendTo(row);
				
			}
			
			$("<div/>", {"class": "columnclear"}).appendTo(dom.screen);
			$("<div/>", {"class": "columnleft report hide", "id": "pay"}).appendTo(dom.screen);
			$("<div/>", {"class": "columnright report", "id": "assets", "html": vars.credits + " CREDITS"}).appendTo(dom.screen);
			$("<div/>", {"class": "columnclear"}).appendTo(dom.screen);
			$("<div/>", {"class": "columnleft info", "html": "BET 1"}).appendTo(dom.screen);
			
			row = $("<div/>", {"class": "columnright buttonbig link"}).appendTo(dom.screen);
			$("<div/>", {"class": "frame", "html": "DEAL"}).appendTo(row);
			
			row = $("<div/>", {"class": "columnright buttonsmall"}).appendTo(dom.screen);
			$("<div/>", {"class": "active link surface link", "html": "BET MAX"}).appendTo(row);
			
			row = $("<div/>", {"class": "columnright buttonsmall"}).appendTo(dom.screen);
			$("<div/>", {"class": "active link surface link", "html": "BET ONE"}).appendTo(row);
			
			$("<div/>", {"class": "columnclear jump"}).appendTo(dom.screen);
			
			row = $("footer");
			$("<b>Your Progress: <span class='flag red'>0</span> BTC</b>").appendTo(row);
			$("<a href='index.html' class='columnright'>restart the game</a>").appendTo(row);
			
			dom.rows = $("tr");
			dom.leds = $("div.led");
			dom.cards = $("div.card");
			dom.pay = $("#pay");
			dom.assets = $("#assets");
			dom.info = $("div.info");
			dom.play = $("div.frame");
			dom.bets = $("div.surface");
			dom.earnings = $("span.flag");
			
			dom.form.addClass("hide");
			dom.screen.removeClass("hide");
			
			assign.add();
			
		},
		
		this.reset = function(_objects, _actions) {
			
			for(var i = 0, j = _objects.length;i < j;i++) {
				
				if(_objects[i] == "BET"){ //turn on/off bets buttons
				
					dom.bets.each(function() {$(this).removeClass(_actions[i] == "on" ? "inactive" : "active").addClass(_actions[i] == "on" ? "active" : "inactive");});
					
				}
				
				if(_objects[i] == "PLAY"){ //turn on/off deal/draw button
				
					dom.play.parent().toggleClass("disable", _actions[i] == "off");
					
				}
				
				if(_objects[i] == "MARK"){ //remark column of current bet
					
					dom.rows.each(function() {
						
						$(this).find("td.selected").removeClass("selected");
						$(this).find("td").eq(vars.bet).addClass("selected");
						
					});
					
				}
				
				if(_objects[i] == "LINE"){ //unmark obtained hand and bet
					
					clearInterval(vars.blinking);
					dom.rows.find("td.white").each(function() {$(this).removeClass("white");});
					
				}
				
				if(_objects[i] == "WIN"){ //display or hide the "winning" text
					
					dom.pay.toggleClass("hide", _actions[i] == "off");
					
				}
				
				if(_objects[i] == "CARDS"){ //turn on/off cards as clickables
					
					dom.cards.each(function() {$(this).toggleClass("link", _actions[i] == "on");});
					
				}
				
				if(_objects[i] == "COVER"){ //put the cards face down
					
					dom.cards.each(function() {$(this).html("").removeClass("front red black").addClass("back");});
					
				}
				
				if(_objects[i] == "LED"){ //hide the holding sign
					
					dom.leds.each(function() {$(this).addClass("invisible");});
					
				}
				
			}
			
		},
		
		this.toBet = function(_button) {
			
			if(_button.hasClass("active")) {
				
				var allin = _button.html().indexOf("MAX") >= 0;
				var max = vars.credits < cons.BETS ? vars.credits : cons.BETS;
				
				vars.bet = allin ? max : vars.bet == max ? 1 : vars.bet + 1;
				
				dom.info.html("BET " + vars.bet);
				
				app.reset(["WIN", "MARK", "LINE", "LED"], ["off"]);
				
				if(allin) {app.toDeal();}
				
			}
			
		},
		
		this.toDeal = function() {
			
			if(!dom.play.parent().hasClass("disable")) {
				
				var panels, rand, sign, suite, color;
				var timer = 0, counter = 0;
				var serie = "";
				var action = dom.play.html();
				
				app.reset(["BET", "PLAY", "WIN", "CARDS", "LINE", action == "DEAL" ? "COVER" : "", action == "DEAL" ? "LED" : ""], ["off", "off", "off", "off", "off"]);
				
				if(action == "DEAL") {
					
					vars.credits -= vars.bet;
					
					dom.assets.html(vars.credits + " CREDITS");
					dom.earnings.html(Number(dom.earnings.html()) - (vars.amount * vars.bet));
					
				}
				
				panels = dom.screen.find("div.invisible");
				
				timer = setInterval(
					
					function() {
						
						if(counter == panels.length) {
							
							clearInterval(timer);
							
							dom.play.html(action == "DEAL" ? "DRAW" : "DEAL");
							
							app.toAnalyze();
							
						}
						else {
							
							do {
								
								sign = Math.ceil(Math.random() * 13);
								rand = Math.floor(Math.random() * cons.SUITES.length);
								suite = cons.SUITES[rand];
								color = cons.COLORS[rand];
								
							}
							while(serie.indexOf(sign + "_" + suite + ",") >= 0);
							
							serie += (sign + "_" + suite + ",");
							
							switch(sign) {
								
								case 1: sign = "A";break;
								case 11: sign = "J";break;
								case 12: sign = "Q";break;
								case 13: sign = "K";break;
								
							}
							
							panels.eq(counter++).parent().find("div.card").removeClass("back").addClass("front " + color).
							html("<div class='sign'>" + sign + "</div><div class='suite'>&#98" + suite + ";</div>");
							
						}
						
					},
					
					100
					
				);
				
			}
			
		},
		
		this.toHold = function(_card) {
			
			if(dom.cards.eq(_card).hasClass("link")) {
			
				dom.leds.eq(_card).toggleClass("invisible", !dom.leds.eq(_card).hasClass("invisible"));
				
			}
			
		},
		
		this.toAnalyze = function() {
			
			var signs = [], suites = [], groups = {};
			var J = 11, Q = 12, K = 13, A = 14;
			var flush, straight, max, pair, aux;
			
			for(var i = 0;i < cons.CARDS;i++) {
				
				signs.push(eval(dom.cards.eq(i).find("div.sign").html()));
				suites.push(dom.cards.eq(i).find("div.suite").html());
				
			}
			
			signs.sort(function(a, b){return a - b;});
			
			if(signs[0] == 2 && signs[cons.CARDS - 1] == A) {
				
				aux = signs[cons.CARDS - 1];
				signs[cons.CARDS - 1] = cons.CARDS + 1;
				
			}
			
			straight = signs.reduce(function(a, b){return ((a + 1) == b) ? b : false;}) == signs[cons.CARDS - 1];
			flush = suites.reduce(function(a, b){return (a == b) ? a : false;});
			
			if(aux) {signs[cons.CARDS - 1] = aux;}
			
			if(straight || flush) {vars.hand = (straight && flush) ? signs[0] == 10 ? 1 : 2 : flush ? 5 : 6;}
			else{
				
				signs.forEach(function(x) {groups[x] = (groups[x] || 0) + 1;});
				
				aux = Object.keys(groups).length;
				max = Math.max.apply(null, Object.keys(groups).map(function(key) {return groups[key];}));
				pair = Math.max.apply(null, Object.keys(groups).map(function(key) {return key * groups[key];}));
				
				vars.hand = max == 4 ? 3 : max == 3 ? aux == 2 ? 4 : 7 : aux == 3 ? 8 : (aux == 4 && pair > 20) ? 9 : 0;
				
			}
			
			app.toSolve();
			
		},
		
		this.toSolve = function() {
			
			var labels, calc;
			var counter = 0;
			
			labels = dom.rows.eq(vars.hand - 1).find("td");
			
			if(vars.hand > 0) {
				
				labels.eq(0).addClass("white");
				labels.eq(vars.bet).addClass("white");
				
				vars.blinking = setInterval(
					
					function() {
						
						labels.eq(0).toggleClass("white", !labels.eq(0).hasClass("white"));
						labels.eq(vars.bet).toggleClass("white", !labels.eq(vars.bet).hasClass("white"));
						
					},
					
					500
					
				);
				
				if(dom.play.html() == "DEAL") {
					
					app.reset(["WIN"], ["on"]);
					
					dom.earnings.html(Number(dom.earnings.html()) + (vars.amount * labels.eq(vars.bet).html()));
					
					calc = vars.credits + Number(labels.eq(vars.bet).html());
					
					vars.addition = setInterval(
						
						function() {
							
							if(vars.credits < calc) {
								
								vars.credits++;
								
								dom.pay.html("WIN " + (++counter));
								dom.assets.html(vars.credits + " CREDITS");
								
							}
							else {
								
								clearInterval(vars.addition);
								
								app.reset(["BET", "PLAY"], ["on", "on"]);
								
							}
							
						},
						
						100
						
					);
					
				}
				else {app.reset(["CARDS", "PLAY"], ["on", "on"]);}
				
			}
			else {app.reset([dom.play.html() == "DEAL" ? "BET" : "CARDS", "PLAY"], ["on", "on"]);}
			
			if(dom.play.html() == "DEAL" && vars.bet > vars.credits) {
				
				vars.bet = 1;
				
				dom.info.html("BET " + vars.bet);
				
				app.reset(["MARK"], []);
				
				if(vars.credits == 0) {
					
					dom.assets.html("GAME OVER");
					
					app.reset(["BET", "PLAY"], ["off", "off"]);
					
				}
				
			}
			
			dom.earnings.toggleClass("green", dom.earnings.html() > 0);
			
		}
		
	}
	
	var assign = new function() {
		
		dom.amount.on("keydown paste", function(e) {return tools.numeric(e.charCode || e.keyCode || 0, true);});
		dom.credits.on("keydown paste", function(e) {return tools.numeric(e.charCode || e.keyCode || 0, false);});
		
		dom.start.on("click", function() {app.init();});
		
		this.add = function() {
			
			dom.play.on("click", function() {app.toDeal();});
			dom.bets.on("click", function() {app.toBet($(this));});
			dom.cards.each(function(i) {$(this).on("click", function() {app.toHold(i);});});
			
		}
		
	}
	
});