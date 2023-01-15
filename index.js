var app = require("express")();
var https = require("https");
var fs = require("fs");
// var io = require("socket.io")(server);
const { Server } = require("socket.io");

const cors = require("cors");

var options = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
  ca: fs.readFileSync("./csr.pem"),

  requestCert: false,
  rejectUnauthorized: false,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
};

app.use(
  cors({
    origin: "*",
  })
);

var server = https.createServer(options, app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.listen(8080, () => console.log("server started"));

io.on("connection", function (socket) {
  // code goes here...
  console.log("A user connected with id: ", socket.id);

  socket.broadcast.emit("ping", {});

  socket.on("pong", (data) => {
    console.log("pong recieved");
  });

  socket.on("coords", (coords) => {
    console.log(coords);
    socket.broadcast.emit("coords", coords);
  });

  socket.on("remove_object", (object) => {
    console.log(object);
    socket.broadcast.emit("remove_object", object);
  });

  socket.on("user_leave", (message) => {
    console.log(message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected with id:-" + socket.id);
  });
});

app.get("/", function (req, res) {
  res.status(200).send("socket server running on ");
});
