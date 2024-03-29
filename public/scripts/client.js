/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
/* global $, loadTweets, submitTweet, window */


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

  // event listener to reveal new tweet section when nav link is clicked, focus cursor in text area, and rehide new tweet section if clicked again
  $('.nav-links').on('click', '.nav-link, .fa-angles-down', function(event) {
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
  });

  // create flag for if scroll up animation is running
  let isScrollingUp = false;
  
  // event listener to hide nav link and reveal scroll up button when user has scrolled past 500px, to reverse if user scrolls back above 500px
  $(window).on('scroll', function() {
    if (!isScrollingUp) {
      let scrollTop = $(this).scrollTop();
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
  });
  
  // event listener to scroll to the top, reveal the new tweet section and focus the cursor in the text area when scroll up button is clicked
  $('.scroll-up-button').on('click', function() {
    // set the flag to true to indicate that scroll-up animation is in progress
    isScrollingUp = true;
  
    // temporarily unbind the scroll event handler
    $(window).off('scroll');
  
    $('html, body').animate({ scrollTop: 0 }, 'slow', function() {
      // after scroll-up animation completes, reset the flag
      isScrollingUp = false;
  
      // after scroll-up animation completes, show new tweet section and focus in text area
      $('.new-tweet').slideDown('slow', function() {
        $(this).find('textarea').focus();
  
        // rebind the scroll event handler after scroll-up animation completes
        $(window).on('scroll', function() {
          let scrollTop = $(this).scrollTop();
          if (scrollTop < 510 && !isScrollingUp) {
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
        });
      });
    });
  });
});