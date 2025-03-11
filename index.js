import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const blogPosts = [];
var idCount = 0;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { blogPostArray: blogPosts });
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.post("/compose", (req,res) =>{
    const newPost = {
            id: ++idCount,
            title: req.body.postTitle,
            content: req.body.postContent,
            date: new Date()
    };
    blogPosts.push(newPost);
    res.render("index.ejs", { blogPostArray: blogPosts });
});

app.get("/edit/:id" , (req, res) => {
    const postId = parseInt(req.params.id);
    const post = blogPosts.find(p => p.id === postId);
    if(!post){
        return res.status(404).send('Post not found');
    }
    res.render("edit.ejs", { post: post });
});

app.post("/edit/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = blogPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).send('Post not found');  
    }
    blogPosts[postIndex].title = req.body.postTitle;
    blogPosts[postIndex].content = req.body.postContent;
    res.redirect('/');
});

app.post("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = blogPosts.findIndex(p => p.id === postId);
    if(postIndex !== -1){
        blogPosts.splice(postIndex, 1);
    }
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });