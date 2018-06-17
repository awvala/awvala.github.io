# giftastic
Use the GIPHY API to make a dynamic web page that populates with gifs of your choice.

###Link to demo:
https://awvala.github.io/giftastic/

## Technology Include
+ HTML5
+ CSS3
+ JavaScript
+ Jquery
+ Bootstrap
+ Font Awesome
+ Giphy API

## Instructions


1. Before you can make any part of our site work, you need to create an array of strings, each one related to a topic that interests you. Save it to a variable called topics.
1.  We chose animals for our theme, but you can make a list to your own liking.
1.  Your app should take the topics in this array and create buttons in your HTML.
1.  Try using a loop that appends a button for each string in the array.
1.  When the user clicks on a button, the page should grab 10 static, non-animated gif images from the GIPHY API and place them on the page.
1.  When the user clicks one of the still GIPHY images, the gif should animate. If the user clicks the gif again, it should stop playing.
1.  Under every gif, display its rating (PG, G, so on).
1.  This data is provided by the GIPHY API.
1.  Only once you get images displaying with button presses should you move on to the next step.
1. Add a form to your page takes the value from a user input box and adds it into your topics array. Then make a function call that takes each topic in the array remakes the buttons on the page

## Bonus Goals
1. Ensure your app is fully mobile responsive.
1. Allow users to request additional gifs to be added to the page.
1. Each request should ADD 10 gifs to the page, NOT overwrite the existing gifs.
1. List additional metadata (title, tags, etc) for each gif in a clean and readable format.
1. Include a 1-click download button for each gif, this should work across device types.
1. Integrate this search with additional APIs such as OMDB, or Bands in Town. Be creative and build something you are proud to showcase in your portfolio
1. Allow users to add their favorite gifs to a favorites section.
1. This should persist even when they select or add a new topic.
1.  If you are looking for a major challenge, look into making this section persist even when the page is reloaded(via localStorage or cookies).####