// wmplayer.js 1.3 --sindlarv

$(document).ready(function() {
  var elem = $('#menuList');
  var listHeight = $('#menuList').height();
  var itemHeight = $('#menuList li:first').outerHeight();
  var itemNumber = $('#menuList li').length;
  var scrollHeight = $.scrollTo.max(elem[0], 'y');

  //console.log($.scrollTo.max('#menuScrollUp > a', 'y'));
  //console.log($('#ad').css('margin-top'));
  $(window).scroll(function() {
    //console.log($(window).scrollTop());
    $('#ad').css('margin-top', $(window).scrollTop());
  });

  // skryti ovladacich prvku na uvod
  $('#playerControl').hide();

  // inicializace menu
  if ((itemNumber*itemHeight) > listHeight) {
    //rozsvitime dolni sipku
    $('#menuScrollDown > a').removeClass('disabled');
    //inicializujeme rolovani (nektere prohlizece toto vyzaduji)
    $('#menuList').scrollTo(0);

    $('#menuScrollDown > a').click(function() {
      var currentPosition = elem.scrollTop();
      $('#menuList').stop().scrollTo('+=106', 800, { axis:'y' });
      //alert('currentPosition: ' + currentPosition + '\nscrollHeight: ' + scrollHeight + '\nitemHeight: ' + itemHeight);
      if (currentPosition >= 0) {
        $('#menuScrollUp > a').removeClass('disabled');
      }
      if (currentPosition >= (scrollHeight - itemHeight)) {
        $('#menuScrollDown > a').addClass('disabled');
      }
    });
    $('#menuScrollUp > a').click(function() {
      $('#menuList').stop().scrollTo('-=106', 800, { axis:'y' });
      var currentPosition = elem.scrollTop();
      //console.log(currentPosition + ': ' + scrollHeight);
      if (currentPosition <= itemHeight) {
        $('#menuScrollUp > a').addClass('disabled');
      } else
      {
        //console.log(xyz);
      }
      if (currentPosition <= scrollHeight) {
        $('#menuScrollDown > a').removeClass('disabled');
      }
    });
  }

  // kliknuti v menu
  $('.item a').click(function() {
    var itemUrl = $(this).attr('rel');
    var itemParent = $(this).parent();
    var itemDate = itemParent.find('span.datum').text();
    var itemTitle = itemParent.find('span.nadpis').text();
    var itemDesc = itemParent.find('span.popis').text();

    // nastavit ovladaci prvky
    //$('#playerControl').show();
    setupPlayerControl();

    // skryt vychozi obrazek
    if ($('#playerDefImg').is(':hidden') == false) {
      $('#playerDefImg').addClass('wf-noShow');
    }

    // zobrazit odpovidajici objekt
    //dosadit URL, FileName pomoci prostredku jQuery...
    // If the FileName property is not set, the Duration property returns zero
    if ($.browser.msie) {
      $('#playerObjectIE param[name="URL"]').val(itemUrl);
      //$('#playerObjectIE param[name="FileName"]').val(itemUrl);
      $('#playerObjectIE').removeClass('wf-noShow');
    } else {
      $('#playerObject param[name="URL"]').val(itemUrl);
      $('#playerObject').removeClass('wf-noShow');
    }

    playerInit();

    wmplayer.URL = itemUrl;
    wmplayer.uiMode = 'none'; // none = bez ovladacich prvku, mini = standardni interface, full = mini + ukazatel prubehu

    playerPlay();
    
    // zobrazit datum, nazev, popis vybraneho videa
    $('#descriptionIn h2').empty().append(itemDate + '&nbsp;' + itemTitle);
    $('#descriptionIn p').empty().append(itemDesc);
  });

  // udalosti prehravace
  $('#tvStop').click(function() {
    playerStop();
  });

  $('#tvPause').click(function() {
//    console.log(wmplayer.playState);
    if (wmplayer.playState == 2) { // 1 = stopped, 2 = paused, 3 = playing, 10 = ready
      playerPlay();
    } else {
      playerPause();
    }
  });

  $('#tvPlay').click(function() {
    playerPlay();
  });

  $('#tvMute').click(function() {
    playerMute();
  });

  $('#tvSize > img').click(function() {
    if (wmplayer.playState == 3) {
      playerFullScreen();
    }
  });

  $('#tvVolumeMapID > area').click(function() {
    playerSetVolume($(this).index());
  });

});

// sekce prehravani
var wmplayer;
var wmpControls, wmpSettings, wmpMedia;

function playerInit() {

  if ($.browser.msie) {
    wmplayer = document.getElementById("playerObjectIE");
    //wmpControls = wmplayer;
    wmpControls = wmplayer.controls;
    //wmpSettings = wmplayer;
    wmpSettings = wmplayer.settings;
    wmpMedia = wmplayer;
    //wmpMedia = wmplayer.currentMedia;
    wmpMedia.duration = 0;
  } else {
    wmplayer = document.getElementById("playerObject");
    wmpControls = wmplayer.controls;
    wmpSettings = wmplayer.settings;
    wmpMedia = wmplayer.currentMedia;
    //wmpMedia = wmplayer;
  }

  // Při načtení stránky aktualizuj progress a nastav aktivní tlačítko Stop
  //playerUpdateProgress();
  //document.getElementById("tvStop").src = "img/ico_tv-stop2.png";

  //console.log('init done');

}

// Spuštění videa po stisknutí tlačítka Play a nastavení správné polohy tlačítek play/stop/pause
function playerPlay() {
  if (wmpMedia.duration == 0) {
  //if (wmpMedia.duration == null) {
    getDuration();
  }
  wmpControls.play();
  //document.getElementById("tvStop").src = "img/ico_tv-stop.png";
  //document.getElementById("tvPause").src = "img/ico_tv-pause.png";
  //document.getElementById("tvPlay").src = "img/ico_tv-play2.png";
  // wait an interval to allow video to start then proceed in next function
   // Need a pause or currentMedia.duration won't be available.
  //alert(wmpMedia.name);
  playerUpdateProgress();
  return true;
}

// Přerušení videa po stisknutí tlačítka Stop a nastavení správné polohy tlačítek play/stop/pause
function playerStop() {
  wmpControls.stop();
  //document.getElementById("tvStop").src = "img/ico_tv-stop2.png";
  //document.getElementById("tvPause").src = "img/ico_tv-pause.png";
  //document.getElementById("tvPlay").src = "img/ico_tv-play.png";
  return true;
}

// Zastavení videa po stisknutí tlačítka Pause a nastavení správné polohy tlačítek play/stop/pause
function playerPause() {
  wmpControls.pause();
  //document.getElementById("tvStop").src = "img/ico_tv-stop.png";
  //document.getElementById("tvPause").src = "img/ico_tv-pause2.png";
  //document.getElementById("tvPlay").src = "img/ico_tv-play.png";
  return true;
}

// Přepnutí videa do celé obrazkovy po stisknutí tlačítka rozažení (liší se podle prohlížeče)
function playerFullScreen() {
  if ($.browser.msie) {
    wmplayer.fullScreen = true;
    //wmplayer.displaysize = 3;
  } else {
    wmplayer.fullScreen = true;
  }
  return true;
}

// Změna hlasitosti po klepnutí na prvek hlasitosti a nastavení odpovídající nové grafiky prvku
// Parametr vol je od 0 do 10 a je dán klikací mapou v HTML
// Nastavení pro IE je od -10000 do 0 (ticho až zcela nahlas) a je značně nelineární (zatím jsem tam něco dal, možná nutné doladit)
// Nastavení pro FF je procentuální od 0 do 100
function playerSetVolume(vol) {
  if ($.browser.msie) {
    //var volumes = new Array(-10000,-3000,-2000,-1000,-800,-500,-200,-100,-50,-20,0);
    var volumes = new Array(0,10,20,30,40,50,60,70,80,90,100);
  } else {
    var volumes = new Array(0,10,20,30,40,50,60,70,80,90,100);
  }
  wmpSettings.volume = volumes[vol];
  //document.getElementById("tvSetVolume").src = "img/ico_tv-volume" + parseInt(vol) + ".png";
  return true;
}

// Přepnutí ticho/zvuk pro klepnutí na tlačítko Mute a nastavení opačné grafiky prvku
function playerMute() {
  var tvMute = document.getElementById("tvMute");
  if (wmpSettings.mute) {
    //tvMute.src = "img/ico_tv-mute.png";
    wmpSettings.mute = false;
  } else {
    //tvMute.src = "img/ico_tv-mute2.png";
    wmpSettings.mute = true;
  }
  return true;
}
     
// Konverze vteřin do minutového formátu
function convertSecToMin(seconds) {
  var mins = Math.floor(seconds / 60);
  var secs = (seconds % 60).toFixed();
  if  (secs.length < 2) {
    secs = '0' + secs;
  }
  return (mins + ":" + secs);
}

// Pravidelná aktualizace progresu videa
function playerUpdateProgress() {
  // Zjištění aktuální palohy a zbývající času a aktualizace odpovídajících prvků s konverzí do minutového formátu
  //console.log('curPos: ' + wmpControls.currentPosition + ', dur: ' + wmpMedia.durationString);
  //alert(wmpMedia.duration);
  //console.log(wmpMedia.sourceURL);
  var wmpTimeElapsed = wmpControls.currentPosition;
  $('#tvProgressTime').empty().text(convertSecToMin(wmpTimeElapsed));

  if (wmpMedia.duration > 0) {
    var wmpTimeLeft = wmpMedia.duration - wmpControls.currentPosition;
    $('#tvProgressLeft').empty().text('-' + convertSecToMin(wmpTimeLeft));
    // Aktualizace grafiky progresu - trojčlenkou s pevnou šířkou 400
    $('#tvProgressBar > img').width((wmpTimeElapsed / wmpMedia.duration) * 400);
  } else {
    $('#tvProgressLeft').empty().text('--:--');
    $('#tvProgressBar > img').width(400);
  }

  // Nastavení další aktualizace - pevně za půl vteřiny
  console.log('playState: ' + wmplayer.playState);
  //alert('playState: ' + wmplayer.playState);
  if (wmplayer.playState != 1) { // 1 = stopped, 2 = paused, 3 = playing, 9 = preparing, 10 = ready
    var t = setTimeout("playerUpdateProgress()", 500);
  }
  
  return true;
}

function setupPlayerControl() {
  var pCtrl = $('#playerControl');
  pCtrl.each(function() {
    //console.log($(this).find('img'));
    $(this).find('img').css('cursor', 'pointer');
  });
  pCtrl.show();
}

function itemFade() {
  var fadeDuration = 150;

  $('.thumbnail > img').css('opacity', '0.65');
  
  $('.thumbnail > img').hover(function() {
    $(this).animate({ opacity: '1' }, fadeDuration);
  }, function() {
    $(this).animate({ opacity: '0.65' }, fadeDuration);
  });
}

function getDuration() {
  // klic k rizeni objektu WMP spociva v tomto:
  // "All of the methods in the Windows Media Player object model are asynchronous."
  // hodnotu duration se nacte z metadat streamovaneho objektu, ktery nemusi (a nebyva)
  // okamzite k dispozici.
  wmpMedia = wmplayer.currentMedia;
  if ( wmpMedia.duration == 0) {
    setTimeout("getDuration()", 150);
  }
  //console.log(wmpMedia.duration);
}
