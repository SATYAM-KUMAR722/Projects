    if(process.env.NODE_ENV !== 'production'){
        require('dotenv').config();
    }

    const express = require('express');
    const app = express();
    const mongoose = require('mongoose');
    const path = require('path');
    const methodOverride = require('method-override')
    const ejsMate = require('ejs-mate');
    const ExpressError = require('./utils/ExpressError')
    const listingRouter = require("./routes/listing.js")
    const reviewsRouter = require("./routes/reviews.js")
    const userRouter = require("./routes/user.js")
    const session = require('express-session');
    const MongoStore = require('connect-mongo');
    const flash = require('connect-flash');
    const passport = require('passport');
    const LocalStrategy = require('passport-local');
    const User = require('./models/user');



    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "/views"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride('_method'))
    app.engine('ejs', ejsMate);
    app.use(express.static(path.join(__dirname, "/public")));

    const dbUrl = process.env.ATLASDB_URL;

   

    const store = MongoStore.create({
        mongoUrl: dbUrl,
        crypto:{
            secret:process.env.SECRET,
        },
        touchAfter: 24 * 60 * 60,
    })

    store.on("error", function(err){
        console.log(" Session store error", err);
    })

    const sessionOptions = {
        store,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true
        }
    };



    app.use(session(sessionOptions));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session()); 
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());


    app.use((req, res, next) =>{
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currentUser = req.user;
        next();
    })

    // app.get("/demouser", async (req, res) =>{
    //     let fakeUser = new User({
    //         email: "satyamkr@gmail.com",
    //         username: "Satyam"
    //     })

    //     let registeredUser = await User.register(fakeUser, "sk12345");
    //     res.send(registeredUser);
    // })

    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewsRouter);
    app.use("/", userRouter);


    app.all("/*splat", (req, res, next) => {
        next(new ExpressError(404, "Page not found"));
    });

    app.use((err, req, res, next) => {
        const { statusCode = 500, message = "Something went wrong" } = err;
        res.status(statusCode).render("listings/error.ejs", { message })
    });


     main().then(() => {
        console.log("✅ Connected to MongoDB");

        app.listen(8080, () => {
            console.log("🚀 Server is running on port 8080");
        });
    }).catch((err) => {
        console.error("❌ MongoDB connection failed:");
        console.error(err);
    });

    async function main(){
        await mongoose.connect(dbUrl);
    }
    