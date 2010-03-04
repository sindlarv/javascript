// nacteni nebo modifikace obsahu (hodnotou workMode) dat s definovanou tridou
function processElementsByClass(neededTag, neededClass, workMode) {
	var myData = new Array();
	// nacteni vsech elementu, ktere pripadaji v uvahu
	var allNeededTags = document.getElementsByTagName(neededTag);
	var j = workMode;

	for (i = 0; i < allNeededTags.length; i++) {

		// vyber pouze potrebne tridy
		if (allNeededTags[i].className == neededClass) {

			// napr. vypnuti prvku pomoci allNeededTags[i].style.display="none";
			if (workMode == 0) {
				myData[j] = allNeededTags[i].innerHTML;
			}
			else {
				allNeededTags[i].innerHTML = j;
			}
		j++;
		}
	}
	if (workMode == 0) {return myData;}
}
