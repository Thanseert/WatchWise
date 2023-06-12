const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");




const app = express()
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));


mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/MovieDB", {UseNewUrlParser: true});

const MovieSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    title: String,
    rating: Number,
    description: String,
    review:String,
    image: String
}); 

const Movie = mongoose.model('Movie', MovieSchema);

const reveiwUser = mongoose.model("reveiwUser", MovieSchema);

const movies = [
    {
        id: 1,
        title: "Interstellar",
        rating: 8.5,
        description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
        image: "https://www.hollywoodreporter.com/wp-content/uploads/2014/09/interstellar_poster_0.jpg?w=2000&h=1126&crop=1"
    },
    {
        id: 2,
        title: "The railway man",
        rating: 7.9,
        description: "A former British Army officer, who was tortured as a prisoner of war at a Japanese labor camp during World War II, discovers that the man responsible for much of his treatment is still alive and sets out to confront him",
        image: "https://images.indianexpress.com/2021/12/The-Railway-men-YRF-Entertainment.jpg"
    },
    {
        id: 3,
        title: "John Wick",
        rating: 8.5,
        description: "Description of Movie 1",
        image: "https://www.example.com/image1.jpg"
    },
    {
        id: 4,
        title: "Movie 2",
        rating: 7.9,
        description: "Description of Movie 2",
        image: "https://www.example.com/image2.jpg"
    },
    {
        id: 5,
        title: "Movie 1",
        rating: 8.5,
        description: "Description of Movie 1",
        image: "https://www.example.com/image1.jpg"
    },
    {
        id: 6,
        title: "Movie 2",
        rating: 7.9,
        description: "Description of Movie 2",
        image: "https://www.example.com/image2.jpg"
    },
];



app.get("/", function(req, res){
    res.render("frontpage");
});

app.get("/home", function(req, res){
    res.render("home");
});

app.get("/fanfavorites", function(req, res){
    res.render("fan");
});

app.get("/toppick", function(req, res){
    res.render("toppick");
});

app.get("/posting", function(req, res){
    res.render("posting");
});

app.get("/movie/:id", function(req, res){
     const movieId = parseInt(req.params.id);
    const movie = movies.find(movie => movie.id== movieId);

    if (movie) {
        res.render("allmovie", { movie: movie });
    } else {
        res.send("status404");
    }
});

app.post("/posting", async function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    
 try{
    const user = await reveiwUser.findOne({username: username, password: password});
        const { title, rating, description, review, image } = req.body;

        if (user) {
                const newMovie = new Movie({
                    title: title,
                    rating: rating,
                    description: description,
                    image: image,
                    review:review,
                    username: username,
                    password: password
                });
                await newMovie.save();
                res.redirect("/home");
         } else {
            res.send("Invalid credentials");
         }
     } catch (err) {
        console.log(err);
        res.send("An error occurred.");
     }
});
   
app.get("/signup", function(req, res){
    res.render("signup");
});

app.post("/signup", async function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.Email;

    try {
    const newUser = new reveiwUser({
       username: username,
       password: password,
       email: email 
    });

    await newUser.save();
    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }

});

app.get("/search", function(req, res){
    res.render("search");
});

app.post("/search", async function(req, res) {
    const searchTerm = req.body.q; // Get the search term from the query parameter
  
    try {
      // Search for movies matching the search term in the database
      const movies = await Movie.find({ title: searchTerm}).exec();

      res.render("searchresult", { movies: movies , searchTerm: searchTerm});
    } catch (err) {
      console.log(err);
      res.send("An error occurred.");
    }
  });

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", async function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    try{
        const user = await reveiwUser.findOne({ username: username}).exec();
        if (user) {
            if (password == user.password) {
                res.redirect("/home");
            } else {
                res.send("Wrong password! Try again");
            }
        } else {
            res.send("User not Found");
        }
    }
    catch (err) {
        console.log(err);
    }
});


app.listen(3000, function(){
    console.log("app started running on port 3000");
});