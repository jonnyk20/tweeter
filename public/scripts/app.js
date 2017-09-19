/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
/* eslint-disable */
$(function foo() {


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

  function createTweetElement({user, content, created_at}) {
 
    const $tweet = $('<article>').addClass('tweet');
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
            <i class="fa fa-flag" aria-hidden="true"></i>
            <i class="fa fa-retweet" aria-hidden="true"></i>
            <i class="fa fa-heart" aria-hidden="true"></i>
          </div>
        </div>
        `);
    return $tweet;
  }


 // new tweet logic 

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


  $('.compose').on('click', function(){
    $('.new-tweet').slideToggle();
    $('.new-tweet textarea').focus();
  });




loadTweets(); 
});
