// wmplayer.js 1.7.1 --sindlarv

$(document).ready(function() {
  var elem = $('#menuList');
  var listHeight = $('#menuList').height();
  var itemHeight = $('#menuList li:first').outerHeight();
  var itemNumber = $('#menuList li').length;
  var scrollHeight = $.scrollTo.max(elem[0], 'y');
  var playerDefImg = $('#playerScreen > img');
  var live = $('#live').length;

  $(window).scroll(function() {
    $('#ad').css('margin-top', $(window).scrollTop());
  });

  // skryti ovladacich prvku a zobrazeni uvodniho obrazku
  //$('#playerControl').hide();
  playerDefImg.removeClass('wf-noShow');

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

  // nacteni polozek online prenosu
  if (live > 0) {
    var liveItemTitle = $('#live-title').text();
    var liveItemDesc = $('#live-desc').text();
    var liveItemUrl = $('#live-url').text();

    liveItemUrl = liveItemUrl.split(';');

    if (liveItemUrl) {
      playerSetup();
      playerObjInit();

      wmplayer.URL = liveItemUrl[Math.floor(Math.random()*liveItemUrl.length)];

      setDescription(liveItemTitle,liveItemDesc);
      playerPlay();
    }

  }

  // kliknuti na polozku v menu
  $('.item a').click(function() {
    var itemUrl = $(this).attr('rel');
    var itemParent = $(this).parent().parent();
    var itemDate = itemParent.find('span.datum').text();
    var itemTitle = itemParent.find('span.nadpis').text();
    var itemDesc = itemParent.find('span.popis').text();

    if (itemUrl) {
      // zobrazit a nastavit ovladaci prvky
      playerSetup();
      playerObjInit();

      wmplayer.URL = itemUrl;

      // zobrazit datum, nazev, popis vybraneho videa
      setDescription(itemDate + '&nbsp;' + itemTitle,itemDesc);
      playerPlay();
    }
  });

  // udalosti prehravace
  $('#tvControlStop').click(function() {
    playerStop();
  });

  $('#tvControlPause').click(function() {
    switch (wmplayer.playState) {
      case 1:
        break;
      case 2:
        playerPlay();
        break;
      default:
        if (live == 0) {
          playerPause();
        }
    }
  });

  $('#tvControlPlay').click(function() {
    playerPlay();
  });

  $('#tvVolumeMute').click(function() {
    playerMute();
  });

  $('#tvSizeMax').click(function() {
    if (wmplayer.playState == 3) {
      playerFullScreen();
    }
  });

  pVolMap = $('#tvVolumeMapID > area');
  pVolMap.click(function() {
    playerSetVolume($(this).index());
  });
});


// sada funkci pro prehravac
var wmplayer;
var wmpControls, wmpSettings, wmpMedia;

function playerObjInit() {

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

  wmplayer.uiMode = 'none'; // none = bez ovladacich prvku, mini = standardni interface, full = mini + ukazatel prubehu
  
  //playerSetVolume(5); // pri kazdem spusteni upravit hlasitost na stanovenou uroven; neni v tomto pripade zadouci?
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
  $('#tvControlStop').removeClass('on');
  $('#tvControlPause').removeClass('on');
  $('#tvControlPlay').addClass('on');
  playerUpdateProgress();
  return true;
}

// Přerušení videa po stisknutí tlačítka Stop a nastavení správné polohy tlačítek play/stop/pause
function playerStop() {
  wmpControls.stop();
  $('#tvControlPause').removeClass('on');
  $('#tvControlPlay').removeClass('on');
  $('#tvControlStop').addClass('on');
  return true;
}

// Zastavení videa po stisknutí tlačítka Pause a nastavení správné polohy tlačítek play/stop/pause
function playerPause() {
  wmpControls.pause();
  $('#tvControlPlay').removeClass('on');
  $('#tvControlStop').removeClass('on');
  $('#tvControlPause').addClass('on');
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
  $('#tvVolumeVol > img').attr('src', 'img/ico_tv-volume' + parseInt(vol) + '.png');
  $('#tvVolumeMute').removeClass('on');
  return true;
}

// Přepnutí ticho/zvuk pro klepnutí na tlačítko Mute a nastavení opačné grafiky prvku
function playerMute() {
  var tvVolumeMute = document.getElementById("tvVolumeMute");
  if (wmpSettings.mute) {
    $('#tvVolumeMute').removeClass('on');
    wmpSettings.mute = false;
  } else {
    $('#tvVolumeMute').addClass('on');
    wmpSettings.mute = true;
  }
  return true;
}

// Konverze vteřin do minutového formátu
function convertSecToMin(seconds) {
  var mins = Math.floor(seconds / 60);
  var secs = (seconds % 60).toFixed();
  if (secs.length < 2) {
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
  if (wmplayer.playState != 1) { // 0 Undefined, 1 stopped, 2 paused, 3 playing, 4 ScanForward, 5 ScanReverse, 6 Buffering, 7 Waiting, 8 MediaEnded, 9 preparing, 10 ready, 11 Reconnecting
    var t = setTimeout("playerUpdateProgress()", 500);
  }

  return true;
}


// sada servisnich funkci
function playerSetup() {
  var pDefImg = $('#playerScreen > img');

  $('#tvVolumeVol').css('cursor', 'pointer');
  $('#playerControl').show();

  // skryt vychozi obrazek
  if (pDefImg.is(':hidden') == false) {
    pDefImg.addClass('wf-noShow');
  }

  // zobrazit odpovidajici objekt
  if ($.browser.msie) {
    $('#playerObjectIE').removeClass('wf-noShow');
  } else {
    $('#playerObject').removeClass('wf-noShow');
  }

}

function getDuration() {
  // klic k rizeni objektu WMP spociva v tomto:
  // "All of the methods in the Windows Media Player object model are asynchronous."
  // hodnota duration pochazi z metadat streamovaneho objektu, ktery nemusi (a nebyva!)
  // okamzite k dispozici.
  wmpMedia = wmplayer.currentMedia;

/* test, mela by se pouzit funkce pro udalosti
  //console.log('1: ' + wmplayer.Buffering); StatusChange(), status
    switch (wmplayer.playState) {
      case 1:
        console.log('gD: stopped');
        break;
      case 2:
        console.log('gD: paused');
        break;
      case 3:
        console.log('gD: playing');
        //$('#tvSizeMax').text('playing');
        break;
      case 9:
        console.log('gD: preparing');
        //$('#tvSizeMax').text('preparing');
        break;
      default:
    }
*/

  if (wmpMedia == null || wmpMedia.duration == 0) {
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

function setDescription(x,y) {
  var descTitle = $('#descriptionIn h2');
  var descText = $('#descriptionIn p');
  
  descTitle.empty().append(x);
  descText.empty().append(y);
}
