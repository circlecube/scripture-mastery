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
		ordinals: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th"],
		title: "Article of Faith", 
		title_plural: "13 Articles of Faith", 
		church: "The Church of Jesus Christ of Latter-day Saints",
		about_text: "<p>One of the first things we’re taught as children are the Articles of Faith — 13 statements that summarize our fundamental beliefs.</p><p>The Prophet Joseph Smith wrote them in a letter to a newspaper editor, John Wentworth, who had asked for information about the Church.</p><p>Ever since the Articles of Faith were written, they’ve inspired and directed us in the basic principles of our gospel. They enhance our understanding of certain doctrines and help us commit to living them. They invite further thought. And they’re a good tool for explaining our beliefs to people unfamiliar with them.</p>",
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
	},
	french: { 
		language_native: "Français", 
		language_english: "French", 
		ordinals: ["1er", "2e", "3e", "4e", "5e", "6e", "7e", "8e", "9e", "10e", "11e", "12e", "13e"],
		title: "Article de Foi", 
		title_plural: "Treize articles de foi", 
		church: "L'ÉGLISE DE JÉSUS-CHRIST DES SAINTS DES DERNIERS JOURS" ,
		about_text: "<p>Les Articles de Foi font partie des premières choses que l’on nous enseigne dans notre enfance : ces treize déclarations résument nos croyances fondamentales.</p><p>Deux ans avant de mourir, Joseph Smith, le prophète, les communiqua par lettre à John Wentworth, rédacteur en chef d’un journal, qui lui avait demandé des renseignements sur l’Église.</p><p>Depuis ce jour, les Articles de Foi sont une source d’inspiration pour les gens qui veulent obéir aux principes fondamentaux de l’Évangile. Grâce aux Articles de Foi, nous comprenons mieux certains points de doctrine et nous nous engageons réellement à vivre les principes de l’Évangile. Nous nous sentons poussés à réfléchir davantage. Enfin, les Articles de Foi sont un bon moyen d’expliquer nos croyances aux personnes qui les connaissent peu.</p>",
		skip: "Passer",
		next: "Continuer",
		again: "Refaire",
		quiz: "Quiz",
		about: "Infos",
		log: "Activité",
		clear_log: "Effacer Activité Log",
		hints: "Allusions",
		hints_show: "Montrent Conseils",
		hints_hide: "Ne Montrent Pas de Conseils",
		difficulty: "Difficulté",
		difficulty_all: "Tous les mots",
		difficulty_long: "Les mots longs",
		difficulty_short: "Mots plus courts",
		difficulty_random: "Let mots au hasard",
		difficulty_first_letter: "Première Lettre",
		list: "Liste Complète",
		font_size: "Taille du texte",
		normal: "Normale",
		large: "Grand",
		small: "Petit",
		language_string: "Langue"
	},
	spanish: { 
		language_native: "Español", 
		language_english: "Spanish", 
		ordinals: ["1°", "2°", "3°", "4°", "5°", "6°", "7°", "8°", "9°", "10°", "11°", "12°", "13°"],
		title: "Artículo de Fe", 
		title_plural: "13 Artículos de Fe", 
		church: "LA IGLESIA DE JESUCRISTO DE LOS SANTOS DE LOS ÚLTIMOS DÍAS" ,
		about_text: "<p>Algunas de las primeras cosas que se nos enseñan de niños son los Artículos de Fe: son trece declaraciones que resumen nuestras creencias fundamentales.</p><p>Dos años antes de su muerte, el profeta José Smith los escribió en una carta que dirigió a John Wentworth, director de un periódico, quien había solicitado información acerca de la Iglesia.</p><p>Desde que se redactaron los Artículos de Fe, nos han servido de inspiración y de guía en cuanto a los principios básicos del Evangelio. Amplían nuestro entendimiento de ciertas doctrinas y nos ayudan a comprometernos a vivirlas. Nos invitan a reflexionar. Además, son un buen recurso para explicar nuestras creencias a las personas que no las conocen.</p>",
		skip: "Pasar",
		next: "Continuar",
		again: "Rehacer",
		quiz: "Examen",
		about: "Info",
		log: "Actividad",
		clear_log: "Borrar Actividad Log",
		hints: "Consejo",
		hints_show: "Mostrar Consejo",
		hints_hide: "No Mostrar Consejo",
		difficulty: "Dificultad",
		difficulty_all: "Todas las Palabras",
		difficulty_long: "Palabras largas",
		difficulty_short: "Las palabras más cortas",
		difficulty_random: "Palabras azar",
		difficulty_first_letter: "Primera Letra",
		list: "Lista Completa",
		font_size: "Tamaño del texto",
		normal: "Normal",
		large: "Grande",
		small: "Pequeño",
		language_string: "Lengua"
	},
	german: { 
		language_native: "Deutsch", 
		language_english: "German", 
		ordinals: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
		title: "Die Glaubensartikel", 
		title_plural: "Die 13 Glaubensartikel",
		church: "KIRCHE JESU CHRISTI DER HEILIGEN DER LETZTEN TAGE" ,
		about_text: "<p>Wir lernen bereits als Kind jene dreizehn Aussagen, in denen unsere grundlegenden Glaubensansichten zusammengefasst sind.</p><p>Der Prophet Joseph Smith schrieb sie zwei Jahre vor seinem Tod in einem Brief an John Wentworth nieder, den Herausgeber einer Zeitung, der um Informationen bezüglich der Kirche gebeten hatte.</p><p>Seit damals, als die Glaubensartikel verfasst worden sind, weisen sie auf die grundlegenden Evangeliumsprinzipien hin. Sie helfen uns, bestimmte Lehren besser zu verstehen und bereitwillig danach zu leben. Sie regen dazu an, sich tiefere Gedanken zu machen. Und sie sind ein gutes Hilfsmittel, jemandem, der unsere Lehre nicht so gut kennt, diese zu erläutern.</p>",
		skip: "überspringen",
		next: "Weiter",
		again: "Wieder",
		quiz: "Quiz",
		about: "Info",
		log: "Aktivität",
		clear_log: "Löschen Aktivität Log",
		hints: "Hinweise",
		hints_show: "Anzeige Hinweise",
		hints_hide: "Keine Hinweise Angezeigt",
		difficulty: "Schwierigkeit",
		difficulty_all: "Alle Wörter",
		difficulty_long: "Lange Wörter",
		difficulty_short: "Kurze Wörter",
		difficulty_random: "Zufällige Wörter",
		difficulty_first_letter: "Erster Buchstabe",
		list: "Vollständige Liste",
		normal: "Normale",
		large: "Große",
		small: "Wenig",
		font_size: "Textgröße",
		language_string: "Sprache"
	},
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

var aof = [
	{ aof: 1,   
		spanish: "Nosotros creemos en Dios el Eterno Padre, y en su Hijo Jesucristo, y en el Espíritu Santo.",
		french: "Nous croyons en Dieu, le Père éternel, et en son Fils, Jésus-Christ, et au Saint-Esprit.",
		german: "Wir glauben an Gott, den Ewigen Vater, und an seinen Sohn, Jesus Christus, und an den Heiligen Geist.",
		english: "We believe in God, the Eternal Father, and in His Son, Jesus Christ, and in the Holy Ghost." },
	{ aof: 2,   
		spanish: "Creemos que los hombres serán castigados por sus propios pecados, y no por la transgresión de Adán.",
		french: "Nous croyons que les hommes seront punis pour leurs propres péchés, et non pour la transgression d'Adam.",
		german: "Wir glauben, daß der Mensch für seine eigenen Sünden bestraft werden wird und nicht für die Übertretung Adams.",
		english: "We believe that men will be punished for their own sins, and not for Adam’s transgression." },
	{ aof: 3,   
		spanish: "Creemos que por la Expiación de Cristo, todo el género humano puede salvarse, mediante la obediencia a las leyes y ordenanzas del Evangelio.",
		french: "Nous croyons que, grâce au sacrifice expiatoire du Christ, tout le genre humain peut être sauvé en obéissant aux lois et aux ordonnances de l'Évangile.",
		german: "Wir glauben, daß durch das Sühnopfer Christi alle Menschen errettet werden können, indem sie die Gesetze und Verordnungen des Evangeliums befolgen.",
		english: "We believe that through the Atonement of Christ, all mankind may be saved, by obedience to the laws and ordinances of the Gospel." },
	{ aof: 4,   
		spanish: "Creemos que los primeros principios y ordenanzas del Evangelio son: primero, Fe en el Señor Jesucristo; segundo, Arrepentimiento; tercero, Bautismo por inmersión para la remisión de los pecados; cuarto, Imposición de manos para comunicar el don del Espíritu Santo.",
		french: "Nous croyons que les premiers principes et ordonnances de l'Évangile sont: premièrement la foi au Seigneur Jésus-Christ, deuxièmement le repentir, troisièmement le baptême par immersion pour la rémission des péchés, quatrièmement l'imposition des mains pour le don du Saint-Esprit.",
		german: "Wir glauben, daß die ersten Grundsätze und Verordnungen des Evangeliums sind: erstens der Glaube an den Herrn Jesus Christus; zweitens die Umkehr; drittens die Taufe durch Untertauchen zur Sündenvergebung; viertens das Händeauflegen zur Gabe des Heiligen Geistes.",
		english: "We believe that the first principles and ordinances of the Gospel are: first, Faith in the Lord Jesus Christ; second, Repentance; third, Baptism by immersion for the remission of sins; fourth, Laying on of hands for the gift of the Holy Ghost." },
	{ aof: 5,   
		spanish: "Creemos que el hombre debe ser llamado por Dios, por profecía y la imposición de manos, por aquellos que tienen la autoridad, a fin de que pueda predicar el evangelio y administrar sus ordenanzas.",
		french: "Nous croyons que l'on doit être appelé de Dieu par prophétie, et par l'imposition des mains de ceux qui détiennent l'autorité, pour prêcher l'Évangile et en administrer les ordonnances.",
		german: "Wir glauben, daß man durch Prophezeiung und das Händeauflegen derer, die Vollmacht dazu haben, von Gott berufen werden muß, um das Evangelium zu predigen und seine heiligen Handlungen zu vollziehen.",
		english: "We believe that a man must be called of God, by prophecy, and by the laying on of hands by those who are in authority, to preach the Gospel and administer in the ordinances thereof." },
	{ aof: 6,   
		spanish: "Creemos en la misma organización que existió en la Iglesia Primitiva, esto es, apóstoles, profetas, pastores, maestros, evangelistas, etc.",
		french: "Nous croyons à la même organisation que celle qui existait dans l'Église primitive, savoir: apôtres, prophètes, pasteurs, docteurs, évangélistes, etc.",
		german: "Wir glauben an die gleiche Organisation, wie sie in der Urkirche bestanden hat, nämlich Apostel, Propheten, Hirten, Lehrer, Evangelisten usw.",
		english: "We believe in the same organization that existed in the Primitive Church, namely, apostles, prophets, pastors, teachers, evangelists, and so forth." },
	{ aof: 7,   
		spanish: "Creemos en el don de lenguas, profecía, revelación, visiones, sanidades, interpretación de lenguas, etc.",
		french: "Nous croyons au don des langues, de prophétie, de révélation, de vision, de guérison, d'interprétation des langues, etc.",
		german: "Wir glauben an die Gabe der Zungenrede, Prophezeiung, Offenbarung, der Visionen, der Heilung, Auslegung der Zungenrede usw.",
		english: "We believe in the gift of tongues, prophecy, revelation, visions, healing, interpretation of tongues, and so forth." },
	{ aof: 8,   
		spanish: "Creemos que la Biblia es la palabra de Dios hasta donde esté traducida correctamente; también creemos que el Libro de Mormón es la palabra de Dios.",
		french: "Nous croyons que la Bible est la parole de Dieu dans la mesure où elle est traduite correctement; nous croyons aussi que le Livre de Mormon est la parole de Dieu.",
		german: "Wir glauben, daß die Bibel, soweit richtig übersetzt, das Wort Gottes ist; wir glauben auch, daß das Buch Mormon das Wort Gottes ist.",
		english: "We believe the Bible to be the word of God as far as it is translated correctly; we also believe the Book of Mormon to be the word of God." },
	{ aof: 9,   
		spanish: "Creemos todo lo que Dios ha revelado, todo lo que actualmente revela, y creemos que aún revelará muchos grandes e importantes asuntos pertenecientes al reino de Dios.",
		french: "Nous croyons tout ce que Dieu a révélé, tout ce qu'il révèle maintenant, et nous croyons qu'il révélera encore beaucoup de choses grandes et importantes concernant le royaume de Dieu.",
		german: "Wir glauben alles, was Gott offenbart hat, und alles, was er jetzt offenbart; und wir glauben, daß er noch viel Großes und Wichtiges offenbaren wird, was das Reich Gottes betrifft.",
		english: "We believe all that God has revealed, all that He does now reveal, and we believe that He will yet reveal many great and important things pertaining to the Kingdom of God." },
	{ aof: 10,  
		spanish: "Creemos en la congregación literal del pueblo de Israel y en la restauración de las Diez Tribus; que Sión (la Nueva Jerusalén) será edificada sobre el continente americano; que Cristo reinará personalmente sobre la tierra, y que la tierra será renovada y recibirá su gloria paradisíaca.",
		french: "Nous croyons au rassemblement littéral d'Israël et au rétablissement des dix tribus. Nous croyons que Sion (la nouvelle Jérusalem) sera bâtie sur le continent américain, que le Christ régnera en personne sur la terre, que la terre sera renouvelée et recevra sa gloireparadisiaque.",
		german: "Wir glauben an die buchstäbliche Sammlung Israels und die Wiederherstellung der Zehn Stämme, daß Zion (das Neue Jerusalem) auf dem amerikanischen Kontinent errichtet werden wird, daß Christus persönlich auf der Erde regieren wird und daß die Erde erneuert werden und ihre paradiesische Herrlichkeit empfangen wird.",
		english: "We believe in the literal gathering of Israel and in the restoration of the Ten Tribes; that Zion (the New Jerusalem) will be built upon the American continent; that Christ will reign personally upon the earth; and, that the earth will be renewed and receive its paradisiacal glory." },
	{ aof: 11,  
		spanish: "Reclamamos el derecho de adorar a Dios Todopoderoso conforme a los dictados de nuestra propia conciencia, y concedemos a todos los hombres el mismo privilegio: que adoren cómo, dónde o lo que deseen.",
		french: "Nous affirmons avoir le droit d'adorer le Dieu Tout-Puissant selon les inspirations de notre conscience et reconnaissons le même droit à tous les hommes: qu'ils adorent comme ils veulent, où ils veulent ou ce qu'ils veulent.",
		german: "Wir beanspruchen das Recht, den Allmächtigen Gott zu verehren, wie es uns das eigene Gewissen gebietet, und gestehen allen Menschen das gleiche Recht zu, mögen sie verehren, wie oder wo oder was sie wollen.",
		english: "We claim the privilege of worshiping Almighty God according to the dictates of our own conscience, and allow all men the same privilege, let them worship how, where, or what they may." },
	{ aof: 12,  
		spanish: "Creemos en estar sujetos a los reyes, presidentes, gobernantes y magistrados; en obedecer, honrar y sostener la ley.",
		french: "Nous croyons que nous devons nous soumettre aux rois, aux présidents, aux gouverneurs et aux magistrats, et que nous devons respecter, honorer et défendre la loi.",
		german: "Wir glauben, daß es recht ist, Königen, Präsidenten, Herrschern und Obrigkeiten untertan zu sein und dem Gesetz zu gehorchen, es zu achten und für es einzutreten.",
		english: "We believe in being subject to kings, presidents, rulers, and magistrates, in obeying, honoring, and sustaining the law." },
	{ aof: 13,  
		spanish: "Creemos en ser honrados, verídicos, castos, benevolentes, virtuosos y en hacer el bien a todos los hombres; en verdad, podemos decir que seguimos la admonición de Pablo: Todo lo creemos, todo lo esperamos; hemos sufrido muchas cosas, y esperamos poder sufrir todas las cosas. Si hay algo virtuoso, o bello, o de buena reputación, o digno de alabanza, a esto aspiramos.",
		french: "Nous croyons que nous devons être honnêtes, fidèles, chastes, bienveillants et vertueux, et que nous devons faire du bien à tous les hommes; en fait, nous pouvons dire que nous suivons l'exhortation de Paul: nous croyons tout, nous espérons tout, nous avons supporté beaucoup et nous espérons être capables de supporter tout. Nous recherchons tout ce qui est vertueux ou aimable, tout ce qui mérite l'approbation ou est digne de louange.",
		german: "Wir glauben, daß es recht ist, ehrlich, treu, keusch, gütig und tugendhaft zu sein und allen Menschen Gutes zu tun; ja, wir können sagen, daß wir der Ermahnung des Paulus folgen—wir glauben alles, wir hoffen alles, wir haben viel ertragen und hoffen, alles ertragen zu können. Wenn es etwas Tugendhaftes oder Liebenswertes gibt, wenn etwas guten Klang hat oder lobenswert ist, so trachten wir danach.",
		english: "We believe in being honest, true, chaste, benevolent, virtuous, and in doing good to all men; indeed, we may say that we follow the admonition of Paul-We believe all things, we hope all things, we have endured many things, and hope to be able to endure all things. If there is anything virtuous, lovely, or of good report or praiseworthy, we seek after these things." }
];

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
	    gaPlugin = window.plugins.gaPlugin;
	    gaPlugin.init(nativePluginResultHandler, nativePluginErrorHandler, "UA-1466312-11", 10);
		gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "App", "Begin", quiz_article);

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

		$('.language').text( 			langs[language].language_string );
		$('.language-english').text( 	langs['english'].language_native );
		$('.language-french').text( 	langs['french'].language_native );
		$('.language-spanish').text( 	langs['spanish'].language_native );
		$('.language-german').text( 	langs['german'].language_native );
		
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

		for(var i=0; i<aof.length; i++){
			aofs += "<article class='aof_" + i + "'>";
			aofs += "<dt>" + langs[language].ordinals[i] + " " + langs[language].title + "</dt>";
			aofs += "<dd>" + aof[i][language];
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
	$('.language_option').on('click touch', function(e){
		//console.log('language change:', $(this).val() );
		language = $(this).data('value');
		localStorage.language = language;
		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
		$('.content').html('');
		update_language();
		quiz_article--;
		game_aofs();
	});
	$('.list_all').on('click touch', function(e){
		list_aofs();
	});
	$('body').on('touchstart', function(){
		//touching = true;
	});
	$('body').on('touchend', function(){
		touching = false;
	});
	$('.quiz_begin').on('click touch', function(e){
		quiz_article = -1;
		game_aofs();
	});
	$('.quiz_begin_jump').on('click touch', function(e){
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
				content += langs[language].ordinals[activity_log[i].i] + ' ' + langs[language].title + ' ';
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
		if (quiz_article > 12 || quiz_article < 0 ){
			quiz_article = 0;
		}
		//var random_article = Math.floor( aof.length * Math.random() );
		var random_article_words = randomize_aof( quiz_article );
		var content = '';//<h2 class="sub-title">' + langs[language].quiz + ': ' + langs[language].ordinals[quiz_article] + ' ' + langs[language].title + '</h2>';
		content += '<dt>' + langs[language].quiz + ': ' + langs[language].ordinals[quiz_article] + " " + langs[language].title + '</dt><dd class="ordered"></dd><dd class="unordered">';

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
		if (!touching) {
		//uncomment for desktop testing
		//if (true){
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
				gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Level", "Finish", quiz_article, score);
			}
			//console.log('score :', quiz_guesses_correct / quiz_guesses_total);
		}
	});


	function randomize_aof(article){
		//console.log('randomize_aof()');
		//split article into array of words in correct order
		var article_word = aof[article][language].split(' ');
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
		gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "App", "End", quiz_article);
	    gaPlugin.exit(nativePluginResultHandler, nativePluginErrorHandler);
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