/* global $ document */

$(document).ready(function() {
  $('#tweet-text').on('input', function() {
    const characterCount = $(this).val().length;
    const counter = $(this).closest('.new-tweet').find('.counter');
    counter.text(140 - characterCount);
    if (characterCount > 140) {
      $(counter).addClass('red-text');
      $('.tweet-button').prop('disabled', true);
      $('.tweet-button').addClass('disabled');
    } else {
      $(counter).removeClass('red-text');
      $('.tweet-button').prop('disabled', false);
      $('.tweet-button').removeClass('disabled');
    }
  });
});
