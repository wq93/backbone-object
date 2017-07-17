### Setup

    git clone https://github.com/wq93/backbone-object.git

    cd backbone-object
    
    npm install

    npm start   -> starts webpack dev server & express & watches for changes

    open http://localhost:3000 -> open in new terminal tab/window OR your browser

### Structure

    public/   -> index.html
    server/   -> webpack dev server config
    src/      -> application files JS(es6), HTML, SASS
        /application/   -> marionette application (parent `App`)
        /apps/          -> marionette sub applications (children)
        /sass/          -> SASS style rules (Bootstrap)
        /services/      -> marionette specialized sub applications (non routing)
        /behaviors/     -> marionette behaviors used across `App`
        main.js         -> entry script & `App` initialization
        plugins.js      -> setup Backbone & Marionette and hook Browser Inspectors if present
    server.js                       -> express server configuration
    webpack.config.js               -> webpack configuration (development)
    webpack.developing.config.js    -> webpack configuration (developing)

### test Github CI config
    before_script:
    - npm install

    build:
    script:
    - webpack -p --config webpack.developing.config.js
    - rm -rf ~/yanphone
    - mkdir ~/yanphone
    - cp -r public/* ~/yanphone/
    - cd ~/yanphone
    - surge -p .
