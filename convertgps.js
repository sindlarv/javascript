// konverze ze standardniho formatu GPS (stupne, minuty, vteriny) do formatu pro Gmap
function convertGPS(point) {
	dSignPos = point.indexOf("°");
	mSignPos = point.indexOf("'");
	sSignPos = point.indexOf('"');

	if (dSignPos > -1 && mSignPos > -1 && sSignPos > -1) {
		myDecFraction0 = parseFloat(point.substring(0,dSignPos));
		myDecFraction1 = parseFloat(point.substring(dSignPos+1,mSignPos)/60);
		myDecFraction2 = parseFloat(point.substring(mSignPos+1,sSignPos)/3600);
		myCoord = myDecFraction0 + myDecFraction1 + myDecFraction2;
	}
	else {
		//alert(point + ": Nestandardni format souradnic GPS!");
		myCoord = -1;
	}
	//zaokrouhleni na 6 desetinnych mist (vice Gmaps nepotrebuji)
	return Math.round(myCoord*Math.pow(10,6))/Math.pow(10,6);
}
