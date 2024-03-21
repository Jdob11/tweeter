/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
/* global $ */

$(() => {
  // function to create 
  const createTweetElement = (tweet) => {
    // destructuring tweet object
    const { user, content, created_at: createdAt } = tweet;
    // creating individual elements with necessary classes and text
    const $tweet = $('<article>').addClass('tweet').addClass('tweet-border');
    const $header = $('<header>');
    const $avatarContainer = $('<div>').addClass('avatar-container');
    const $avatarImage = $('<img>').addClass('avatar').attr('src', user.avatars).attr('alt', 'user avatar');
    const $tweetUser = $('<p>').addClass('tweet-user').append($('<p>').text(user.name));
    const $handle = $('<div>').addClass('handle').append($('<p>').text(user.handle));
    const $tweetContent = $('<div>').addClass('tweet-content').append($('<p>').text(content.text));
    const $footer = $('<footer>');
    const $timeSinceTweet = $('<div>').addClass('time-since-tweet').append($('<p>').text(timeago.format(createdAt)));
    const $tweetIcons = $('<div>').addClass('tweet-icons').append(
      $('<i>').addClass('fa-solid fa-flag'),
      $('<i>').addClass('fa-solid fa-retweet'),
      $('<i>').addClass('fa-solid fa-heart'),
    );
      
    // appending elements into appropriate containers for formatting
    $avatarContainer.append($avatarImage, $tweetUser);
    $header.append($avatarContainer, $handle);
    $footer.append($timeSinceTweet, $tweetIcons);

    // appending containers to create complete tweet element
    $tweet.append($header, $tweetContent, $footer);
      
    return $tweet;
  };

  // function to create multiple tweet elements and prepend them to tweet container
  const renderTweets = (tweets) => {
    const $tweetContainer = $('.tweet-container');
    const tweetArray = tweets.reverse().map(createTweetElement);
    $tweetContainer.prepend(tweetArray);
    return;
  };

  // function to load tweets from server
  const loadTweets = function() {
    // AJAX GET request to retrieve tweets
    $.ajax({
      method: 'GET',
      url: '/tweets'
    })
      // if successful, render the tweets
      .then((tweets) => {
        renderTweets(tweets);
      })
      // if unsuccessful, prepend error message to tweet container and console for debugging
      .fail(function(xhr, textStatus, errorThrown) {
        const $errorMessage = $('<div>').addClass('error-message').text('Tweets failed to load. Please try again later');
        $('.tweet-container').prepend($errorMessage);
        console.error("Error loading tweets:", errorThrown);
      });
  };
  
  loadTweets();
  
  // event listener to prevent default submit action and run submit tweet function
  $('#tweet-form').on('submit', function(event) {
    event.preventDefault();
    submitTweet();
  });
  
  // event listener to prevent default use of enter key to line down in text area and allow user to submit tweet with enter key (and line down with shift + enter)
  $('#tweet-text').on('keypress', function(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      submitTweet();
    }
  });
  
  // event listener to prevent default action of tweet button and run submit tweet function
  $('.tweet-button').on('click', function(event) {
    event.preventDefault();
    submitTweet();
  });
  
  //function to prepend new tweet to existing tweets
  const prependNewTweet = function() {
      // get the new tweet and prepend it to the existing tweets
  $.ajax({
    method: 'GET',
    url: '/tweets'
  })
    .done(function(tweets) {
      const newTweet = tweets[tweets.length - 1]; // Assuming the new tweet is the first one returned
      const $newTweetElement = createTweetElement(newTweet);
      $('.tweet-container').prepend($newTweetElement);
    })
    .fail(function(xhr, textStatus, errorThrown) {
      console.error("Error loading new tweet:", errorThrown);
    });
  };

  // function for tweet submission
  const submitTweet = function() {
    // disable tweet button to prevent multiple submissions
    $('.tweet-button').prop('disabled', true).addClass('disabled');
    // validate that text area is not empty, and prepend error message if it is
    const tweetText = $('#tweet-text').val().trim();
    if (tweetText === '') {
      const $errorMessage = $('<div>').addClass('error-message').text('Tweet text cannot be empty');
      $('.tweet-container').prepend($errorMessage);
      // remove error message and reactivate tweet button after delay
      setTimeout(function() {
        $errorMessage.fadeOut('slow', function() {
          $(this).remove();
          $('.tweet-button').prop('disabled', false).removeClass('disabled');
        });
      }, 1000);
      return;
    }
    // serialize data for submission
    const serializedData = $('#tweet-form').serialize();
    // submit with AJAX POST request 
    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: serializedData
    })
      // if successful, reset form, empty tweet container, load tweets, reset counter and reenable tweet button
      .done(() => {
        prependNewTweet();
        $('#tweet-form')[0].reset();
        // $('.tweet-container article').remove();
        // loadTweets();
        $('#tweet-text').closest('.new-tweet').find('.counter').text(140);
        $('#tweet-text').removeClass('red-text');
        $('.tweet-button').prop('disabled', false).removeClass('disabled');
      })
      // if unsuccessful, log error for debugging
      .fail((error) => {
        console.error("Error submitting tweet:", error);
      })
      // always reenable button after submission attempt
      .always(() => {
        $('.tweet-button').prop('disabled', false).removeClass('disabled');
      });
  };
});