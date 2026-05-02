const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const app = express();
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/url_shortener')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

const urlSchema = new mongoose.Schema({
  short: String,
  long: String
});

const Url = mongoose.model("Url", urlSchema);


app.post('/shorten', async (req, res) => {
  try {
    const entry = await Url.create({ 
      short: nanoid(6), 
      long: req.body.url 
    });
    res.send(`http://localhost:3000/${entry.short}`);
  } catch (err) {
    res.status(500).send("Error saving to database");
  }
});


app.get('/:id', async (req, res) => {
  const entry = await Url.findOne({ short: req.params.id });
  if (entry) {
    res.redirect(entry.long);
  } else {
    res.status(404).send("URL not found");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});