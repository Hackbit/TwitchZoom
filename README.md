# Twitch Zoom!

Watch Twitch streams the Japanese way with this refreshing new take on an old concept!



In the 2000s as video streaming on the internet was gaining popularity, a Japanese website called Nico Nico gained popularity. The hook for their website was that comments and chat messages would be overlaid on the stream live as you were watching via a fly-by marquee animation!

Nobody has really ever used that hook since the early 2000s and so we decided to apply it to Twitch using their own API and recreate it for a new audience so that you can watch in a more fun way!

As an added bonus, you can use this app to overlay it automatically on your own stream via Open Broadcaster Software (OBS) so that when you combine the app with a Browser Source, you can make it so that your normal stream will automatically display the effect by default for your viewers!




## Instructions

###Option 1: live demo app 

- Visit this site: `http://104.248.4.129/`
- (alternatively, visit `http://104.248.4.129/usernamehere` if you want to automatically tune in to a particular channel)
- Enter the username of a Twitch streamer that you want to tune into
- For best results, pick a Twitch streamer who currently has a fast moving chatroom
- You are done!



###Option 2: local hosting (or, if the live demo isn't working for some reason)

- Clone the repo and install the npm packages via `npm install`
- Run `node server.js` in one bash terminal console instance
- Run `npm start` in the a second bash terminal instance
- Visit `localhost:3000` in your browser
- Enter the username of a Twitch streamer that you want to tune into
- You are done!
