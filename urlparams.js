function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

// funkce vraci seznam parametru formulare vcetne jejich hodnot ve forme dvourozmerneho pole
function getUrlVars()
{
	var vars = [], hash;
	//var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	//zajisti korektni nacteni parametru i s diakritikou; pozdejsi unescape() nelze pouzit pro dvoubajtove zakodovane znaky
	var decodeduri = decodeURI(window.location.href);
	var hashes = decodeduri.slice(window.location.href.indexOf('?') + 1).split('&');

	for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
}
