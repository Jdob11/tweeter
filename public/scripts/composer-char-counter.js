/* global $ document */

$(() => {
  // function to update character count with remaining characters avaialble for tweet
  $('#tweet-text').on('keyup', function() {
    // get character count
    const characterCount = $(this).val().length;
    // find associated counter element
    const counter = $(this).closest('.new-tweet').find('.counter');
    // update counter with remaining characters
    counter.text(140 - characterCount);
    // if character count exceeds max of 140, turn counter red and disable tweet button
    if (characterCount > 140) {
      $(counter).addClass('red-text');
      // $('.tweet-button').prop('disabled', true);
      // $('.tweet-button').addClass('disabled');
    } else {
      // if character count comes back below max of 140, reset counter to black and reenable tweet button
      $(counter).removeClass('red-text');
      // $('.tweet-button').prop('disabled', false);
      // $('.tweet-button').removeClass('disabled');
    }
  });
});
