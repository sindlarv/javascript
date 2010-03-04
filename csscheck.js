//test, zda je zapnut css engine
function cssCheck() {
	var cssdisabled = false; // must be proven otherwise
	var testcss = document.createElement('div');
	testcss.style.position = 'absolute';
	document.getElementsByTagName('body')[0].appendChild(testcss);
	if (testcss.currentStyle) var currstyle = testcss.currentStyle['position'];
	else if (window.getComputedStyle) var currstyle = document.defaultView.getComputedStyle(testcss, null).getPropertyValue('position');
	var cssdisabled = (currstyle == 'static') ? true : false;
	document.getElementsByTagName('body')[0].removeChild(testcss);
	//alert(cssdisabled);
	return cssdisabled;
}
