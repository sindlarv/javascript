//resi validitu atributu target v xhtml/strict a zachova HTTP referrer
function mTarget() {
  //odfiltruje prohlizece, ktere getElementsByTagName neznaji
  if (!document.getElementsByTagName) return;
  var mAnchors = document.getElementsByTagName("a");
  for (var i=0; i<mAnchors.length; i++) {
    var mAnchor = mAnchors[i];
    //pouze pro odkazy s adresou a pozadovanym atributem rel
    if ((mAnchor.getAttribute("href") && mAnchor.getAttribute("rel")) == "external")
      mAnchor.target = "_blank";
  }
}
