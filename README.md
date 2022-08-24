# Tic Tac Toe

This is a simple Tic Tac Toe game with AI using Minimax algorithm with Alpha-Beta Pruning. It's written in JavaScript and is loaded inside WebView to create Android app.

## Building

Make sure [yarn](https://yarnpkg.com/) and [Sass](https://sass-lang.com/) are globally installed.

```
yarn build
```

This will compile SCSS files to CSS, copy fonts, HTML and JavaScript to `www`, and then copy `www` to Android's assets directory.
Then build it in Android Studio or Android Command-Line Tools.