// wmplayer.js 1.0 --sindlarv

$(document).ready(function() {
  var elem = $('#menuList');
  var listHeight = $('#menuList').height();
  var itemHeight = $('#menuList li:first').outerHeight();
  var itemNumber = $('#menuList li').length;
  var scrollHeight = $.scrollTo.max(elem[0], 'y');

  //console.log($.scrollTo.max('#menuScrollUp > a', 'y'));
  
  $('#playerControl').hide();
  
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

  $('.item a').click(function() {
    var itemUrl = $(this).attr('rel');
    var itemParent = $(this).parent();
    var itemDate = itemParent.find('span.datum').text();
    var itemTitle = itemParent.find('span.nadpis').text();
    var itemDesc = itemParent.find('span.popis').text();

    $('#playerControl').show();

    if ($.browser.msie) { //IE
      var playerObj = document.getElementById('playerObjectIE');
      //playerObj.controls.stop();
      if ($('#playerDefImg').is(':hidden') == false) {
        $('#playerDefImg').addClass('wf-noShow');
      }
      playerObj.URL = itemUrl;
      //playerObj.uiMode = 'none';
      $('#playerObjectIE').removeClass('wf-noShow');
      playerObj.controls.play();
    } else { // ... and the rest ...
      $('#playerObject').addClass('wf-noShow');
      $('#playerObject param').each(function() {
        if ($(this).attr('name') == 'URL') {
          $(this).attr('value', itemUrl);
        }
      });
      if ($('#playerDefImg').is(':hidden') == false) {
        $('#playerDefImg').addClass('wf-noShow');
      }
      $('#playerObject').removeClass('wf-noShow');
      initPlayer();
    }
    
    $('#descriptionIn h2').empty().append(itemDate + '&nbsp;' + itemTitle);
    $('#descriptionIn p').empty().append(itemDesc);
  });

  $('#tvStop').click(function() {
    playerStop();
    console.log('stop');
  });

});
