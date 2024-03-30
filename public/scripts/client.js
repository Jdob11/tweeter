/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
/* global $, loadTweets, submitTweet, window */


$(() => {
  loadTweets();
  
  // event listener to prevent default submit action and run submit tweet function
  $('#tweet-form').on('submit', submitTweet);
  
  // event listener to prevent default use of enter key to line down in text area and allow user to submit tweet with enter key (and line down with shift + enter)
  $('#tweet-text').on('keypress', submitWithEnter);
  
  // event listener to prevent default action of tweet button and run submit tweet function
  $('.tweet-button').on('click', submitTweet);

  // event listener to reveal new tweet section when nav link is clicked, focus cursor in text area, and rehide new tweet section if clicked again
  $('.nav-links').on('click', '.nav-link, .fa-angles-down', toggleNewTweet);

  // event listener to hide nav link and reveal scroll up button when user has scrolled past 500px, to reverse if user scrolls back above 500px
  $(window).on('scroll', handleScroll);
  
  // event listener to scroll to the top, reveal the new tweet section and focus the cursor in the text area when scroll up button is clicked
  $('.scroll-up-button').on('click', scrollUpAnimation);
});