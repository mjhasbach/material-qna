# material-qna

Material QnA is a question and answer platform designed using Google's [Material](https://www.google.com/design/spec/what-is-material) specification. Check out the [demo](http://material-qna.hasba.ch/).

### Features

Questions have one or more answers and may have a correct answer, have an image, or be disabled. After registering or logging in, enabled, unanswered question images are fetched and displayed in a Pinterest-style [masonry grid](http://www.sitepoint.com/understanding-masonry-layout/) until there is no visible whitespace below the last image in each column or no eligible questions remain. More images are downloaded, if needed, upon answering a question, scrolling, resizing the window, or returning to the grid after visiting the dashboard. If a question has no image, one is generated with pseudo-random dimensions, a pseudo-random background color based on the [golden ratio](https://en.wikipedia.org/wiki/Golden_ratio), and a [complementary](https://en.wikipedia.org/wiki/Complementary_colors) text color. Clicking a question image opens a dialog in which a user may answer the question, and afterwards the user is given feedback. Answered questions are removed from the grid after closing the dialog.

The dashboard is divided into the following sections:

- Account
    - Change your username or password
- Users
    - Search for users and edit / delete them individually or in bulk
- QnA
    - Add questions one at a time or in bulk via JSON upload
    - Search for questions and edit / delete them individually or in bulk
    - Search for question images (powered by the [Google Image Search API](https://developers.google.com/image-search/v1/jsondevguide))
- History
    - Search for answered questions and delete them them individually or in bulk

### Installation

1. Download and install [Node.js](https://nodejs.org/en/download/), if needed
2. Download Material QnA via `git`:
    - `git clone https://github.com/mjhasbach/material-qna.git`
3. Enter the Material QnA project directory:
    - `cd material-qna`
4. Download the dependencies and build the UI bundle:
    - `npm install`
5. Pick a SQL dialect supported by [Sequelize](http://docs.sequelizejs.com/). If MySQL, skip this step. If not, download the appropriate client. For example (PostgreSQL):
    - `npm install pg`
6. Rename `server/server_config_example.js` to `server_config.js` and configure the necessary options
7. Start the server:
    - `node ./server/server.js`

Upon starting the server, if there are no users, an administrator will be created with a username of `admin` and password of `password`.