/* global $, timeago, window*/
/* eslint-disable no-unused-vars*/

// function to create tweet element
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

//function to prepend new tweet to existing tweets
const prependNewTweet = function() {
  // get the new tweet and prepend it to the existing tweets
  $.ajax({
    method: 'GET',
    url: '/tweets'
  })
    .done(function(tweets) {
      const newTweet = tweets[tweets.length - 1];
      const $newTweetElement = createTweetElement(newTweet);
      $('.tweet-container').prepend($newTweetElement);
    })
    .fail(function(xhr, textStatus, errorThrown) {
      console.error("Error loading new tweet:", errorThrown);
    });
};

// function to reveal error message
const showError = function() {
  $('.error-message').slideDown('slow');
};

// function to hide error message
const hideError = function() {
  return new Promise((resolve) => {
    // slide up error message if it's currently visible
    if ($('.error-message').is(':visible')) {
      $('.error-message').slideUp('slow', resolve);
    } else {
      // if error message is already hidden, resolve immediately
      resolve();
    }
  });
};

// function for tweet submission
const submitTweet = function() {
  // disable tweet button to prevent multiple submissions
  $('.tweet-button').prop('disabled', true).addClass('disabled');
  
  // validate that text area is not empty
  const tweetText = $('#tweet-text').val().trim();
  if (tweetText === '' || tweetText === null) {
    hideError().then(() => {
      $('.error-message').text('Tweet text cannot be empty');
      showError();
      // reenable tweet button after 3-second timeout
      setTimeout(() => {
        $('.tweet-button').prop('disabled', false).removeClass('disabled');
      }, 1000);
    });
    return;
  }
  
  // validate that tweet text length is within limit
  if (tweetText.length > 140) {
    hideError().then(() => {
      $('.error-message').text('Tweets cannot exceed 140 characters');
      showError();
      // reenable tweet button after 3-second timeout
      setTimeout(() => {
        $('.tweet-button').prop('disabled', false).removeClass('disabled');
      }, 1000);
    });
    return;
  }
  
  // // if input is valid hide error message
  hideError();
  // serialize data for submission
  const serializedData = $('#tweet-form').serialize();
  // submit with AJAX POST request
  $.ajax({
    method: 'POST',
    url: '/tweets',
    data: serializedData
  })
    // if successful prepend new tweet to existing tweet container, reset form, reset counter and reenable tweet button
    .done(() => {
      prependNewTweet();
      $('#tweet-form')[0].reset();
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

// function to toggle new tweet text area
const toggleNewTweet = function(event) {
  event.preventDefault();
  if ($('.new-tweet').first().is(':hidden')) {
    $('.new-tweet').slideDown('slow', function() {
      $(this).find('textarea').focus();
    });
    $('.tweet-container').removeClass('desktop-margin');
  } else {
    $('.new-tweet').slideUp('slow', function() {
    });
    $('.tweet-container').addClass('desktop-margin');
  }
};

// create flag for if scroll up animation is running
let isScrollingUp = false;

// function to animate scroll to top of page on scroll button click, and unbind and rebind scroll event handler to prevent repeated animation during scroll up
const scrollUpAnimation = function() {
  // set the flag to true to indicate that scroll-up animation is in progress
  isScrollingUp = true;

  // temporarily unbind the scroll event handler
  $(window).off('scroll');

  $('html, body').animate({ scrollTop: 0 }, 'slow', function() {
    // after scroll-up animation completes, reset the flag
    isScrollingUp = false;
    $('.tweet-container').removeClass('desktop-fullscreen');
    $('.user-header').removeClass('hidden');

    // after scroll-up animation completes, show new tweet section and focus in text area
    $('.new-tweet').slideDown('slow', function() {
      $(this).find('textarea').focus();

      // rebind the scroll event handler after scroll-up animation completes
      $(window).on('scroll', handleScroll);
    });
  });
};

const handleScroll = function() {
  if (!isScrollingUp) {
    let scrollTop = $(window).scrollTop();
    if (scrollTop < 510) {
      $('.scroll-up-button').slideUp('fast');
      $('.nav-links').slideDown('fast');
      $('.tweet-container').removeClass('desktop-fullscreen');
      $('.user-header').removeClass('hidden');
    } else {
      $('.scroll-up-button').slideDown('fast');
      $('.nav-links').slideUp('fast');
      $('.tweet-container').addClass('desktop-fullscreen');
      $('.user-header').addClass('hidden');
    }
  }
};

const submitWithEnter = function(event) {
  if (event.keyCode === 13 && !event.shiftKey) {
    event.preventDefault();
    submitTweet();
  }
};