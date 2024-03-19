/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(() => {
  const data = [
    {
      "user": {
        "name": "Newton",
        "avatars": "https://i.imgur.com/73hZDYK.png"
        ,
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": "https://i.imgur.com/nlhLi3I.png",
        "handle": "@rd" },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    }
  ]

const renderTweets = (tweets) => {
  const tweetArray = [];
  const $tweetContainer = $('.tweet-container');
  for (let tweet of tweets) {
    tweet = createTweetElement(tweet);
    tweetArray.push(tweet);
  }
  $tweetContainer.append(tweetArray);
  return $tweetContainer
}

const createTweetElement = (tweet) => {
  const { user, content, created_at } = tweet;
  const $tweet = $('<article>').addClass('tweet').addClass('tweet-border');
  const $header = $('<header>');
  const $avatarContainer = $('<div>').addClass('avatar-container');
  const $avatarImage = $('<img>').addClass('avatar').attr('src', user.avatars).attr('alt', 'user avatar');
  const $tweetUser = $('<p>').addClass('tweet-user').append($('<p>').text(user.name));
  const $handle = $('<div>').addClass('handle').append($('<p>').text(user.handle));
  const $tweetContent = $('<div>').addClass('tweet-content').append($('<p>').text(content.text));
  const $footer = $('<footer>');
  const $timeSinceTweet = $('<div>').addClass('time-since-tweet').append($('<p>').text(created_at));
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

renderTweets(data);
});