db = $.couch.db("ping");
var runDocs = false;
var timeOutID = 0;
var length = 0;

function sendping(){
	doc = new Object;
	doc.name = 'ping';
	doc.created_at = new Date();

	db.saveDoc(doc, {success: function() {
		$("#status").fadeIn();
		$("#status").fadeOut('slow');
	}});
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
	
$(document).ready(function() {
	
	$('#status').hide();
});
