/* global $ document */

$(document).ready(function() {
  $('#tweet-text').on('input', function() {
    const characterCount = $(this).val().length;
    const counter = $(this).closest('.new-tweet').find('.counter');
    counter.text(140 - characterCount);
    if (characterCount > 140) {
      counter.css('color', 'red');
      $('.tweet-button').prop('disabled', true);
      $('.tweet-button').addClass('disabled');
    } else {
      counter.css('color', 'black');
      $('.tweet-button').prop('disabled', false);
      $('.tweet-button').removeClass('disabled');
    }
  });
});
