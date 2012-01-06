"use strict";
/**
 * player-birthday.js
 * show information about past and coming birthdays
 * @author jurosz, ryanli
 */

Foxtrick.util.module.register({
	MODULE_NAME : "PlayerBirthday",
	MODULE_CATEGORY : Foxtrick.moduleCategories.INFORMATION_AGGREGATION,
	PAGES : ['players','YouthPlayers'],

	run : function(doc) {
		// array of players
		var birthdayToday = new Array();
		var birthdayFuture = new Array();
		var birthdayPast = new Array();

		var playerList = Foxtrick.Pages.Players.getPlayerList(doc);

		for (var i = 0; i < playerList.length; ++i) {
			if (playerList[i].age !== undefined) {
				if (playerList[i].age.days === 0) {
					birthdayToday.push(playerList[i]);
				}
				else if (playerList[i].age.days > 105) {
					birthdayFuture.push(playerList[i]);
				}
				else if (playerList[i].age.days < 7) {
					birthdayPast.push(playerList[i]);
				}
			}
		}

		// sorting of arrays according to days and then years
		var sort = function(a, b) {
			var maxYears = 10000;
			return (a.age.days * maxYears + a.age.years) - (b.age.days * maxYears + b.age.years);
		}
		birthdayToday.sort(sort);
		birthdayFuture.sort(sort);
		birthdayPast.sort(sort);

		var parentDiv = Foxtrick.createFeaturedElement(doc, this, "div");
		parentDiv.id = "foxtrick_addactionsbox_parentDiv";

		var addType = function(parent, header, players) {
			if (players == null || players.length === 0) {
				return;
			}
			var div = doc.createElement("div");
			var caption = doc.createElement("h5");
			var captionText = doc.createTextNode(header);
			var list = doc.createElement("ul");
			parent.appendChild(div);
			div.appendChild(caption);
			div.appendChild(list);
			caption.appendChild(captionText);

			for (var i in players) {
				var item = doc.createElement("li");
				var player = players[i].nameLink.cloneNode(true);
				var age = doc.createTextNode(players[i].ageText);
				list.appendChild(item);
				item.appendChild(player);
				item.appendChild(age);
			}
		};

		addType(parentDiv, Foxtrickl10n.getString('foxtrick.tweaks.BirthdayToday'), birthdayToday);
		addType(parentDiv, Foxtrickl10n.getString('foxtrick.tweaks.BirthdayNextWeek'), birthdayFuture);
		addType(parentDiv, Foxtrickl10n.getString('foxtrick.tweaks.BirthdayLastWeek'), birthdayPast);

		// Append the box to the sidebar
		if (birthdayToday.length + birthdayFuture.length + birthdayPast.length > 0) {
			Foxtrick.addBoxToSidebar(doc,
				Foxtrickl10n.getString("foxtrick.tweaks.Birthdays"),
				parentDiv, 10);
		}
	}
});
