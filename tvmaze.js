"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $episodesList = $('#episodes-list');
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
  return res.data;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  for (let obj of shows) {
    let show = obj.show;
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image ? show.image.original : 'https://tinyurl.com/tv-missing'}" 
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-primary btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

// event listener for the episodes buttons
$showsList.on("click", async function (evt) {
  // checks if a button was clicked
  if(evt.target.localName !== 'button')
    return null;
  
  // if it was, get the episodes for that show and display them
  await getEpisodesAndDisplay($(evt.target).closest('div[data-show-id]').attr('data-show-id'))
})

// called by the button event handler; gets the episodes of the show and lists them after enabling the episodesArea section
async function getEpisodesAndDisplay(id) {
  const episodes = await getEpisodesOfShow(id);
  $episodesArea.show();
  populateEpisodes(episodes);
}

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return res.data;
}

// populate the list of episodes
function populateEpisodes(episodes) { 
  $episodesList.empty();
  for (let episode of episodes) {
    console.log(episode);
    const $episode = $(`<li>${episode.name} (season ${episode.season}, episode ${episode.number})</li>`);
    $episodesList.append($episode);
  }
}
