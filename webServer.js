const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const async = require("async");

const express = require("express");
const app = express();

// session + body parsing
app.use(session({
  secret: "secretKey",
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.json());

// models
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

// LOGIN
app.post("/admin/login", function (request, response) {
  const loginName = request.body.login_name;
  const password = request.body.password;

  if (!loginName || !password) {
    response.status(400).send("Missing login_name or password");
    return;
  }

  User.findOne({ login_name: loginName }, function (err, user) {
    if (err) {
      response.status(500).send(JSON.stringify(err));
      return;
    }

    if (!user || user.password !== password) {
      response.status(400).send("Invalid login credentials");
      return;
    }

    // store logged-in user
    request.session.user = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name
    };

    response.status(200).json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  });
});

// LOGOUT
app.post("/admin/logout", function (request, response) {
  if (!request.session.user) {
    response.status(400).send("No user currently logged in");
    return;
  }

  request.session.destroy(function (err) {
    if (err) {
      response.status(500).send(JSON.stringify(err));
      return;
    }
    response.status(200).send("Logged out");
  });
});

// BLOCK all routes if not logged in
app.use(function (request, response, next) {
  // allow login, logout, AND test routes
  if (
    request.path.startsWith("/admin") ||
    request.path.startsWith("/test") ||
    request.path.startsWith("/user") ||
    request.path.startsWith("/photosOfUser")
  ) {
    next();
    return;
  }

  if (!request.session.user) {
    response.status(401).send("Unauthorized");
    return;
  }

  next();
});

// TEST ROUTES
app.get("/test/:p1", function (request, response) {
  const param = request.params.p1 || "info";

  if (param === "info") {
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        response.status(500).send("Missing SchemaInfo");
        return;
      }
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];

    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    response.status(400).send("Bad param " + param);
  }
});

// USER LIST
app.get("/user/list", function (request, response) {
  User.find({}, { _id: 1, first_name: 1, last_name: 1 }, function (err, users) {
    if (err) {
      response.status(500).send(JSON.stringify(err));
      return;
    }
    if (users.length === 0) {
      response.status(400).send();
      return;
    }
    response.end(JSON.stringify(users));
  });
});

// USER DETAIL
app.get("/user/:id", function (request, response) {
  const id = request.params.id;

  User.find({ _id: { $eq: id } }, { __v: 0 }, function (err, user) {
    if (err) {
      response.status(500).send(JSON.stringify(err));
      return;
    }
    if (user.length === 0) {
      response.status(400).send();
      return;
    }
    response.end(JSON.stringify(user[0]));
  });
});

// PHOTOS OF USER
app.get("/photosOfUser/:id", function (request, response) {
  const id = request.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    response.status(400).send("Invalid user id");
    return;
  }

  Photo.aggregate([
    {
      $match: {
        user_id: { $eq: new mongoose.Types.ObjectId(id) }
      }
    },
    {
      $addFields: {
        comments: { $ifNull: ["$comments", []] }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "comments.user_id",
        foreignField: "_id",
        as: "users"
      }
    },
    {
      $addFields: {
        comments: {
          $map: {
            input: "$comments",
            in: {
              $mergeObjects: [
                "$$this",
                {
                  user: {
                    $arrayElemAt: [
                      "$users",
                      {
                        $indexOfArray: [
                          "$users._id",
                          "$$this.user_id"
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    },
    {
      $project: {
        users: 0,
        __v: 0,
        "comments.__v": 0,
        "comments.user_id": 0,
        "comments.user.location": 0,
        "comments.user.description": 0,
        "comments.user.occupation": 0,
        "comments.user.__v": 0
      }
    }
  ], function (err, photos) {
    if (err) {
      response.status(500).send(JSON.stringify(err));
      return;
    }
    if (photos.length === 0) {
      response.status(400).send();
      return;
    }
    response.end(JSON.stringify(photos));
  });
});

const server = app.listen(3000, function () {
  console.log("Listening at http://localhost:3000");
});