mkdir -p www
yarn clean
sass --no-source-map --style compressed src/scss:www/css
cp -r src/fonts www
cp -r src/js www
cp src/index.html www
cp -r www platforms/android/app/src/main/assets