/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(function foo() {
  const currentUser = {};
  const noUserIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Question_mark_white-transparent.svg/2000px-Question_mark_white-transparent.svg.png';


  // ////////////////////////////////////////////////////////////
  //                    Getting Tweets
  // //////////////////////////////////////////////////////////

  function howLongAgo(whenTheyTweeted){
    const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    const tweetDate = new Date(whenTheyTweeted);
    const todaysDate = new Date(Date.now());
    const diffDays = Math.round(Math.abs((tweetDate.getTime() - todaysDate.getTime())/(oneDay)));
    return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays === 1? '': 's'} ago`;
  }
  

  function createTweetElement({user, content, created_at, _id, likes, likedBy}) {
    const $tweet = $('<article>').addClass('tweet').data( 'likes', likes );
    // ...
    $tweet.html(`
        <div class='tweet-header'>
          <img class='user-icon' src='${user.avatars.small}'>
          <span class='name'> ${user.name} </span>
          <span class='handle'> ${user.handle[0] === '@'? user.handle : '@' + user.handle} </span>
        </div>

        <div class='tweet-body'>
        ${content.text}
        </div>

        <div class='tweet-footer'>
          <span class='tweet-time'> ${howLongAgo(created_at)}</span>
          <div class='tweet-actions'>
            <i class='fa fa-flag fa-lg' aria-hidden='true'></i>
            <i class='fa fa-retweet fa-lg' aria-hidden='true'></i>
          </div>
          <div class='likes'>
            <span class='likeCount'>${likes}</span>
            <i class='fa fa-heart fa-lg' aria-hidden='true'></i>
          </div>
        </div>
        `);

        $tweet.data('likes', likes).data('user', user.handle).data('tweetID', _id).data('liked', false);
        if (likedBy.includes(currentUser.id)){
          $tweet.data('liked', true);
          $tweet.find('.likes').addClass('liked-tweet');
        }

    return $tweet;
  }


  function renderTweets(tweets) {
    // loops through tweets
    tweets.forEach((tweet) => {
      // calls createTweetElement for each tweet
      const $tweet = createTweetElement(tweet);
      // takes return value and appends it to the tweets container
      $('.tweets').append($tweet);
    });
  }

  function loadTweets() {
    $.ajax({
      method: 'GET',
      url: '/tweets',
      dataType: 'json',
      success: function (tweetsData) {
        const tweetsToRender = tweetsData.sort((a, b) => b.created_at - a.created_at);
        $('.tweets').empty();
        renderTweets(tweetsToRender);
      },
    });
  }

   ////////////////////////////////////////////////////////////
  //*********       Creating New Tweet          *********  ///
 ////////////////////////////////////////////////////////////

  $('.new-tweet form').on('submit', function (event) {
    event.preventDefault();
    if (!currentUser.handle){
      return;
    }

    // Prevent logn tweet from being submitted
    if ($('.new-tweet textarea').val().length > 140){
      $('.tweet-error').show().text('Your tweet is too long');
      return;
    } else if ($('.new-tweet textarea').val().length < 1){
      $('.tweet-error').show().text('You have not written anything');
      return;
    }
    
    const tweetText = $('.new-tweet textarea').val();
    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: { text: tweetText,
              user: currentUser,
      },
    })
      .done(function( msg ) {
        $('.new-tweet textarea').val('');
        $('.new-tweet .counter').text(140);
        loadTweets(); 
      });
  });


   ////////////////////////////////////////////////////////////
  //*********       User Athentication        *********    ///
 //////////////////////////////////////////////////////////// 

 // get active user

  function getUser(){
    $.ajax({
      method: 'GET',
      url: '/users',
      success: function(userData){
        currentUser.name = userData.name;
        currentUser.handle = userData.handle;
        currentUser.id = userData.uid;
        currentUser.avatars = { small: userData.avatar };
        $('#user').text('@'+ currentUser.handle);
        $('.logged-in-avatar img').attr('src', (currentUser.avatars.small || noUserIcon ));
        if (currentUser.handle){
          $('.compose button').show();
          $('.logged-in-info').show();
          $('.logged-out-info').hide();
        } else {
          $('.compose button, .new-tweet').hide();
          $('.logged-in-info').hide();
          $('.logged-out-info').show();
        }
        $('.auth').show();
        loadTweets(); 
      },
    });
  }
getUser();

  // ruser registration

  $('#register-modal').on('submit', '#register-form', function (event) {
    event.preventDefault();
    const data = $(this).serialize();
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
      method: 'POST',
      url: '/users/register',
      data: data,
    })
      .done(function() {
        $('#register-modal').modal('hide');
        getUser();
      })
      .fail(function( jqXHR, textStatus, errorThrown) {
        alert( 'Text Status: ', errorThrown );
      });
  });

     // user handle preview

     $('.modal').on('input', '#handle', function bar(e) {
      $('.handle-preview').text('@' + e.target.value);
    });


  // user login
  $('#login-modal').on('submit', '#login-form', function (event) {
    event.preventDefault();
    const data = $(this).serialize();
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
      method: 'POST',
      url: '/users/login',
      data: data,
    })
      .done(function( data ) {
        $('#login-modal').modal('hide');
        getUser();
      })
      .fail(function( jqXHR, textStatus, errorThrown) {
        alert( 'Invalid Login' );
      });
  });


  // user logout
  $('nav').on('click', '#logout', function bar() {
    $.ajax({
      method: 'POST',
      url: '/users/logout',
    })
      .done(function(data){
        getUser();
      });
  });

    /////////////////////////////////////////////////////////////
  //*********       Other UI Interactions       *********  ///
  /////////////////////////////////////////////////////////// 
  
  
  // open or clsoe compose form

  $('.compose').on('click', function(){
    if (!currentUser.handle){
      return;
    }
    $('.new-tweet').slideToggle();
    $('.new-tweet textarea').focus();
  });

  // Like Tweet
  $('.tweets').on('click', '.likes .fa' ,function(e){
    const $target = $(e.target);
    const $tweet = $target.closest('.tweet');
    const likes = $tweet.data('likes');
    const tweetID = $tweet.data('tweetID');
    let alreadyLiked;
    if (currentUser.handle === $tweet.data('user') || !currentUser.handle)
      {
        return;
      }
    if ($tweet.data('liked') === false) {
      alreadyLiked = false;
      $tweet.data('liked', true);
      $tweet.data('likes', likes + 1);
      $tweet.find('.likeCount').text( likes + 1 );
      $tweet.find('.likes').addClass('liked-tweet');
    } else {
      alreadyLiked = true;
      $tweet.data('liked', false);
      $tweet.data('likes', likes - 1);
      $tweet.find('.likeCount').text( likes - 1 );
      $tweet.find('.likes').removeClass('liked-tweet');
    }
    
     $.ajax({
      method: 'PUT',
      url: '/tweets/' + tweetID,
      data: {
        alreadyLiked,
        liker: currentUser.id,
      },
    });
  });
});
