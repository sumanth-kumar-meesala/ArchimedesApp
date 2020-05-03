let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");
let app = express();
let chatRoute = require("./routes/chat.route");
let malacardsRoute = require("./routes/malacards.route");
let tgaRoute = require("./routes/tga.route");
let userRoute = require("./routes/user.route");
let searchRoute = require("./routes/search.route");
let wineRoute = require("./routes/wine.route");
let cors = require("cors");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

// let db_url = process.env.MONGOLAB_URI;
let db_url =
  "mongodb+srv://sumanth:sumanth@cluster0-yslik.mongodb.net/modern?retryWrites=true";

mongoose.connect(
  db_url,
  {
    auth: {
      user: "sumanth",
      password: "sumanth"
    },

    useCreateIndex: true,
    useNewUrlParser: true
  },
  function(err, client) {
    if (err) {
      console.log(err);
    }
    console.log("DB Connected");
  }
);

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var allowedOrigins = ["http://localhost:8000"];

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);

// app.use("/chat", chatRoute);
// app.use("/malacards", malacardsRoute);
// app.use("/tga", tgaRoute);
// app.use("/", userRoute);
// app.use("/", searchRoute);
app.use("/", wineRoute);

const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", function(socket) {
  socket.on("connect", function() {});
  socket.on("send", function(data) {
    io.sockets.emit(data.chat_id, data);
  });
  socket.on("disconnect", function() {});

  socket.on("error", function(err) {
    console.log("received error from client:", socket.id);
    console.log(err);
  });
});

var port = process.env.PORT || 9000;

server.listen(port, function(err) {
  if (err) throw err;
  console.log("Running RestHub on port " + port);
});
