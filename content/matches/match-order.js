"use strict";
/**
 * match-order.js
 * Foxtrick moatch oder interface tweaks
 * @author convinced
 */

Foxtrick.util.module.register({
	MODULE_NAME : "MatchOrderInterface",
	MODULE_CATEGORY : Foxtrick.moduleCategories.MATCHES,
	PAGES : ['matchOrder'],
	CSS : Foxtrick.InternalPath + "resources/css/match-order.css",

	run : function(doc) {
		var fieldOverlay = doc.getElementById('fieldOverlay');
		var list = doc.getElementById('list');
		
		var lastNumbers = new Array(7);
		var showLevelNumbers = function(ev) {
			var overlayRatings = fieldOverlay.getElementsByClassName('overlayRatings');
			
			var copyRatings = function(ev) {
				var text = '';
				
				// the teams. highlight own team
				var h2 = doc.getElementsByTagName('h2')[0];
				var thisTeam = h2.getElementsByTagName('a')[0].textContent;
				var bothTeams = h2.getElementsByTagName('a')[1].textContent.replace(thisTeam, '[b]' + thisTeam + '[/b]');
				text += bothTeams+'\n';
				
				// match link
				var matchid = Foxtrick.util.id.getMatchIdFromUrl(doc.location.href);
				text += '[matchid=' + matchid + ']'+'\n\n';
				
				// ratings
				text += '[table][tr][th colspan=3 align=center]' + doc.getElementById('calcRatingsClone').value + '[/th][/tr]\n';
				for (var i=0,count=0; i< overlayRatings.length-1;++i) {
					if (i==0 || i==6 || i==8) {
						text += '[tr]'
					}
					if (i==6) 
						// midfield
						text += '[td colspan=3 align=center]' 
					else {
						if (i%2==0) 
							text += '[td align=center]' 
					}
					
					if (Foxtrick.hasClass(overlayRatings[i],'posLabel')) {
						// sector label
						text += '[b]'+overlayRatings[i].textContent+'[/b]\n';
					}
					else {
						// sector rating
						text += overlayRatings[i].textContent + '\n';
						text += doc.getElementById('ft-full-level' + count++).textContent +'[/td]';
					}
					if (i==5 || i==7 || i==13) {
						text += '[/tr]'
					}
				}
				text += '[/table]';
				
				// formation
				var formations = Foxtrick.stripHTML(doc.getElementById('formations').innerHTML);
				text += formations +'\n';
				
				// pic/mots
				var speechLevelDiv = doc.getElementsByClassName('speechLevel')[0].cloneNode(true);
				text += speechLevelDiv.innerHTML.split('<select')[0].replace(/\s\s+/g,' ');
				
				var speechLevel_select = doc.getElementById('speechLevel');
				var speechLevel = speechLevel_select.options[speechLevel_select.selectedIndex].textContent;
				text += '[u]' + speechLevel + '[/u]\n';
				
				// tactics
				var teamtacticsDiv = doc.getElementById('tactics').cloneNode(true);
				teamtacticsDiv.removeChild(teamtacticsDiv.getElementsByClassName('speechLevel')[0]);
				teamtacticsDiv.removeChild(teamtacticsDiv.getElementsByTagName('select')[0]);
				text += teamtacticsDiv.innerHTML.replace(/\<[^\>]+?\>/g,'').replace(/\s\s+/g,' ');
				
				var teamtactics_select = doc.getElementById('teamtactics');
				var tactics = teamtactics_select.options[teamtactics_select.selectedIndex].textContent;
				text += '[u]'+tactics +'[/u] / ';
				text += doc.getElementById('tacticLevelLabel').textContent+'\n';
				
				Foxtrick.copyStringToClipboard(text);
				var note = Foxtrick.util.note.add(doc, doc.getElementById('copyRatingsButton').nextSibling, "ft-ratings-copy-note", Foxtrickl10n.getString("CopyRatings.copied"), null, true);
			};
			
			for (var i=0,count=0; i< overlayRatings.length-1;++i) {
				if (Foxtrick.hasClass(overlayRatings[i],'posLabel'))
					continue;
				var text = overlayRatings[i].textContent;
				var fullLevel = Foxtrickl10n.getLevelFromText(text);
				if (fullLevel) { 
					var levelText ='['+fullLevel.toFixed(2)+']';
					var id = 'ft-full-level' + count;
					if (lastNumbers[count] !== undefined) { 
						var div = doc.getElementById(id);
						div.textContent = levelText;
						var diff = fullLevel-lastNumbers[count];
						var span = doc.createElement('span');
						span.textContent = ' ['+diff.toFixed(2)+']';
						if (diff < 0) 
							span.setAttribute('style','color:red;');
						else if (diff > 0) 
							span.setAttribute('style','color:blue;');
						div.appendChild(span);
					}
					else {
						var div = doc.createElement('div');
						div.id = id;
						div.textContent = levelText;
					}
					overlayRatings[i].parentNode.insertBefore(div, overlayRatings[i].nextSibling);
					lastNumbers[count++] = fullLevel;
				}
			}
			
			// open first time
			if (!doc.getElementById('calcRatingsClone')) {
				
				Foxtrick.util.inject.jsLink(doc, Foxtrick.InternalPath+"resources/js/matchOrder.js");
				
				var hideOverlay = function(ev) {
					Foxtrick.removeClass(fieldOverlay,'visible');
				};
				var closeOverlayButton = doc.getElementById('closeOverlay');
				closeOverlayButton.addEventListener('click',hideOverlay,false);
				Foxtrick.addClass(fieldOverlay,'visible');
				
				var calcRatingsButtonClone = doc.getElementById('calcRatings').cloneNode(true);
				calcRatingsButtonClone.id = 'calcRatingsClone';
				calcRatingsButtonClone.setAttribute('style','float: right; position: absolute; bottom: 0px; right: 100px;');
				fieldOverlay.appendChild(calcRatingsButtonClone);
				
				var copyButton = doc.createElement('input');
				copyButton.type='button';
				copyButton.value = Foxtrickl10n.getString('Copy');
				copyButton.id = 'copyRatingsButton';
				copyButton.setAttribute('style','float: left; position: absolute; bottom: 0px; left: 10px;');
				fieldOverlay.appendChild(copyButton);
				copyButton.addEventListener('click',copyRatings,false);
				
			}
		};

		// opera doesn't have domtreemodified and webkit not domattrchanged. so we use for all
		var listenToMutationEvent = function(target, type, listener, useCapture) {
			if ( type!='DOMNodeInserted' && type!='DOMNodeRemoved' && type!= 'DOMCharacterDataModified' ) {
				Foxtrick.log('event type not supported by all browser');
				return;
			}

			var changeScheduled = false;
			var waitForChanges = function (ev) {
				// if we already have been called return and do nothing
				if (changeScheduled) 
					return;
				changeScheduled = true;
				// use setTimeout append our actual handler to the list of handlers 
				// which are currently scheduled to be executed
				window.setTimeout ( function() {
					// all changes have past and all changehandlers called. no we can call our actual handler
					changeScheduled = false;
					target.removeEventListener(type, waitForChanges, useCapture);
					listener(ev);
					target.addEventListener(type, waitForChanges, useCapture);
				}, 0)
			};
			// attach an alternative handler which could get executed several times for multiple changes at once. 
			// since our handler should execute only once, we use a different handler to call ours when all changes have past
			target.addEventListener(type, waitForChanges, useCapture);
		};

		listenToMutationEvent(fieldOverlay, "DOMNodeInserted", showLevelNumbers, false);

		// add extra info
		var hasPlayerInfo = false;
		var playerList;
		var hasInterface = false;
		var teamid = Foxtrick.util.id.findTeamId(doc.getElementById('mainWrapper'));
		
		Foxtrick.Pages.Players.getPlayerList(doc, function(playerInfo) {
			if (!playerInfo) {
				Foxtrick.log("ExtraPlayerInfo: unable to retrieve player list.");
			}
			hasPlayerInfo = true;
			playerList = playerInfo;
			if (hasInterface)
				showPlayerInfo();
		}, {teamid:teamid, current_squad:true, includeMatchInfo:true} );
		
		var waitForInterface = function(ev) {
			hasInterface = true;
			if (hasPlayerInfo)
				showPlayerInfo();
		};

		var showPlayerInfo = function() {
			var players = doc.getElementById('players').getElementsByClassName('player');
			// first determine lastMatchday
			var latestMatch = 0, secondLatestMatch = 0;
			for (var i=0; i<players.length; ++i) {
				if (!players[i].id) 
					continue;
				var id = Number(players[i].id.match(/list_playerID(\d+)/i)[1]);
				var player = Foxtrick.Pages.Players.getPlayerFromListById(playerList, id);
				var matchDay = Foxtrick.util.time.getDateFromText(player.lastMatchDate,'yyyy-mm-dd').getTime();
				if (matchDay > latestMatch) {
					secondLatestMatch = latestMatch;
					latestMatch = matchDay;
				}
				else if (matchDay > secondLatestMatch && matchDay < latestMatch) {
					secondLatestMatch = matchDay;
				}
			}
			for (var i=0; i<players.length; ++i) {
				if (!players[i].id) 
					continue;
				var id = Number(players[i].id.match(/list_playerID(\d+)/i)[1]);
				var player = Foxtrick.Pages.Players.getPlayerFromListById(playerList, id);
				var matchDay = Foxtrick.util.time.getDateFromText(player.lastMatchDate,'yyyy-mm-dd').getTime();
				if (matchDay == latestMatch)
					Foxtrick.addClass( players[i],'playedLast'); 
				else if (matchDay == secondLatestMatch)
					Foxtrick.addClass( players[i],'playedSecondLast'); 
			}
		};

		listenToMutationEvent(list, "DOMNodeInserted", waitForInterface, false);
		
	},
});
