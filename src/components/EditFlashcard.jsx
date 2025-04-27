import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";

const EditFlashcard = () => {
  const { id } = useParams();  // Get the flashcard id from the URL
  const navigate = useNavigate();  // Replace useHistory with useNavigate

  const [word, setWord] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState("");
  const [examples, setExamples] = useState([{ sentence: "", translation: "" }]);

  // Fetch the flashcard data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "flashcards", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setWord(data.word);
        setNote(data.note);
        setImage(data.image);
        setExamples(data.examples || [{ sentence: "", translation: "" }]);
      }
    };
    fetchData();
  }, [id]);

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
    const updatedCard = { word, note, image, examples };
    const docRef = doc(db, "flashcards", id);
    await updateDoc(docRef, updatedCard);
    navigate("/");
  };

  return (
    <div className="add-flashcard-container">
      <h2>Edit Flashcard</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Word</label>
          <input
            type="text"
            placeholder="Enter word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div className="input-group">
          <label>Note</label>
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
        </div>

        <div className="input-group">
          <label>Image URL (optional)</label>
          <input
            type="text"
            placeholder="Enter image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="input-field"
          />
        </div>

        <h4>Examples</h4>
        {examples.map((ex, idx) => (
          <div key={idx} className="example-group">
            <div className="input-group">
              <label>Sentence</label>
              <input
                type="text"
                placeholder="Enter sentence"
                value={ex.sentence}
                onChange={(e) =>
                  handleExampleChange(idx, "sentence", e.target.value)
                }
                required
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label>Translation</label>
              <input
                type="text"
                placeholder="Enter translation"
                value={ex.translation}
                onChange={(e) =>
                  handleExampleChange(idx, "translation", e.target.value)
                }
                required
                className="input-field"
              />
            </div>
            <hr />
          </div>
        ))}
        
        <button type="button" className="btn-add-example" onClick={handleAddExample}>
          + Add Example
        </button>

        <button type="submit" className="btn-submit">
          Update Flashcard
        </button>
      </form>

      <style jsx="true">{`
        .add-flashcard-container {
          padding: 20px;
          max-width: 600px;
          margin: auto;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .input-group {
          margin-bottom: 15px;
        }

        label {
          font-weight: bold;
          margin-bottom: 5px;
          color: #333;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
        }

        .example-group {
          margin-bottom: 20px;
        }

        .btn-add-example {
          background-color: #f0f0f0;
          color: #333;
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }

        .btn-add-example:hover {
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
          transition: background-color 0.3s ease;
        }

        .btn-submit:hover {
          background-color: #45a049;
        }

        .ql-editor {
          min-height: 200px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default EditFlashcard;
