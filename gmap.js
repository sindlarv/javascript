// vytvoreni znacky pro Gmap
function createMarker(point, content, markerindex) {
	// objekt a parametry pro vlastni ikony
	var baseIcon = new GIcon(G_DEFAULT_ICON);
	// puvodni parametry terciku Google
	//baseIcon.shadow = "http://www.google.com/mapfiles/shadow50.png";
	//baseIcon.iconSize = new GSize(20, 34);
	//baseIcon.shadowSize = new GSize(37, 34);
	//baseIcon.iconAnchor = new GPoint(9, 34);
	//baseIcon.infoWindowAnchor = new GPoint(9, 2);
	baseIcon.shadow = "/images/navstevnik/ico-fig-shadow.png";
	baseIcon.iconSize = new GSize(25, 25);
	baseIcon.shadowSize = new GSize(35, 30);
	baseIcon.iconAnchor = new GPoint(0, 0);
	baseIcon.infoWindowAnchor = new GPoint(9, 2);
		
	//var label = String.fromCharCode("1".charCodeAt(0) + markerindex); tohle fungovalo jen pro 1-9, počítá se jeden znak
	var markerindex1 = markerindex + 1;
	var label = markerindex1 + ""; // tohle je správný a jednoduchý převod na string
	var labeledIcon = new GIcon(baseIcon);
	// Google nema terciky oznacene cisly, pouze pismeny
	//labeledIcon.image = "http://www.google.com/mapfiles/marker" + label + ".png";
	labeledIcon.image = "/images/navstevnik/ico-fig-" + label + ".gif";

	//markerOptions = {draggable: false };
	markerOptions = {draggable: false, icon: labeledIcon };
	var myMarker = new GMarker(point, markerOptions);
	// obslouzeni kliknuti na znacku
	GEvent.addListener(myMarker, "mouseover", function() {
		//map.closeInfoWindow();
		myMarker.openInfoWindowHtml(content);
		});
	return myMarker;
}

// kod pro zobrazeni samotne mapy v ramci stranek
function loadGmap() {
	var myPOI = processElementsByClass("div", "g-poi", 0).length;
	// zobrazeni jinak skrytych prvku tykajicich se mapy
	document.getElementById("map").style.display="";
	var myFigure = document.getElementsByTagName("span");
	for (var i = 0; i < myFigure.length; i++) {
		if (myFigure[i].className == "figure") {
			myFigure[i].style.display="";
		}
	}
	// ocislovani prvku v seznamu POI
	processElementsByClass("span", "figure", 1);

	//if (GBrowserIsCompatible() && (myPOI > 0)) {
	if (GBrowserIsCompatible()) {
		
		// v poli se objevi tema a vybrana oblast
		var myTer = (document.body.className).split(' ');

		// souradnice ze seznamu v kodu
		var myLat = processElementsByClass("span", "g-lat", 0);
		var myLng = processElementsByClass("span", "g-lng", 0);
		var myImage = processElementsByClass("span", "g-image", 0);
		var myUrl = processElementsByClass("span", "g-url", 0);
		var myTitle = processElementsByClass("span", "g-title", 0);
		var myDesc = processElementsByClass("span", "g-desc", 0);
		
		// preddefinovane souradnice jednotlivych oblasti
		var tJeseniky = new Array(49.998912,17.461395,10);
		var tOpavsko = new Array(49.906134,17.938614,11);
		var tPoodri = new Array(49.628504,18.038864,11);
		var tOstravsko = new Array(49.84551,18.276443,11);
		var tTesinsko = new Array(49.801212,18.503723,11);
		var tBeskydy = new Array(49.612935,18.424072,11);
		var tDefault = new Array(49.866317,17.696228,9);
		
		// inicializace hlavniho mapoveho objektu
		var map = new GMap2(document.getElementById("map"));
		
		map.addControl(new GLargeMapControl());
		map.addControl(new GMapTypeControl());

		// definice vyrezu a priblizeni mapy dle oblasti (a odstraneni LF z konce retezce, doplnuje transformace)
		switch(myTer[0].replace(/\n/, "")) {
			case "a-01":
				var center = new GLatLng(tJeseniky[0], tJeseniky[1]);
				map.setCenter(center, tJeseniky[2]);
				break;
			case "a-02":
				var center = new GLatLng(tOpavsko[0], tOpavsko[1]);
				map.setCenter(center, tOpavsko[2]);
				break;
			case "a-03":
				var center = new GLatLng(tPoodri[0], tPoodri[1]);
				map.setCenter(center, tPoodri[2]);
				break;
			case "a-04":
				var center = new GLatLng(tOstravsko[0], tOstravsko[1]);
				map.setCenter(center, tOstravsko[2]);
				break;
			case "a-05":
				var center = new GLatLng(tTesinsko[0], tTesinsko[1]);
				map.setCenter(center, tTesinsko[2]);
				break;
			case "a-06":
				var center = new GLatLng(tBeskydy[0], tBeskydy[1]);
				map.setCenter(center, tBeskydy[2]);
				break;
			default:
				var center = new GLatLng(tDefault[0], tDefault[1]);
				map.setCenter(center, tDefault[2]);
		}

		//var center = new GLatLng(convertGPS(myLat[0]),convertGPS(myLng[0]));
		//map.setCenter(center, 11);
		
		// pole pro prizpusobeni vyrezu mapy dle zadanych bodu
		//var bounds = new GLatLngBounds();

		for (var i = 0; i < myPOI; i++) {
			
			var myPoint = new GLatLng(convertGPS(myLat[i]),convertGPS(myLng[i]));
			var myContent = '<p class="img">' + myImage[i] + '</p><p><strong><a href="' + myUrl[i] + '">' + myTitle[i] + '</a></strong></p><p>' + myDesc[i] + '</p>';

			var marker = createMarker(myPoint, myContent, i);
			map.addOverlay(marker);
			// po kazde znacce pridame i zaznam o souradnicich
			//bounds.extend(myPoint);
		}
		
		// definuje miru priblizeni a stred na zaklade pole souradnic
		//map.setZoom(map.getBoundsZoomLevel(bounds));
		//map.setCenter(bounds.getCenter());

	} else {
			document.getElementById("map").style.display="none";
	}
}
