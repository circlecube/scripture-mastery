/*

*/
var gaPlugin;
var activity_log = [];
var touching = false;
var keep_log = true;
var show_hints = true;
var language = 'english';
var font_size = 'normal';
var long_word_length = 3;
var short_word_length = 4;
var clicked;
var quiz_article = -1;
var quiz_guesses_total = 0;
var quiz_guesses_correct = 0;
var quiz_guesses_incorrect_streak = 0;
var quiz_guesses_incorrect_streak_for_hint = 2;
var blank_string = '___';
var langs = {
	english: { 
		language_native: "English", 
		language_english: "English",
		title: "Scripture", 
		title_plural: "Scripture Masteries", 
		church: "The Church of Jesus Christ of Latter-day Saints",
		about_text: "<p>Seminaries and Institutes of Religion has selected 25 scripture mastery passages for each of the four seminary courses. These passages provide an important scriptural foundation for understanding and sharing the gospel and for strengthening faith. Seminary students are encouraged to develop a “mastery” of these passages as described below. Institute students should be encouraged to build upon the foundation of these 100 scripture mastery passages and develop a depth of understanding of other key passages of scripture. Mastery of scripture passages includes:</p><ul><li>Locating the verses by knowing the associated scriptural references.</li><li>Understanding the context and content of the scripture passages.</li><li>Applying the gospel principles and doctrines taught in the scripture passages.</li><li>Memorizing the passages.</li></ul><p>Memorization can be a wonderful tool to help students know and love selected passages of scripture. As Elder Richard G. Scott explained, “When scriptures are used as the Lord has caused them to be recorded, they have intrinsic power that is not communicated when paraphrased” (“He Lives,” Ensign, Nov. 1999, 88). Care should be taken, however, to tailor expectations to each student’s capabilities and circumstances. Students should not be made to feel embarrassed or overwhelmed if they are unable to memorize.</p><p>Teachers will be better able to help their students if they master these passages themselves. When teachers refer to scripture mastery passages with consistency, maintain appropriate expectations, and use methods that appeal to different learning styles, they will be more successful in helping students to master these key passages. During lessons, scripture mastery passages should be used to clarify related doctrines and principles. They may be used as the theme for devotionals or displayed somewhere in the classroom. Students should also be encouraged to study and apply them outside of class.</p><p>In locations where multiple teachers serve together on a faculty, student learning will be enhanced when faculty members take a unified approach to scripture mastery. Periodically teachers may choose to review scripture mastery references from previous years so that students can maintain mastery of all of the selected passages.</p><p>While scripture mastery is an important part of the curriculum, it should supplement, not overshadow, daily sequential study of the scriptures. Teachers should be wise in the time they allot to scripture mastery. Home-study teachers must be particularly careful that the weekly class does not become a weekly scripture mastery activity. Teachers should choose methods, activities, and music that are in keeping with the dignity, purpose, and spirit of the scriptures and that avoid contention.</p>",
		skip: "Skip",
		next: "Continue",
		again: "Again",
		quiz: "Quiz",
		about: "About",
		log: "Activity",
		clear_log: "Clear Activity Log",
		hints: "Hints",
		hints_show: "Show Hints",
		hints_hide: "Do Not Show Hints",
		difficulty: "Difficulty",
		difficulty_all: "All Words",
		difficulty_long: "Long Words",
		difficulty_short: "Short Words",
		difficulty_random: "Random Words",
		difficulty_first_letter: "First Letter",
		list: "List All",
		font_size: "Font Size",
		normal: "Normal",
		large: "Large",
		small: "Small",
		language_string: "Language"
	}
};
var difficulty = langs['english'].difficulty_all;
/*
difficulty levels
'all_words', 
'long_words', 
'short_words', 
'random_words', 
'even_words',
'odd_words',
'first_letter'
*/

var active_canon = sm_bom;

jQuery(document).ready(function($) {

	function init(){
		document.addEventListener("deviceready", onDeviceReady, false);
		document.addEventListener("menubutton", onMenuKeyDown, false);
		document.addEventListener("backbutton", onBackKeyDown, false);

		//get local storage settings
		if (localStorage.font_size){
			font_size = localStorage.font_size;
		}
		if (localStorage.difficulty){
			difficulty = localStorage.difficulty;
		}
		if (localStorage.language){
			language = localStorage.language;
		}
		if (localStorage.show_hints){
			show_hints = localStorage.show_hints;
		}
		if (localStorage.activity_log){
			activity_log = JSON.parse(localStorage.activity_log);
		}

		//reset log
		//activity_log = [];

		$('body').attr('class', '');
		$('body').addClass(  'font-' + font_size );

		update_language();
		game_aofs();
	}

	function onDeviceReady() {
		//https://github.com/phonegap-build/GAPlugin/blob/c928e353feb1eb75ca3979b129b10b216a27ad59/README.md
		//gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Button", "Click", "event only", 1);
	    //gaPlugin = window.plugins.gaPlugin;
	    //gaPlugin.init(nativePluginResultHandler, nativePluginErrorHandler, "UA-1466312-11", 10);
		//gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "App", "Begin", quiz_article);

	}
	

	function onMenuKeyDown() {
	    // Handle the menu button
	    $('.menu-toggle').trigger('click');
	}

	function onBackKeyDown() {
	    // Handle the back button
	    // do nothing
	}

	$('#mmenu').mmenu({
		slidingSubmenus: false,
		onClick: {
			setSeleted: false,
			preventDefault: null,
			close: true
		}
	});

	function update_language(){
		//console.log('update_language!', language);

		$('.quiz_begin').text(	langs[language].quiz );
		$('.quiz_jump li').remove();
		for ( var i = 0; i < active_canon.length; i++){
			$('.quiz_jump').append('<li><a href="#" class="quiz_begin_jump" data-value="' + (i+1) + '">' + active_canon[i].reference  + '</a></li>');
		}	

		$('.list_all').text(	langs[language].list );
		$('.about').text( 		langs[language].about );

		$('.difficulty').text( 				langs[language].difficulty );
		$('.difficulty-all_words').text( 	langs[language].difficulty_all );
		$('.difficulty-random_words').text( langs[language].difficulty_random );
		$('.difficulty-long_words').text( 	langs[language].difficulty_long );
		$('.difficulty-short_words').text( 	langs[language].difficulty_short );
		$('.difficulty-first_letter').text( langs[language].difficulty_first_letter );
		// $('.difficulty-all_words').data( 'value', 	langs['english'].difficulty_all );
		// $('.difficulty-random_words').data( 'value', 	langs['english'].difficulty_random );
		// $('.difficulty-long_words').data( 'value', 	langs['english'].difficulty_long );
		// $('.difficulty-short_words').data( 'value', 	langs['english'].difficulty_short );
		// $('.difficulty-first_letter').data( 'value', 	langs['english'].difficulty_first_letter );

		// $('.language').text( 			langs[language].language_string );
		// $('.language-english').text( 	langs['english'].language_native );
		// $('.language-french').text( 	langs['french'].language_native );
		// $('.language-spanish').text( 	langs['spanish'].language_native );
		// $('.language-german').text( 	langs['german'].language_native );
		
		$('.font_size').text( 			langs[language].font_size );
		$('.font_size-large').text( 	langs[language].large );
		$('.font_size-normal').text( 	langs[language].normal );
		$('.font_size-small').text( 	langs[language].small );

		$('.hints_option').text( 		langs[language].hints );
		$('.hints_option-show').text( 	langs[language].hints_show );
		$('.hints_option-hide').text( 	langs[language].hints_hide );


		$('.title').text(	langs[language].title_plural );

		//set active from local storage vars
		console.log(font_size, difficulty, language);
		$('.difficulty_option, .language_option, .font_size_option, .hints_option').parent().removeClass('active');
		$('.font_size_option[data-value="' + font_size + '"]').parent().addClass('active');
		$('.language_option[data-value="' + language + '"]').parent().addClass('active');
		$('.difficulty_option[data-value="' + difficulty + '"]').parent().addClass('active');
		$('.hints_option[data-value="' + show_hints + '"]').parent().addClass('active');
	}	

	function list_aofs(){
		var aofs = '';//'<h2 class="sub-title">' + langs[language].title_plural + '</h2>';

		for(var i=0; i<active_canon.length; i++){
			aofs += "<article class='aof_" + i + "'>";
			aofs += "<dt>" + active_canon[i].reference + "</dt>";
			aofs += "<dd>" + active_canon[i].verse;
			//aofs += "<div class='button button_game' data-id='" + i + "'>" + langs[language].quiz + "</div></dd>";
			aofs += "</article>";
		}
		$('.title').text( langs[language].title_plural );
		$('.content').html(aofs);

		$('article dd').each(function(idx,e){
			//$(this).slideUp();
		});
	}

	$('.content').on('click touch', 'article dt', function(e){
		$(this).next('dd').slideToggle();
		$(this).toggleClass('active');
	});

	$('.font_size_option').on('click touch', function(e){
		//console.log('font size update:', $(this).data('value') );
		font_size = $(this).data('value');
		localStorage.font_size = font_size;
		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
		$('body').attr('class', '');
		$('body').addClass(  'font-' + font_size );
	});
	$('.difficulty_option').on('click touch', function(e){
		//console.log('difficulty update:', $(this).data('value'));
		difficulty = $(this).data('value');
		localStorage.difficulty = difficulty;
		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
		quiz_article--;
		game_aofs();
		//console.log(difficulty);
	});
	// $('.language_option').on('click touch', function(e){
	// 	//console.log('language change:', $(this).val() );
	// 	language = $(this).data('value');
	// 	localStorage.language = language;
	// 	$(this).parent().siblings().removeClass('active');
	// 	$(this).parent().addClass('active');
	// 	$('.content').html('');
	// 	update_language();
	// 	quiz_article--;
	// 	game_aofs();
	// });
	$('.list_all').on('click touch', function(e){
		list_aofs();
	});
	$('body').on('touchstart', function(){
		// commented for browser dev only??
		//touching = true;
	});
	$('body').on('touchend', function(){
		touching = false;
	});
	$('.quiz_begin').on('click touch', function(e){
		quiz_article = -1;
		game_aofs();
	});
	$('.quiz_jump').on('click touch', '.quiz_begin_jump', function(e){
		quiz_article = $(this).data('value') - 2;
		game_aofs();
	});
	$('.about').on('click touch', function(e){
		show_about();
	});
	$('.option_keep_log').on('click touch', function(e){
		keep_log = !$(this).parent().hasClass('active');
		if ( keep_log ) {
			$(this).parent().addClass('active');
		}
		else{
			$(this).parent().removeClass('active');
		}
	});
	$('.hints_option').on('click touch', function(e){
		show_hints = $(this).data('value');
		localStorage.show_hints = show_hints;
		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
	});
	$('.activity_log').on('click touch', function(e){
		show_activity_log();
	});
	$('.content').on('click touch', '.button_skip', function(e){
		game_aofs();
	});
	$('.content').on('click touch', '.button_again', function(e){
		quiz_article--;
		$(this).remove();
		game_aofs();
	});
	$('.options_toggle').on('click touch', function(){
		$('.options').toggleClass('active');
	})
	$('.content').on('click touch', '.button_clear_log', function(e){
		activity_log = [];
		localStorage.activity_log = JSON.stringify(activity_log);
		show_activity_log();
	})
	function show_about(){
		var content = '<dt>' + langs[language].about + ': ' + langs[language].title_plural + '</dt>';
		content += '<dd>' + langs[language].about_text + '</dd>';

		$('.content').html( content );
	}
	function show_activity_log(){
		var content = '<dt>' + langs[language].log + '</dt>';
		for( var i=0; i<activity_log.length;i++){
			console.log(activity_log[i]);
			if ( activity_log[i].s != undefined ) {
				content += '<dd>' + activity_log[i].s + '% - ';
				content += active_canon[ activity_log[i].i ].reference + ' ';
				// content += ' (' + activity_log[i].d + ') ';
				content += relative_time(activity_log[i].t) + '.</dd>';
			}
		}
		content += '<div class="button button_clear_log">' + langs[language].clear_log + '</div>';
		$('.content').html( content );
	}
	function game_aofs(){
		//console.log(quiz_article);
		quiz_article++;
		if (quiz_article > 24 || quiz_article < 0 ){
			quiz_article = 0;
		}
		//var random_article = Math.floor( aof.length * Math.random() );
		var random_article_words = randomize_aof( quiz_article );
		var content = '';//<h2 class="sub-title">' + langs[language].quiz + ': ' + langs[language].ordinals[quiz_article] + ' ' + langs[language].title + '</h2>';
		content += '<dt>' + langs[language].title + ' ' + langs[language].quiz + ': ' + active_canon[quiz_article].reference + '</dt><dd class="ordered"></dd><dd class="unordered">';

		//place unordred words
		if (difficulty == langs['english'].difficulty_long ){
			for (var i = 0; i < random_article_words.length; i++){
				if (random_article_words[i].length > long_word_length) {
					content += '<span class="word" data-absolute_order="' + random_article_words[i].absolute_order + '" data-order="' + random_article_words[i].order + '">' + random_article_words[i].word + '</span>';
				}
			}
		}
		else if (difficulty == langs['english'].difficulty_short ){
			for (var i = 0; i < random_article_words.length; i++){
				if (random_article_words[i].length < short_word_length) {
					content += '<span class="word" data-absolute_order="' + random_article_words[i].absolute_order + '" data-order="' + random_article_words[i].order + '">' + random_article_words[i].word + '</span>';
				}
			}
		}
		else if (difficulty == langs['english'].difficulty_random ){
			for (var i = 0; i < random_article_words.length; i++){
				if (i < random_article_words.length/2) {
					content += '<span class="word" data-absolute_order="' + random_article_words[i].absolute_order + '" data-order="' + random_article_words[i].order + '">' + random_article_words[i].word + '</span>';
				}
			}
		}
		else if (difficulty == langs['english'].difficulty_first_letter ){
			for (var i = 0; i < random_article_words.length; i++){
				content += '<span class="word" data-absolute_order="' + random_article_words[i].absolute_order + '" data-order="' + random_article_words[i].order + '">' + random_article_words[i].word + '</span>';
			}
		}
		//default - normal - all words
		else{
			for (var i = 0; i < random_article_words.length; i++){
				content += '<span class="word" data-order="' + random_article_words[i].order + '">' + random_article_words[i].word + '</span>';
			}
		}


		content += '</dd>';
		content += '<div class="button button_skip">' + langs[language].skip + '</div>';
		$('.content').html( content );
		$('.options').removeClass('active');

		//place ordered words
		if (difficulty == langs['english'].difficulty_long ){
			for (var i = 0; i < random_article_words.length; i++){
				if (random_article_words[i].length > long_word_length) {
					add_to_ordered_dd(random_article_words[i].absolute_order, random_article_words[i].order);
				}
				else {
					add_to_ordered_dd(random_article_words[i].absolute_order, random_article_words[i].order, random_article_words[i].word);
				}
			}
		}
		else if (difficulty == langs['english'].difficulty_short ){
			for (var i = 0; i < random_article_words.length; i++){
				if (random_article_words[i].length < short_word_length) {
					add_to_ordered_dd(random_article_words[i].absolute_order, random_article_words[i].order);
				}
				else {
					add_to_ordered_dd(random_article_words[i].absolute_order, random_article_words[i].order, random_article_words[i].word);
				}
			}
		}
		else if (difficulty == langs['english'].difficulty_random ){
			for (var i = 0; i < random_article_words.length; i++){
				if (i < random_article_words.length/2) {
					add_to_ordered_dd(random_article_words[i].absolute_order, random_article_words[i].order);
				}
				else {
					add_to_ordered_dd(random_article_words[i].absolute_order, random_article_words[i].order, random_article_words[i].word);
				}
			}
		}
		else if (difficulty == langs['english'].difficulty_first_letter ){
			for (var i = 0; i < random_article_words.length; i++){
				add_to_ordered_dd(random_article_words[i].absolute_order, random_article_words[i].order, random_article_words[i].word, true);
			}
		}
		else {
			//nothing - all words are unordered
			clicked = 0;
		}
		//reset scores
		quiz_guesses_total = 0;
		quiz_guesses_correct = 0;
		quiz_guesses_incorrect_streak = 0;
		update_clicked();
	}
	function update_clicked(){
		$('.ordered .current').removeClass('current');
		//add class to style current blank for UI benefit
		//find next blank in ordered section
		if ( $('.ordered .word.blank').length > 0 ) {
			clicked = $('.ordered .word.blank').first().addClass('current').data('absolute_order');
			//console.log( 'first blank' );
		}
		//if no blank and no unordered nothing
		else if( $('.unordered .word').length <= 0 ) {
			//nothing
			//console.log( 'no blanks, no guesses - none' );
		}
		//if no blank find total
		else if ( $('.ordered .word').length > 0 ) {
			clicked = $('.ordered .word').length;
			//$('.ordered .word:last').addClass('current');
			//console.log( 'no blanks, total used' );
		}
		else{
			clicked = 0;
		}

		console.log( clicked );
	}
	function show_hint(){
		if ( show_hints ) {
			$('.word').removeClass('hint');
			$('.unordered .word[data-absolute_order="'+clicked+'"]').addClass('hint');
			if ( $('.hint').length < 1 ){
				//find all right answers
				console.log('none hinted');
				$('.unordered .word').each(function(i,e){
					var this_order = $(this).data('order');
					if( this_order.indexOf("," + clicked + ",") != -1 ) {
						$(this).addClass('hint');
					}
				});
			}
		}
	}
	function add_to_ordered_dd(absolute_order, order, word, letter_only){
		var blank_class = '';
		//console.log('before', $('.ordered').text() );
		if ( word == undefined || word == null || word == blank_string ) {
			word = blank_string;
			blank_class='blank';
		}
		if ( letter_only != undefined || letter_only != null || letter_only == true ) {
			var letter = word.charAt(0);
			word = letter + blank_string;
			blank_class='blank';
		}
		word_html = '<span class="word ' + blank_class + '" data-absolute_order="' + absolute_order + '" data-order="' + order + '">' + word + '</span>';
		var added = false;
		var order_ar = order.split(',');
		order_ar.shift();
		order_ar.pop();
		if ($('.ordered .word').length > 0) {
			//for (var j = 0; j < order_ar.length; j++){
				//console.log('order array', j, order_ar[j]);
				//order = parseInt(order_ar[j]);
				order = absolute_order;
				$('.ordered .word').each(function(i,e){
					/* order is an array of each value. use first one and if it already exists check the next one. check each order value */

					//console.log(i, order, $(this).data('order'));
					if (!added){
						//this order is already here and is "___", replace it
						if ( parseInt($(this).data('absolute_order')) == order && $(this).hasClass('blank') ) {
							//console.log(word, order, 'replacewith', $(this).data('absolute_order'), $(this).text());
							$(this).replaceWith(word_html);
							$(this).removeClass('blank');
							added = true;
		//console.log('after', $('.ordered').text() );
							return true;
						}
						//this order already here but not a blank spot, check the next index or order
						else if ( parseInt($(this).data('absolute_order')) == order && !$(this).hasClass('blank') ){
							//nothing - order will be incremented and checked again next go around in the for j loop
							//console.log(word, order, 'match found but not blank so continue from here with next order value', $(this).data('absolute_order'), $(this).text());
							j++;
							order = parseInt(order_ar[j]);
							//return true;
						}
						//found a higher order data attribte, add this one before that one
						else if ( parseInt($(this).data('absolute_order')) > order ) {
							//console.log(word, order, 'inserted before', $(this).data('absolute_order'), $(this).text());
							$(this).before(word_html);
							added = true;
		//console.log('after', $('.ordered').text() );
							return true;
						}
						else{
							//nothing, check the next one
							//console.log(word, order, 'not added here, continue');
						}
					}
				});

			//}
			//no place to insert, add it to the end - the order is after the last word 
			if (!added) {
				//console.log(word, order, 'appended to end');
				$('.ordered').append(word_html);
		//console.log('after', $('.ordered').text() );
				return true;
			}
		}
		//no words yet, add this first one
		else {
			$('.ordered').html(word_html)
			//console.log(word, 'added first one', absolute_order, order);
		//console.log('after', $('.ordered').text() );
			return true;
		}
	}


	$('.content').on('click touchstart', '.unordered .word', function(e){
		//if (!touching) {
		//uncomment for desktop testing
		if (true){
			touching = true;
			quiz_guesses_total++;
			var this_order = $(this).data('order');
			//console.log(this_order, clicked, this_order.indexOf("," + clicked + ","));
			//simple order
			// if ( this_order == clicked ) {
			// 	$(this).addClass('clicked');
			// 	clicked++;
			// }
			//multiple order
			if( this_order.indexOf("," + clicked + ",") != -1 ) {
				quiz_guesses_correct++;
				quiz_guesses_incorrect_streak = 0;
				//$(this).addClass('clicked');
				//remove clicked word and append to a preceding div
				//$('.ordered').append( $(this) );
				add_to_ordered_dd( clicked, $(this).data('order'), $(this).text() );
				$(this).remove();
				//clicked++;
				//remove hints (in case more than one match)
				$('.word').removeClass('hint');
			}
			else {
				quiz_guesses_incorrect_streak++;

				if (quiz_guesses_incorrect_streak >= quiz_guesses_incorrect_streak_for_hint) {
					show_hint();
				}
			}
			//console.log(quiz_guesses_correct, '/', quiz_guesses_total);
			update_clicked();
			//console.log($('.unordered .word').length);
			//show next
			if ( $('.unordered .word').length < 1) {
				$('.unordered').addClass('empty');
				$('.button_skip').text( langs[language].next );
				$('.button_skip').after( "<div class='button button_again'>" + langs[language].again + "</div>" );
				var score = parseInt( (quiz_guesses_correct / quiz_guesses_total) * 100 );
				$('dt').append(" - " + score + "%");

				if ( keep_log ) {
					var now = new Date();
					var timestamp = now.getTime();
					//save completed article, difficulty level and score and timestamp to local storage to be displayed on the activity log page.
					activity_log.unshift({
						s: score,
						d: difficulty,
						t: timestamp,
						i: quiz_article
					});
					// = quiz_article + ',' + difficulty + ',' + score + ',' + timestamp + '|' + activity_log;
					localStorage.activity_log = JSON.stringify(activity_log);
					//console.log (activity_log, JSON.stringify(activity_log) );
				}
/*
To track an event, call (oddly enough) trackEvent(). trackEvent takes 6 arguments;

1)  resultHandler - a function that will be called on success
2)  errorHandler - a function that will be called on error.
3)  category - This is the type of event you are sending such as "Button", "Menu", etc.
4)  eventAction - This is the type of event you are sending such as "Click", "Select". etc.
5)  eventLabel - A label that describes the event such as Button title or Menu Item name.
6)  eventValue - An application defined integer value that can mean whatever you want it to mean.
*/
				//gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Level", "Finish", quiz_article, score);
			}
			//console.log('score :', quiz_guesses_correct / quiz_guesses_total);
		}
	});


	function randomize_aof(article){
		//console.log('randomize_aof()');
		//split article into array of words in correct order

		//split array into verses first to seperate the verses for easier scrambles
		var article_word = active_canon[article].verse.split(' ');
		var article_words = [];
		//copy words into array with correct order vars
		for (var i = 0; i < article_word.length; i++){
			article_words.push({ 
				word: article_word[i], 
				order: i,
				absolute_order: i,
				odd: i % 2,
				length: article_word[i].length
			});
		}
		//console.log(article_words);
		article_words.sort(
			function compare(a,b) {
			  if (a.word < b.word)
			     return -1;
			  if (a.word > b.word)
			    return 1;
			  return 0;
			}
		);
		//console.log(article_words);
		for (var i = 0; i < article_words.length; i++){
			//console.log(article_words[i].word);
			if ( i < article_words.length-1 && article_words[i].word == article_words[i+1].word ){
				var j,k = i;
				var ik_order = ',';
				var ik_order_ar = [];
				for (j = i; j < article_words.length;j++){
					if ( article_words[i].word == article_words[j].word ){
						k=j;
						ik_order += article_words[j].order + ',';
						ik_order_ar.push(article_words[j].order);
						//console.log(ik_order);
					}
				}
				ik_order_ar.sort(function(a,b){return a-b});
				for (j = i; j <= k; j++){
					article_words[j].order_ar = ik_order_ar;
					ik_order = ',' + ik_order_ar.join() + ',';
					article_words[j].order = ik_order;
				}	
				i = k;
			}
			else{
				article_words[i].order = ',' + article_words[i].order + ',';
				article_words[i].order_ar = new Array();
				article_words[i].order_ar[0] = article_words[i].order;
				//console.log(article_words[i].order);
			}
		}
		//random sort
		article_words.sort(
			function() {
				return 0.5 - Math.random();
			}
		);
		return article_words;
	}

	function nativePluginResultHandler(){
		//success
		//console.log('nativePluginResultHandler', 'success');
	}
	function nativePluginErrorHandler() {
		//error
		//console.log('nativePluginErrorHandler', 'fail');
	}
	function goingAway() {
		//gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "App", "End", quiz_article);
	    //gaPlugin.exit(nativePluginResultHandler, nativePluginErrorHandler);
	}


	function relative_time(time) {
      var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
      var delta = parseInt((relative_to.getTime() - time) / 1000);
      var r = '';
      if (delta < 20) {
        r = 'just now';
      } else if (delta < 60) {
        r = delta + ' seconds ago';
      } else if(delta < 120) {
        r = 'a minute ago';
      } else if(delta < (45*60)) {
        r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
      } else if(delta < (2*60*60)) {
        r = 'an hour ago';
      } else if(delta < (24*60*60)) {
        r = (parseInt(delta / 3600, 10)).toString() + ' hours ago';
      } else if(delta < (48*60*60)) {
        r = 'a day ago';
      } else {
        r = (parseInt(delta / (24*60*60))).toString() + ' days ago';
      }
      return r;
    }


	init();
});