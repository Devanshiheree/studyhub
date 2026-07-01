/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const API = "http://localhost:3000";

  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");

  // Load Notes
  const loadNotes = async () => {
    try {
      const res = await fetch(`${API}/notes`);
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Add Note
  const addNote = async () => {
    if (!text.trim()) return;

    try {
      await fetch(`${API}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      });

      setText("");
      loadNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Note
  const editNote = async (id, currentText) => {
    const newText = prompt("Edit your note", currentText);

    if (!newText || !newText.trim()) return;

    try {
      await fetch(`${API}/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newText,
        }),
      });

      loadNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API}/notes/${id}`, {
        method: "DELETE",
      });

      loadNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // Filtered Notes
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1 className="title">StudyHub Notes</h1>

      {/* Add Note */}
      <div className="input-group">
        <input
          className="note-input"
          type="text"
          placeholder="Write a new note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addNote();
          }}
        />

        <button className="add-btn" onClick={addNote}>
          Add Note
        </button>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Total Notes */}
      <h3 className="note-count">
        Total Notes: {filteredNotes.length}
      </h3>

      {/* Notes */}
      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <div className="empty">
            <h2>No Notes Found</h2>
            <p>Add a note or try another search.</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div className="note-card" key={note.id}>
              <p className="note-text">{note.text}</p>

              <div className="button-group">
                <button
                  className="edit-btn"
                  onClick={() => editNote(note.id, note.text)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteNote(note.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;