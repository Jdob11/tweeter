/* global $ */

$(() => {
  // function to update character count with remaining characters available for tweet
  $('#tweet-text').on('keyup', function() {
    // get character count
    const characterCount = $(this).val().length;
    // find associated counter element
    const counter = $(this).closest('.new-tweet').find('.counter');
    // update counter with remaining characters
    counter.text(140 - characterCount);
    // if character count exceeds max of 140, turn counter red
    if (characterCount > 140) {
      $(counter).addClass('red-text');
    } else {
      // if character count comes back below max of 140, reset counter to black
      $(counter).removeClass('red-text');
    }
  });
});
