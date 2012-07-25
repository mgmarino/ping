db = $.couch.db("ping");
var runDocs = false;
var timeOutID = 0;
var length = 0;
var currentPlotIndex = 0;
var canWrite = false;

function sendping(){
	doc = new Object;
	doc.name = 'ping';
	doc.created_at = new Date();

	db.saveDoc(doc, {success: function() {
		$("#status").fadeIn();
		$("#status").fadeOut('slow');
	}});
}

function cmdObj() {
	doc = new Object;
	doc.name = 'command';
        doc.type = 'command';
	doc.args = [];
	return doc;
}

function getValOfText(text) {
	return document.getElementById(text).value;
}

function killProgram() {
	var doc = cmdObj();	
	doc.cmd = 'kill_thread';
	db.saveDoc(doc);
}

function sendValues() {
	var doc = cmdObj();	
	doc.cmd = 'set_value';
	doc.args = [getValOfText('value')];
	db.saveDoc(doc);
	var doc = cmdObj();	
	doc.cmd = 'set_spread';
	doc.args = [getValOfText('spread')];
	db.saveDoc(doc);
}

function replaceButtonText(buttonId, text)
{
  if (document.getElementById)
  {
    var button=document.getElementById(buttonId);
    if (button)
    {
      if (button.childNodes[0])
      {
        button.childNodes[0].nodeValue=text;
      }
      else if (button.value)
      {
        button.value=text;
      }
      else //if (button.innerHTML)
      {
        button.innerHTML=text;
      }
    }
  }
}

function hideDiv(){
	document.getElementById("pongs").style.visibility = 'hidden';
}
function showDiv(){
	document.getElementById("pongs").style.visibility = 'visible';
}

function toggleCheckDocs() {
	if (runDocs) {
		runDocs = false;
		hideDiv();
		replaceButtonText("ShowButton", "Show Pongs");	
		if (timeOutID != 0) clearInterval( timeOutID );
		return;
	}
	runDocs = true;
	showDiv();
	replaceButtonText("ShowButton", "Hide Pongs");
	timeOutID = setInterval("checkdocs()", 500);
}

function checkdocs(){
	db.view("Ping/pong", {success: function(data) {
		for (i in data.rows) {
			if (i < length) continue; 
			var temp = data.rows[i].value;
			$("#pongs").append("<p>" + temp.name + " " + temp.answer + " " + temp.created_at + "</div>"+"</p>"
			);
			length++;
		}
	}})
	
}

function getNewData(appendList, chart) {
	db.view("Ping/readout", {
		success: function(data) {
			for (var i in data.rows) {
				var temp = data.rows[i].value;
				appendList.addPoint([temp[0], temp[1]], false, (appendList.data.length > 40));
			}
			if (data.rows.length > 0) {
				currentPlotIndex = data.rows[data.rows.length-1].value[0]+1;
				chart.redraw()
			}
		},
		startkey: currentPlotIndex 
		
	})

}
	
function init() {
	db.openDoc("host", {
		success: function(data) {
			canWrite = (location.hostname == data.host);
			if (!canWrite) {
				document.getElementById("Kill").disabled = true;	
				document.getElementById("SetValues").disabled = true;	
				document.getElementById("value").disabled = true;	
				document.getElementById("spread").disabled = true;	
				var str = "Replicated Database";
				var div = document.getElementById('serverstatus');
				var elem = document.createTextNode(str);
				var font = document.createElement("font");
				font.style.color = "red";
				font.appendChild(elem);
				div.appendChild(font);
			} else {
				var str = "Control Database";
				var div = document.getElementById('serverstatus');
				var elem = document.createTextNode(str);
				var font = document.createElement("font");
				font.style.color = "green";
				font.appendChild(elem);
				div.appendChild(font);
			}

		},
		error: function(data) {
			console.log(data);	
		},

	});
}
$(document).ready(function() {
	$('#status').hide();
	init();
});
