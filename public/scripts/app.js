/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
/* eslint-disable */
$(function foo() {

// Getting Tweets
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

  function createTweetElement({user, content, created_at, likes = 5}) {
 
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
        </div>

        <div class="tweet-footer">
          <span class="tweet-time"> ${created_at}</span>
          <div class="tweet-actions">
            <i class="fa fa-flag fa-lg" aria-hidden="true"></i>
            <i class="fa fa-retweet fa-lg" aria-hidden="true"></i>
          </div>
          <div class="likes">
            <span>${likes}<span>
            <i class="fa fa-heart fa-lg" aria-hidden="true"></i>
          </div>
        </div>
        `);
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
     const $tweet = $(e.target).find('.tweet');
     console.log($tweet.data())
  });

loadTweets(); 
});
