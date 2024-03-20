/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
/* global $ */

$(() => {  
  const createTweetElement = (tweet) => {
    const { user, content, created_at: createdAt } = tweet;
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
      
      $avatarContainer.append($avatarImage, $tweetUser);
      $header.append($avatarContainer, $handle);
      $footer.append($timeSinceTweet, $tweetIcons);
      $tweet.append($header, $tweetContent, $footer);
      
      return $tweet;
    };

    const renderTweets = (tweets) => {
      const $tweetContainer = $('.tweet-container');
      const tweetArray = tweets.reverse().map(createTweetElement);
      $tweetContainer.prepend(tweetArray);
      return $tweetContainer;
    };

    const loadTweets = function () {
      $.ajax({
        method: 'GET',
        url: '/tweets'
      })
      .then(function (tweets) {
        renderTweets(tweets)
      })
      .fail(function (error) {
        console.error("Error loading tweets:", error);
      });
    };
  
    loadTweets();
  
    $('#tweet-form').on('submit', function(event) {
      event.preventDefault();
      submitTweet();
    });
  
    $('#tweet-text').on('keypress', function(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        submitTweet();
      }
    });
  
    $('.tweet-button').on('click', function() {
      submitTweet();
    });
  
    function submitTweet() {
      const serializedData = $('#tweet-form').serialize();
      $.ajax({
        method: 'POST',
        url: '/tweets',
        data: serializedData
      })
      .done(function() {
        $('#tweet-form')[0].reset();
        $('.tweet-container article').remove();
        loadTweets();
        $('#tweet-text').closest('.new-tweet').find('.counter').text(140);
        $('#tweet-text').removeClass('red-text');
        $('.tweet-button').prop('disabled', false).removeClass('disabled');
      })
      .fail(function(error) {
        console.error("Error submitting tweet:", error);
      });
    }
  });