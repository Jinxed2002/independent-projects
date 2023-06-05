const express = require('express')
const db = require("../data/database")
const mongodb = require("mongodb")
const router = express.Router()
const ObjectId = mongodb.ObjectId

router.get('/', function(req, res) {
  res.redirect('/posts')
})

router.get('/posts', async function(req, res) {
  const posts = await db.getDB().collection("posts").find({}, {title: 1, summary: 1, "author.name": 1}).toArray()

  res.render('posts-list', {posts: posts})
})

router.get('/new-post', async function(req, res) {
  const authlist = await db.getDB().collection("authors").find().toArray()
  res.render('create-post', {authors: authlist})
})

router.post("/posts", async function(req, res) {
  const authID = new ObjectId(req.body.author.trim())
  const auth = await db.getDB().collection("authors").findOne({_id: authID})
  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    createdAt: new Date(),
    author: {
      id: authID,
      name: auth.name
    }
  }
  const result = await db.getDB().collection("posts").insertOne(newPost)
  console.log(result)
  res.redirect("/posts")
})

router.get("/posts/:id", async function(req, res) {
  const postID = new ObjectId(req.params.id)
  const post = await db.getDB().collection("posts").findOne({_id: postID})
  post.date = post.createdAt.toISOString()
  post.readableDate = post.createdAt.toLocaleDateString("en-GB", {weekday: "long", year: "numeric", month: "long", day: "numeric"})
  if(!post) {
    return res.status(404).render("404")
  }
  res.render("post-detail", {postDetail: post})
})

router.get("/posts/edit/:id", async function(req, res) {
  const postID = new ObjectId(req.params.id)
  const post = await db.getDB().collection("posts").findOne({_id: postID})
  res.render("update-post", {targetPost: postID, existingPost: post})
})

router.post("/edit-post/:id", async function(req, res) {
  const updatedPost = req.body
  const postID = new ObjectId(req.params.id)
  const result = await db.getDB().collection("posts").updateOne({_id: postID}, {$set: {title: updatedPost.title, summary: updatedPost.summary, content: updatedPost.content}})
  res.redirect("/posts")
}) 

router.get("/posts/delete/:id", async function(req, res) {
  const postID = new ObjectId(req.params.id)
  const result = await db.getDB().collection("posts").deleteOne({_id: postID})
  res.redirect("/posts")
})

module.exports = router;