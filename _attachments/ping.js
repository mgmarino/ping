db = $.couch.db("ping");

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

function checkdocs(){
	$("#pongs").empty();
	
	db.view("Ping/pong", {success: function(data) {
		for (i in data.rows) {
			$("#pongs").append("<p>" + data.rows[i].value.name + " " + data.rows[i].value.answer + " " + data.rows[i].value.created_at + "</div>"+"</p>"
			);
		}
	}})
	
}
	
$(document).ready(function() {
	
	$('#status').hide();
});
