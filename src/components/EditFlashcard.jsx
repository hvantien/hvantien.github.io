import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useState, useEffect, useRef } from "react"; // Thêm useRef
import { db } from "../firebase"; // Đảm bảo đường dẫn này chính xác
// Bỏ import ReactQuill và CSS của nó
import { useParams, useNavigate } from "react-router-dom";

const EditFlashcard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [word, setWord] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tạo refs cho các input
  const wordInputRef = useRef(null);
  const noteInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const docRef = doc(db, "flashcards", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setWord(data.word || "");
          setNote(data.note || "");
          // Tự động focus vào wordInput sau khi dữ liệu được tải và set
          if (wordInputRef.current) {
            wordInputRef.current.focus();
          }
        } else {
          console.log("No such document!");
          setError("Flashcard not found.");
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to load flashcard data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    // `e` có thể là undefined nếu gọi từ handleKeyDown
    if (e) e.preventDefault();

    if (!word.trim()) {
      alert("Word cannot be empty.");
      if (wordInputRef.current) {
        wordInputRef.current.focus(); // Focus lại vào word input nếu trống
      }
      return;
    }
    // Bạn có thể thêm kiểm tra tương tự cho note nếu muốn nó là bắt buộc

    const updatedCard = {
      word: word,
      note: note,
    };

    try {
      const docRef = doc(db, "flashcards", id);
      await updateDoc(docRef, updatedCard);
      alert("Flashcard updated successfully!"); // Giữ lại alert này cho Edit, hoặc bỏ đi nếu bạn muốn
      navigate("/");
    } catch (err) {
      console.error("Error updating document:", err);
      alert("Failed to update flashcard. Please try again.");
    }
  };

  // Xử lý nhấn Enter trên các input
  const handleKeyDown = (e, nextInputRef = null) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Ngăn hành vi mặc định của Enter
      if (nextInputRef && nextInputRef.current) {
        nextInputRef.current.focus(); // Chuyển focus nếu có input tiếp theo
      } else {
        // Nếu không có input tiếp theo (hoặc đang ở input cuối), thì submit form
        handleSubmit();
      }
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading flashcard...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="edit-flashcard-container" style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Flashcard</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="wordEditInput" style={{ display: "block", marginBottom: "5px" }}>Word:</label>
          <input
            ref={wordInputRef} // Gán ref
            id="wordEditInput"
            type="text"
            placeholder="Enter word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, noteInputRef)} // Chuyển focus sang noteInput khi Enter
            required
            className="input-field"
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "16px", boxSizing: "border-box" }}
          />
        </div>

        <div className="input-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="noteEditInput" style={{ display: "block", marginBottom: "5px" }}>Note:</label>
          <input
            ref={noteInputRef} // Gán ref
            id="noteEditInput"
            type="text" // Thay ReactQuill bằng input type="text"
            placeholder="Write your notes here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)} // Submit form khi Enter ở đây
            className="input-field"
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "16px", boxSizing: "border-box" }}
            // Bạn có thể thêm 'required' nếu muốn note là bắt buộc
          />
        </div>

        <button type="submit" className="btn-submit" style={{ backgroundColor: "#007bff", color: "white", padding: "12px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", transition: "background-color 0.3s", width: "100%", marginTop: "20px" }}>
          Update Flashcard
        </button>
      </form>

      {/* Không cần thẻ <style jsx="true"> nữa nếu style được đưa inline hoặc vào file CSS chung */}
    </div>
  );
};

export default EditFlashcard;
