/**
 *
 * 
 * xml_load.js
 * xml loading
 * @author convinced
 */
  
if (!Foxtrick) var Foxtrick={};


Foxtrick.XMLData = {

    MODULE_NAME : "XMLData",
	DEFAULT_ENABLED : true,
	PAGES : new Array('all'), 

	League : {},
	countryid_to_leagueid : {},
	htLanguagesXml : null,
	htCurrencyXml : null,
	htNTidsXml: null,
	htversionsXML: null,
	htdateformat: null,
	aboutXML:null,
	
	matchxmls: new Array(),
	
	init : function() {
	try{
	/*	this.htLanguagesXml = Foxtrick.loadXmlIntoDOM("chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/htlocales/htlang.xml");
		this.htCurrencyXml = Foxtrick.LoadXML("chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/htlocales/htcurrency.xml");
		this.htNTidsXml = Foxtrick.LoadXML("chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/htlocales/htNTidList.xml");
		this.htversionsXML = Foxtrick.LoadXML("chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/htlocales/htversions.xml");
		this.htdateformat = Foxtrick.LoadXML("chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/htlocales/htdateformat.xml");
		this.aboutXML = Foxtrick.LoadXML("chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/htlocales/foxtrick_about.xml");	
				
		// worlddetails
		var xml = new JKL.ParseXML( "chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/htlocales/worlddetails.xml" );
		var data = xml.parse();
		
		// reindex: by leagueid and countryid
		for (var i=0; i<data.HattrickData.LeagueList.League.length; i++) {
			this.League[data.HattrickData.LeagueList.League[i].LeagueID] = data.HattrickData.LeagueList.League[i];
			this.countryid_to_leagueid[data.HattrickData.LeagueList.League[i].Country.CountryID] = data.HattrickData.LeagueList.League[i].LeagueID;
		}
	
		for (var i in this.League){
			//	dump(this.League[i].LeagueID+' ' +i+'\t');
		}

		for (var i in this.countryid_to_leagueid){
				//dump(this.countryid_to_leagueid[i]+' ' +i+'\n');
		}
		*/
	} catch(e){Foxtrick.dump('Foxtrick.XMLData.init: '+e+'\n');}
	},
	
	run : function(page,doc) {
	
		/*try {
			if (FoxtrickStaffMarker.hty_staff==null){
				FoxtrickStaffMarker.hty_staff = new Array();
				var req = new XMLHttpRequest();
				req.open('GET', 'http://www.hattrick-youthclub.org/_admin/foxtrick/team.xml', false); 
				req.send(null);
				if (req.status == 200) {
					//Foxtrick.dump(req.responseText+'\n');
					var frag = doc.createElement('dummy');
					frag.innerHTML = req.responseText;
					var htyusers = frag.getElementsByTagName('user');
					for (var i=0;i<htyusers.length;++i) {
						FoxtrickStaffMarker.hty_staff.push(htyusers[i].getElementsByTagName('alias')[0].innerHTML);
						//Foxtrick.dump(FoxtrickStaffMarker.hty_staff[i]+' ')
					}
					Foxtrick.dump('hty_staff loaded\n')
				}
				else {Foxtrick.dump('no connection to hty\n'); }				
			}
		}catch(e) {Foxtrick.dump('hty.xml: '+e+'\n'); }

	
	/*try{
		var matchid = FoxtrickHelper.getMatchIdFromUrl(doc.location.href); 
		var isarchivedmatch = (doc.getElementById("ctl00_CPMain_lblMatchInfo")==null);
		var isprematch = (doc.getElementById("ctl00_CPMain_pnlPreMatch")!=null);
		if (isprematch) return;
		
		if (isarchivedmatch && typeof(this.matchxmls[matchid]) == 'undefined') {
			var req = new XMLHttpRequest();
			req.open('GET', 'http://'+doc.location.hostname+'/Community/CHPP/Matches/chppxml.axd?file=matchdetails&matchID='+matchid+'&matchEvents=true', false); 
			req.send(null);
			if (req.status == 200) {
				this.matchxmls[matchid] = req.responseXML;
				dump('matches.js: get new xml\n');
			}
			else Foxtrick.dump('matches.js: xml request failed\n');
		}
	} catch(e){Foxtrick.dump('matches.js run: '+e+'\n');}*/

	},

	change : function(page,doc) {
	},
}

// Open a port to the extension
// properties
var port = chrome.extension.connect({name: "ftproperties-query"});
port.onMessage.addListener(function(msg) {
    Foxtrickl10n.properties = msg.properties;
});
port.postMessage({reqtype: "properties"});

// prefs
var port2 = chrome.extension.connect({name: "ftpref-query"});
port2.onMessage.addListener(function(msg) {   
    FoxtrickPrefs.pref = msg.pref;
});
port2.postMessage({reqtype: "pref"});

// get htlang
var port3 = chrome.extension.connect({name: "ftpref-query"});
port3.onMessage.addListener(function(msg) {   
	Foxtrick.XMLData.htLanguagesXml = msg.htlang;
	});
port3.postMessage({reqtype: "htlang"});

// get htcurrency
var port4 = chrome.extension.connect({name: "ftpref-query"});
port4.onMessage.addListener(function(msg) {   
	Foxtrick.XMLData.htCurrencyXml = msg.htcurrency;});
port4.postMessage({reqtype: "htcurrency"});

// get htNTidList
var port5 = chrome.extension.connect({name: "ftpref-query"});
port5.onMessage.addListener(function(msg) {   
	Foxtrick.XMLData.htNTidsXml = msg.htNTidList;});
port5.postMessage({reqtype: "htNTidList"});

// get htversions
var port6 = chrome.extension.connect({name: "ftpref-query"});
port6.onMessage.addListener(function(msg) {   
	Foxtrick.XMLData.htversionsXML = msg.htversions;});
port6.postMessage({reqtype: "htversions"});

// get htdateformat
var port7 = chrome.extension.connect({name: "ftpref-query"});
port7.onMessage.addListener(function(msg) {   
	Foxtrick.XMLData.htdateformat = msg.htdateformat;});
port7.postMessage({reqtype: "htdateformat"});

// get about
var port8 = chrome.extension.connect({name: "ftpref-query"});
port8.onMessage.addListener(function(msg) {   
	Foxtrick.XMLData.aboutXML = msg.about;});
port8.postMessage({reqtype: "about"});


// get League
var port9 = chrome.extension.connect({name: "ftpref-query"});
port9.onMessage.addListener(function(msg) {   
Foxtrick.XMLData.League = msg.League; });
port9.postMessage({reqtype: "League"});
		
// get countryid_to_leagueid
var port10 = chrome.extension.connect({name: "ftpref-query"});
port10.onMessage.addListener(function(msg) {   
    Foxtrick.XMLData.countryid_to_leagueid = msg.countryid_to_leagueid; });
port10.postMessage({reqtype: "countryid_to_leagueid"});
