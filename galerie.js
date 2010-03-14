$(document).ready(function() {

	//gallery
	if ($('dd.media-foto-slider ul li').length > 0) {
		//inicializace
		$('dd.media-foto-slider ul li').each(function(i) {
			//kopirovani a vymazani obsahu href
			$(this).find('a').attr('rel', $(this).find('a').attr('href'));
			$(this).find('a').removeAttr('href');
		});
		$(window).load(function() {
			swapImage($('dd.media-foto-slider ul li:first'));
			updateSlider();
		});
		$('dd.media-foto-slider ul li:gt(3)').hide();
		$('dd.media-foto-detail').show();
		$('p.control').show();

		//udalosti
		$('dd.media-foto-slider ul li').bind( {
			click: function() {
				swapImage($(this));
				updateSlider();
			}
		});

		$('.control-previous').bind( {
			click: function() {
				var mslidersel = $('dd.media-foto-slider ul li a.selected').parent();
				if (mslidersel.index() > 0) {
					swapImage(mslidersel.prev());
					updateSlider('prev');
				}
			}
		});

		$('.control-next').bind( {
			click: function() {
				var mslidersel = $('dd.media-foto-slider ul li a.selected').parent();
				if (mslidersel.index() < $('dd.media-foto-slider ul li').length - 1) {
					swapImage(mslidersel.next());
					updateSlider('next');
				}
			}
		});

		//pomocne funkce
		function swapImage(m) {
			var mslider = $('dd.media-foto-slider ul li');
			var mdetail = $('dd.media-foto-detail');

			//prepnuti 'selected'
			mslider.find('a').removeClass('selected');
			m.find('a').addClass('selected');
			//naplneni detailu potrebnymi udaji
			mdetail.find('a').attr('href', m.find('a').attr('rel'));
			mdetail.find('img').attr('src', m.find('img').attr('src'));
			mdetail.find('img').attr('alt', m.find('img').attr('alt'));
			$(mdetail.find('span.imagelabel')).text(m.find('span.imagelabel').text());
		}

		function updateSlider(n) {
			var mslider = $('dd.media-foto-slider ul li');
			var mslidersel = $('dd.media-foto-slider ul li a.selected').parent();
			var firstVisible = null;
			var lastVisible = null;

			switch (n) {
				case 'next': //sipka dalsi
					$('dd.media-foto-slider ul li').each(function(index) {
						if (firstVisible == null) {
							if (this.style.display != 'none') {
								firstVisible = $(this);
							}
						}
						else {
							if (this.style.display != 'none') {
								lastVisible = $(this);
							}
						}
					});
					//posun obrazku
					//if (mslidersel.index() > $('dd.media-foto-slider ul li:visible:last').index()) {
					if (mslidersel.index() > lastVisible.index()) {
						//$('dd.media-foto-slider ul li:visible:first').hide();
						//$('dd.media-foto-slider ul li:visible:last').next().show();
						firstVisible.hide();
						lastVisible.next().show();
					}
					//rozsviceni leve sipky
					if (mslidersel.index() == 1) {
						$('a.control-previous span').removeClass('mdisabled');
						//korektni postup, ale nefunguje; rebind?
						//$('span.control-previous').remove();
						//$('p.control').after('<a class="control-previous">&lt;<span></span></a>');
					}
					//zhasnuti prave sipky
					if (mslidersel.index() == (mslider.length - 1)) {
						$('a.control-next span').addClass('mdisabled');
					}
					break;
				case 'prev': //sipka predchozi
					$('dd.media-foto-slider ul li').each(function(index) {
						if (firstVisible == null) {
							if (this.style.display != 'none') {
								firstVisible = $(this);
							}
						}
						else {
							if (this.style.display != 'none') {
								lastVisible = $(this);
							}
						}
					});
					//posun obrazku
					if (mslidersel.index() < firstVisible.index()) {
						lastVisible.hide();
						firstVisible.prev().show();
					}
					//zhasnuti leve sipky
					if (mslidersel.index() == 0) {
						$('a.control-previous span').addClass('mdisabled');
					}
					//rozsviceni prave sipky
					if (mslidersel.index() == (mslider.length - 2)) {
						$('a.control-next span').removeClass('mdisabled');
					}
					break;
				default: //kliknuti na obrazek
					//zhasnuti leve sipky
					if (mslidersel.index() == 0 && mslider.length > 1) {
						$('a.control-previous span').addClass('mdisabled');
						$('a.control-next span').removeClass('mdisabled');
					}
					//zhasnuti prave sipky
					else if (mslidersel.index() == (mslider.length - 1)) {
						$('a.control-next span').addClass('mdisabled');
					}
					//rozsviceni obou sipek
					else {
						$('a.control-previous span').removeClass('mdisabled');
						$('a.control-next span').removeClass('mdisabled');
					}
			}

		}

	}

});
