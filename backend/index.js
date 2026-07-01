const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Store notes in memory
let notes = [];
let nextId = 1;

// Home Route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// Get all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// Add note
app.post("/notes", (req, res) => {
  const newNote = {
    id: nextId++,
    text: req.body.text,
  };

  notes.push(newNote);

  res.status(201).json(newNote);
});

// Edit note
app.put("/notes/:id", (req, res) => {
  const id = Number(req.params.id);

  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({
      message: "Note not found",
    });
  }

  note.text = req.body.text;

  res.json(note);
});

// Delete note
app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = notes.findIndex((n) => n.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Note not found",
    });
  }

  notes.splice(index, 1);

  res.json({
    message: "Note deleted successfully",
  });
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Backend running at http://localhost:3000");
});