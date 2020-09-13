
// function to center elements.
jQuery.fn.center = function (value) {
  this.css("position","absolute");
  this.css("top", Math.max(0, (($(value).height() - $(this).outerHeight()) / 2) +
  $(value).scrollTop()) + "px");
  this.css("left", Math.max(0, (($(value).width() - $(this).outerWidth()) / 2) +
  $(value).scrollLeft()) + "px");
  return this;
}


$(document).ready(function(){

  $("audio").prop('muted', true); // audio is mute by default

  //toggle audio & audio icon
  $("#audio_img").click( function (){
    if( $("audio").prop('muted') ) {
      $("audio").prop('muted', false);
      $("#audio_img > img").attr("src","images/playAudio.png");
    } else {
      $("audio").prop('muted', true);
      $("#audio_img > img").attr("src","images/muteAudio.png");
    }
  });



  var gameStoped = false;
  var life = 3;
  var score = 0;
  var highScore = 0;

  var hour = 0;
  var minute = 0;
  var second = 0;

  $("#life").append("<p>"+life+"</p>");
  $("#score").append("<p>"+score+"</p>");

  $(".container").center(window);

  $(window).on('resize', function() {
    $(".container").center(window);
  });



  $("#startGame").center("#box");
  $("#startGame").hover(
    function(){$(this).css("opacity","0.8")},
    function(){$(this).css("opacity","1")}
  );


  // start game when #startGame clicked
  $("#startGame").click(function(){
    startGame();
  });

  //====================== Start function start game ====================

  function startGame(){

    life = 3;
    score = 0;

    hour = 0;
    minute = 0;
    second = 0;

    var hourVal = hour;
    var minuteVal = minute;
    var secondVal = second;

    gameStoped = false;

    $("#life p").remove();
    $("#life").append("<p>"+life+"</p>");

    $("#score p").remove();
    $("#score").append("<p>"+score+"</p>");


    // interval of time counter increase each second
    var counterInterval = setInterval(function() {

      if(gameStoped == false){
        second++;
        if(second == 60){
          second = 0;
          minute++;
        }
        if(minute == 60){
          minute=0;
          hour++;
        }

      }else{
        clearInterval(counterInterval);
      }

      // if time is less than 10 add '0' before the number
      second < 10 ? secondVal = '0' + second : secondVal = second;
      minute < 10 ? minuteVal = '0' + minute : minuteVal = minute;
      hour < 10 ? hourVal = '0' + hour : hourVal = hour;

      // append the new time value
      $("#countUp").empty();
      $("#countUp").append(hourVal+':'+minuteVal+':'+secondVal);

    }, 1000);


    $("#startGame").hide();

    $("#box").html("<img id='player' src='images/basket.png' >");

    $("#player").css({"width":"100px","height":"100px",
    "position":"absolute", "bottom": "0","margin-bottom":"10px"});


    $("#player").css("left", Math.max(0, (($("#box").width() - $("#player").outerWidth()) / 2) +
    $("#box").scrollLeft()) + "px");



    //====================== Moving Player horizontally by left and right arrow  =================

    //from  https://stackoverflow.com/questions/4950575/how-to-move-a-div-with-arrow-keys
    var box = $('#box'),
    player = $('#player'),
    maxValue = box.width() - player.width(),
    keysPressed = {},
    distancePerIteration = 5;

    function calculateNewValue(oldValue, keyCode1, keyCode2) {
      var newValue = parseInt(oldValue, 10)
      - (keysPressed[keyCode1] ? distancePerIteration : 0)
      + (keysPressed[keyCode2] ? distancePerIteration : 0);
      return newValue < 0 ? 0 : newValue > maxValue ? maxValue : newValue;
    }

    $(window).keydown(function(event) { keysPressed[event.which] = true; });
    $(window).keyup(function(event) { keysPressed[event.which] = false; });

    setInterval(function() {
      player.css({
        left: function(index ,oldValue) {
          return calculateNewValue(oldValue, 37, 39);
        }
      });

    }, distancePerIteration);

    //====================== End Moving Player horizontally by left and right arrow ==============



    // increase ball speed by 10 until 500 millisecond each 2 seconds
    durationVal = 1000;

    var myInt = setInterval(function() {

      if(durationVal > 500){
        durationVal = durationVal - 10;
      }else{
        clearInterval(myInt);
      }

    },2000);


    //============= Auto-Execute Function For Animating Balls And Count Score & Life =======

    (function drawBall(){

      // random value between 550-900
      // it will be the duration before appending new ball
      var rand = Math.round(Math.random() * (900)) + 550;


      setTimeout(function() {

        //appending new ball
        $("#box").append("<div class='ball'><img  src='images/basketball.png' width='70px'></div>");

        $(".ball").last().css({"position":"absolute","left":"0", "top": "0","width":"70px","height":"70px"});


        // max x & y to animate ball inside box
        var mx = $("#box").width() - $(".ball").last().width();
        var my = $("#box").height() - $(".ball").last().height();


        //random value between 1 & mx (max x)
        // to append the ball from diffrent position each time
        var randomWidth = 1 + Math.floor(Math.random() * mx);

        $(".ball").last().css({left: randomWidth})


        // make the ball stop at #player top
        var maxTop = my - $("#player").height();

        // start animating the ball
        $(".ball").last().animate({top: maxTop},{
          duration : durationVal,
          easing:'linear',
          step : function( heightPerc ) {

            if(heightPerc == maxTop){ //when the ball reach its last point

              // the current right point of the player
              var playerRight= $("#player").position().left + $("#player").width();
              // the current left point of the player
              var playerLeft = $("#player").position().left;


              // the current right point of the ball
              var ballRight = $(this).position().left + $(this).width();
              // the current left point of the ball
              var ballLeft = $(this).position().left;


              // if any part of the ball set in the top of player then incriment score
              if( ballRight  >= playerLeft && ballLeft <= playerRight){

                score++;

                $(this).remove(); //remove current ball immediately

                $("#score > p").empty();
                $("#score > p").append(score);

                // set score audio
                $("audio").attr({
                  'src':'audio/swish.mp3',
                  'volume':0.4,
                  'autoplay':'autoplay'
                }).appendTo("body");

              }else{ // when lose a ball decrese life

                if(life > 0){

                  life--;

                  $("#life > p").empty();
                  $("#life > p").append(life);

                  $("audio").attr({
                    'src':'audio/wrong_audio.mp3',
                    'volume':0.4,
                    'autoplay':'autoplay'
                  }).appendTo("body");

                  // replace ball image with wrong image
                  $(this).html("<img src='images/wrong_mark.png' width='70px'>" );

                  // remove current ball after second
                  setTimeout(()=>{
                    $(this).remove();
                  },1000);

                }
              }
            }

            // stop the last ball animation when (life = 0) before reaching its max top
            life == 0 ? $(this).stop() : life;


            // rotate the ball 90deg at the same time when falling down
          }}).animate({deg:90},{duration: durationVal, queue: false,
            step: function(now) {

              $(this).css({ transform: 'rotate(' + now + 'deg)' });

              // stop the last ball animation when (life = 0) before reaching its max top
              life == 0 ? $(this).stop() : life;

            }});

            if(life == 0){

              //set the high score
              if(score > highScore){
                highScore = score;
              }

              $("#highScore > span").empty();
              $("#highScore > span").append(highScore);


              //stop the player movement when the game over
              $(window).keydown(function(event) { keysPressed[event.which] = false; });
              $(window).keyup(function(event) { keysPressed[event.which] = false; });

              stopGame();

            }else{

              drawBall();

            }

          }, rand);

        }())

        //============== End Auto-Execute Function For Animating Balls And Count Score & Life ========

      }

      //====================== End Function start game =================

      //====================== Start Function stop game =================

      function stopGame(){

        gameStoped = true;

        $("#box").append("<div id='opacityBox'></div>");
        $("#box").append("<div id='gameOver'></div>");

        $("audio").attr({
          'src':'audio/gameOver_audio.mp3',
          'volume':0.4,
          'autoplay':'autoplay'
        }).appendTo("body");

        var gameOverWidth = $("#box").innerWidth();
        var opacityBoxHeight = $("#box").innerHeight();
        var gameOverTop = $("#box").width();

        $("#gameOver").css({"width":gameOverWidth+"px", "height":"200px",
        "background-color":"rgba(255,0,0,0.8)","position":"absolute"});

        $("#opacityBox").css({"width":gameOverWidth+"px", "height":opacityBoxHeight+"px",
        "background-color":"#fff","opacity":"0.5"});

        $("#gameOver").center("#opacityBox");
        $("#opacityBox").center("#box");

        $("#gameOver").append("<p>Game Over</p>");

        $("#gameOver > p").css({"text-align":"center","font-size":"50px","margin":"10px",
        "color":"#fff","font-weight":"bold"});


        $("#gameOver").append("<img src='images/replay_btn.png' width='100'/>");

        $("#gameOver > img").css({"display":"block", "margin-left":"auto","margin-right":"auto"});

        $("#gameOver > img").hover(
          function(){$(this).css("opacity","0.9")},
          function(){$(this).css("opacity","1")}
        );

        $("#gameOver > img").click(function(){
          $(".ball").remove();
          $("#gameOver").remove();
          $("#opacityBox").remove();

          //when the game restart before the audio ends
          $('audio').each(function(){
            this.pause(); // Stop playing
            this.currentTime = 0; // Reset time
          });

          startGame();
        });

      }

      //====================== End Function stop game =================


    });
