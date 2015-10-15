# material-qna

### Features

Material QnA is a question and answer platform designed using Google's [Material](https://www.google.com/design/spec/what-is-material) specification. 

Questions have one or more answers and may have a correct answer, have an image, or be disabled. After registering or logging in, enabled, unanswered question images are fetched and displayed in a Pinterest-style [masonry grid](http://www.sitepoint.com/understanding-masonry-layout/) until there is no visible whitespace below the last image in each column or no eligible questions remain. More images are downloaded, if needed, upon answering a question, scrolling, resizing the window, or returning to the grid after visiting the administration panel. If a question has no image, one is generated with pseudo-random dimensions, a pseudo-random background color based on the [golden ratio](https://en.wikipedia.org/wiki/Golden_ratio), and a [complementary](https://en.wikipedia.org/wiki/Complementary_colors) text color. Clicking a question image opens a dialog in which a user may answer the question, and afterwards the user is given feedback. Answered questions are removed from the grid after closing the dialog.

The administration panel is divided into three sections:

- Users
    - Search for users and edit / delete them individually or in bulk
- QnA
    - Add questions one at a time or in bulk via JSON upload
    - Search for questions and edit / delete them individually or in bulk
    - Search for question images (powered by the [Google Image Search API](https://developers.google.com/image-search/v1/jsondevguide))
- History
    - Search for answered questions and delete them them individually or in bulk

### Installation

1. Download and install [Node.js](https://nodejs.org/en/download/), if needed. Material QnA was tested with version 2.14.4.
2. Download Material QnA via `git`:
    - `git clone https://github.com/mjhasbach/material-qna.git`
3. Enter the Material QnA project directory:
    - `cd material-qna`
4. Download the dependencies:
    - `npm install`
5. Build the UI bundle:
    - `node ./node_modules/webpack/bin/webpack.js --config ./ui/webpack.config.js --colors --progress`
6. Pick a SQL dialect supported by [Sequelize](http://docs.sequelizejs.com/). If MySQL, skip this step. If not, download the appropriate client. For example (PostgreSQL):
    - `npm install pg`
7. Rename `server/server_config_example.js` to `server_config.js` and configure the necessary options:
8. Start the server
    - `node ./server/server.js`

Upon starting the server, if there are no users, an administrator will be created with a username of `admin` and password of `password`.