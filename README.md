# COVID-19 Information Berlin

## [Current deployed version](https://covid19info-berlin.herokuapp.com/)

#### My goal in creating this app was to make something relevant and useful for the current situation in Berlin. The main feature is a map search which can be used to find information on places in Berlin and whether they might be open or not.

## Key Features

  * Home page shows current statistics on cases of COVID-19 cases and deaths in Berlin, making an API call to get information from Robert Koch Institut
  * Map page allows user to search for any place in Berlin to get information on whether it is open or not
  * User also has the option to look for nearby places which are open. The type of place shown on the map is randomized every time the user clicks the button
  * Displays markers and info windows on the map with dynamic content on each place
  * Info window content depends on information returned by Google Places API combined with official information from the Fourth Ordinance amending the SARS-CoV-2 Containment Measures 
  * Deployed to Heroku using Docker
  
  
 ## Technologies
 
   * JavaScript
   * HTML/CSS
   * Node (Express)
   * Vue CLI 3
   * Google APIs (Maps, Places, Geolocation)
   * Docker

![app gif](https://github.com/lukeg90/spiced-final-project/blob/master/frontend/public/covid-berlin.gif)
