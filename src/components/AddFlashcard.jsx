import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddFlashcard = () => {
  const [word, setWord] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState("");
  const [examples, setExamples] = useState([{ sentence: "", translation: "" }]);

  const handleAddExample = () => {
    setExamples([...examples, { sentence: "", translation: "" }]);
  };

  const handleExampleChange = (index, field, value) => {
    const updated = [...examples];
    updated[index][field] = value;
    setExamples(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCard = { word, note, image, examples };
    await addDoc(collection(db, "flashcards"), newCard);
    setWord("");
    setNote("");
    setImage("");
    setExamples([{ sentence: "", translation: "" }]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add Flashcard</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          required
          className="input-field"
        />
        <br />
        <br />

        <ReactQuill
          value={note}
          onChange={setNote}
          placeholder="Write notes here..."
          theme="snow"
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
          }}
        />
        <br />
        <br />

        <input
          type="text"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="input-field"
        />
        <br />
        <br />

        <h4>Examples</h4>
        {examples.map((ex, idx) => (
          <div key={idx} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Sentence"
              value={ex.sentence}
              onChange={(e) =>
                handleExampleChange(idx, "sentence", e.target.value)
              }
              required
              className="input-field"
            />
            <br />
            <input
              type="text"
              placeholder="Translation"
              value={ex.translation}
              onChange={(e) =>
                handleExampleChange(idx, "translation", e.target.value)
              }
              required
              className="input-field"
            />
            <br />
          </div>
        ))}

        <button type="button" className="btn-add" onClick={handleAddExample}>
          + Add Example
        </button>
        <br />
        <br />
        <button type="submit" className="btn-submit">
          Submit Flashcard
        </button>
      </form>

      {/* Style */}
      <style jsx="true">{`
        .input-field {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
        }

        .btn-add {
          background-color: #f0f0f0;
          color: #333;
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        .btn-add:hover {
          background-color: #ddd;
        }

        .btn-submit {
          background-color: #4caf50;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        .btn-submit:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default AddFlashcard;
