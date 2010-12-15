// wmplayer.js 1.5 --sindlarv

$(document).ready(function() {
  var elem = $('#menuList');
  var listHeight = $('#menuList').height();
  var itemHeight = $('#menuList li:first').outerHeight();
  var itemNumber = $('#menuList li').length;
  var scrollHeight = $.scrollTo.max(elem[0], 'y');

  $(window).scroll(function() {
    $('#ad').css('margin-top', $(window).scrollTop());
  });

  // skryti ovladacich prvku a zobrazeni uvodniho obrazku
  //$('#playerControl').hide();
  $('#playerDefImg').removeClass('wf-noShow');

  // inicializace menu
  if ((itemNumber*itemHeight) > listHeight) {
    var menuScrollDn = $('#menuScrollDown > a');
    var menuScrollUp = $('#menuScrollUp > a');
    //nastaveni parametru sipek a polozek
    menuScrollDn.css('cursor', 'pointer');
    menuScrollUp.css('cursor', 'pointer');
    menuScrollDn.removeClass('disabled');
    $('.item a').each(function() {
      $(this).css('cursor', 'pointer');
    });
    
    //inicializujeme rolovani (nektere prohlizece toto vyzaduji)
    $('#menuList').scrollTo(0);

    menuScrollDn.click(function() {
      var currentPosition = elem.scrollTop();

      $('#menuList').stop().scrollTo('+=106', 800, { axis:'y' });
      //alert('currentPosition: ' + currentPosition + '\nscrollHeight: ' + scrollHeight + '\nitemHeight: ' + itemHeight);
      if (currentPosition >= 0) {
        menuScrollUp.removeClass('disabled');
      }
      if (currentPosition >= (scrollHeight - itemHeight)) {
        menuScrollDn.addClass('disabled');
      }
    });
    menuScrollUp.click(function() {
      var currentPosition = elem.scrollTop();

      $('#menuList').stop().scrollTo('-=106', 800, { axis:'y' });
      if (currentPosition <= itemHeight) {
        menuScrollUp.addClass('disabled');
      } else
      {
        //console.log(itemHeight);
      }
      if (currentPosition <= scrollHeight) {
        menuScrollDn.removeClass('disabled');
      }
    });
  }

  // kliknuti na polozku v menu
  $('.item a').click(function() {
    var itemUrl = $(this).attr('rel');
    var itemParent = $(this).parent();
    var itemDate = itemParent.find('span.datum').text();
    var itemTitle = itemParent.find('span.nadpis').text();
    var itemDesc = itemParent.find('span.popis').text();

    if (itemUrl) {
      // zobrazit a nastavit ovladaci prvky
      $('#playerControl').show();
      setupPlayerControl();

      // skryt vychozi obrazek
      if ($('#playerDefImg').is(':hidden') == false) {
        $('#playerDefImg').addClass('wf-noShow');
      }

      // zobrazit odpovidajici objekt
      if ($.browser.msie) {
        $('#playerObjectIE').removeClass('wf-noShow');
      } else {
        $('#playerObject').removeClass('wf-noShow');
      }

      playerInit();

      wmplayer.URL = itemUrl;
      wmplayer.uiMode = 'none'; // none = bez ovladacich prvku, mini = standardni interface, full = mini + ukazatel prubehu

      playerPlay();

      // zobrazit datum, nazev, popis vybraneho videa
      $('#descriptionIn h2').empty().append(itemDate + '&nbsp;' + itemTitle);
      $('#descriptionIn p').empty().append(itemDesc);
    }
  });

  // udalosti prehravace
  $('#tvStop').click(function() {
    playerStop();
  });

  $('#tvPause').click(function() {
    if (wmplayer.playState == 2) { // 2 = paused
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

  pVolMap = $('#tvVolumeMapID > area');
  pVolImg = $('#tvSetVolume').attr('src');
  pVolMap.click(function() {
    playerSetVolume($(this).index());
    pVolImg = $(this).attr('src');
  });

  pVolMap.mouseover(function() {
    //playerSetVolume('#tvVolumeMapID > area'.index());  tvSetVolume
    //console.log("stary: " + $('#tvSetVolume').attr('src') + ", novy: img/ico_tv-volume" + $(this).index() + ".png");
    //console.log("novy: img/ico_tv-volume" + $(this).index() + ".png");
    //console.log('pVolMap in, index: ' + $(this).index());
    $('#tvSetVolume').attr('src', 'img/ico_tv-volume' + $(this).index() + '.png');
  }).mouseout(function() {
    //console.log('pVolMap out');
    $('#tvSetVolume').attr('src', pVolImg);
  });

});


// sada funkci pro prehravac
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
    // re-inicializace delky videa (nutne, i kdyz je parametr pouze ke cteni?!; nulovani celeho objektu nefunguje)
    wmpMedia.duration = 0;
  } else {
    wmplayer = document.getElementById("playerObject");
    wmpControls = wmplayer.controls;
    wmpSettings = wmplayer.settings;
    wmpMedia = wmplayer.currentMedia;
    //wmpMedia = wmplayer;
    // re-inicializace objektu
    wmpMedia = null;
  }

  // Při načtení stránky aktualizuj progress a nastav aktivní tlačítko Stop
  //playerUpdateProgress();
  //document.getElementById("tvStop").src = "img/ico_tv-stop2.png";

  //console.log('init done');

}

// Spuštění videa po stisknutí tlačítka Play a nastavení správné polohy tlačítek play/stop/pause
function playerPlay() {
  // pri prvotnim nacteni objektu IE vyzaduje wmpMedia = wmplayer a vraci nenulovy objekt
  // FF&co naopak vyzaduji wmpMedia = wmplayer.currentMedia a tento je null
  if (wmpMedia == null || wmpMedia.duration == 0) {
    getDuration();
  }
  wmpControls.play();
  //document.getElementById("tvStop").src = "img/ico_tv-stop.png";
  //document.getElementById("tvPause").src = "img/ico_tv-pause.png";
  //document.getElementById("tvPlay").src = "img/ico_tv-play2.png";
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

// Přepnutí videa do celé obrazkovy po stisknutí tlačítka rozažení
function playerFullScreen() {
  wmplayer.fullScreen = true;
  return true;
}

// Změna hlasitosti po klepnutí na prvek hlasitosti a nastavení odpovídající nové grafiky prvku
// Parametr vol je od 0 do 10 a je dán klikací mapou v HTML
function playerSetVolume(vol) {
  var volumes = new Array(0,10,20,30,40,50,60,70,80,90,100);

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
  //console.log('playState: ' + wmplayer.playState);
  if (wmplayer.playState != 1) { // 0	Undefined, 1 stopped, 2 paused, 3 playing, 4 ScanForward, 5 ScanReverse, 6 Buffering, 7 Waiting, 8 MediaEnded, 9 preparing, 10 ready, 11 Reconnecting
    var t = setTimeout("playerUpdateProgress()", 500);
  }

  return true;
}


// sada servisnich funkci
function setupPlayerControl() {
  var pCtrl = $('#playerControl');
  pCtrl.each(function() {
    $(this).find('img').css('cursor', 'pointer');
  });
  pCtrl.show();
}

function getDuration() {
  // klic k rizeni objektu WMP spociva v tomto:
  // "All of the methods in the Windows Media Player object model are asynchronous."
  // hodnota duration pochazi z metadat streamovaneho objektu, ktery nemusi (a nebyva!)
  // okamzite k dispozici.
  wmpMedia = wmplayer.currentMedia;
  if (wmpMedia.duration == 0) {
    setTimeout("getDuration()", 150);
  }
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
