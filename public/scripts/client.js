/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
/* global $, loadTweets, submitTweet */


$(() => {
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

  $('.nav-links').on('click', '.nav-link, .fa-angles-down', function(event) {
    event.preventDefault();
    if ( $('.new-tweet').first().is(':hidden')) {
      $('.new-tweet').slideDown('slow', function() {
        $(this).find('textarea').focus();
      })
    } else {
      $('.new-tweet').slideUp('slow')
    }
  });

  $(window).on('scroll', function() {
    if ($(this).scrollTop() === 0) {
      $('.scroll-up-button').slideUp('fast');
      $('.nav-links').slideDown('fast');
    } else {
      $('.scroll-up-button').slideDown('fast');
      $('.nav-links').slideUp('fast');
    }
  })

  $('.scroll-up-button').on('click', function() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
  });
});