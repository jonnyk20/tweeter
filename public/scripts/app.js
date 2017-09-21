/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
/* eslint-disable */
$(function foo() {
  const user = {};
  const noUserIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Question_mark_white-transparent.svg/2000px-Question_mark_white-transparent.svg.png";

// get logged in user
function getUser(){
  $.ajax({
    method: "GET",
    url: "/users",
    success: function(data){
      user.name = data.name;
      user.handle = data.handle;
      user.id = data.id;
      user.avatar = data.avatar;
      $('#user').text("@"+ user.handle);
      $('.logged-in-avatar img').attr("src", (user.avatar || noUserIcon ));
      loadTweets(); 
    }
  })
}
getUser();

// getting Tweets
function loadTweets(){
    $.ajax({
    method: "GET",
    url: "/tweets",
    dataType: 'json',
    success: function(data){
      data = data.sort((a, b) => b.created_at - a.created_at);
      $('.tweets').empty();
      renderTweets(data);
    }
  })
}

  function renderTweets(tweets) {
    // loops through tweets
    tweets.forEach((tweet)=>{
    // calls createTweetElement for each tweet
    const $tweet = createTweetElement(tweet);
    // takes return value and appends it to the tweets container
    $('.tweets').append($tweet);
    })
  }

  function createTweetElement({user, content, created_at, _id, likes = 5}) {
 
    const $tweet = $('<article>').addClass('tweet').data( 'likes', likes );;
    // ...
    $tweet.html(`
        <div class="tweet-header">
          <img class="user-icon" src="${user.avatars.small}">
          <span class="name"> ${user.name} </span>
          <span class="handle"> ${user.handle} </span>
        </div>

        <div class="tweet-body">
        ${content.text}
        <hr>
        <div class="id">ID:  ${_id} </div>
        </div>

        <div class="tweet-footer">
          <span class="tweet-time"> ${created_at}</span>
          <div class="tweet-actions">
            <i class="fa fa-flag fa-lg" aria-hidden="true"></i>
            <i class="fa fa-retweet fa-lg" aria-hidden="true"></i>
          </div>
          <div class="likes">
            <span class="likeCount">${likes}</span>
            <i class="fa fa-heart fa-lg" aria-hidden="true"></i>
          </div>
        </div>
        `);
        $tweet.data('likes', likes).data('user', user.handle).data('tweetID', _id).data('liked', false);
    return $tweet;
  }



 // Creating Tweets

  $('.new-tweet form').on('submit', function (event) {
    event.preventDefault();

    // Prevent logn tweet from being submitted
    if ($('.new-tweet textarea').val().length > 140){
      $('.tweet-error').show().text('Your tweet is too long');
      return;
    } else if ($('.new-tweet textarea').val().length < 1){
      $('.tweet-error').show().text('Your tweet is too short');
      return;
    }
    
    const data = $( this ).serialize() ;
    $.ajax({
      method: "POST",
      url: "/tweets",
      data: data
    })
      .done(function( msg ) {
        $('.new-tweet textarea').val("");
        $('.new-tweet .counter').text(140);
        loadTweets(); 
      });
  });


  // Other UI Interactions
  
  // Open compose form

  $('.compose').on('click', function(){
    $('.new-tweet').slideToggle();
    $('.new-tweet textarea').focus();
  });

  // Like Tweet
  $('.tweets').on('click', '.likes .fa' ,function(e){
    const $target = $(e.target);
    const $tweet = $target.closest('.tweet');
    const likes = $tweet.data('likes');
    const tweetID = $tweet.data('tweetID');
    let liked;
    if ($tweet.data('liked') === false) {
      liked = false;
      $tweet.data('liked', true);
      $tweet.data('likes', likes + 1);
      $tweet.find('.likeCount').text( likes + 1 );
      $tweet.find('.likes').addClass('liked-tweet');
    } else {
      liked = true;
      $tweet.data('liked', false);
      $tweet.data('likes', likes - 1);
      $tweet.find('.likeCount').text( likes - 1 );
      $tweet.find('.likes').removeClass('liked-tweet');
    }
    
     $.ajax({
      method: "PUT",
      url: "/tweets/" + tweetID,
      data: {
        liked: liked
      }
    })
  });




  // user authentication
  
   // user handle preview
  $('.modal').on('input', '#handle', function bar(e) {
    $('.handle-preview').text("@" + e.target.value);
  })


  // register submit
  $('#register-modal').on('submit', '#register-form', function (event) {
    event.preventDefault();
    const data = $(this).serialize();
    console.log(data);
    let valid = true;
    $('#register-form input').each(function() {
      if(!$(this).val()){
          valid = false;
          return;
      }
    });
    if (!valid){
      alert('Some fields are empty');
      return;
    }

    $.ajax({
      method: "POST",
      url: "/users/register",
      data: data
    })
      .done(function() {
        $('#register-modal').modal('hide');
        getUser();
      })
      .fail(function( jqXHR, textStatus, errorThrown) {
        alert( "Text Status: ", errorThrown );
      });
  });


  // login
  $('#login-modal').on('submit', '#login-form', function (event) {
    event.preventDefault();
    const data = $(this).serialize();
    console.log(data);
    let valid = true;
    $('#login-form input').each(function() {
      if(!$(this).val()){
          valid = false;
          return;
      }
    });
    if (!valid){
      alert('Some fields are empty');
      return;
    }

    $.ajax({
      method: "POST",
      url: "/users/login",
      data: data
    })
      .done(function( data ) {
        console.log(data)
        $('#login-modal').modal('hide');
        getUser();
      })
      .fail(function( jqXHR, textStatus, errorThrown) {
        alert( "Text Status: ", errorThrown );
      });
  });



  // logout
  $('nav').on('click', '#logout', function bar() {
    $.ajax({
      method: "POST",
      url: "/users/logout"
    })
      .done(function(data){
        console.log("logged out ajax successful")
        getUser();
      });
  })





});
