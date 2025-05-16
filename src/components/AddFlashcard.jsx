import { collection, addDoc } from "firebase/firestore";
import { useState, useRef } from "react"; // Thêm useRef
import { db } from "../firebase"; // Đảm bảo đường dẫn này chính xác
// Bỏ import ReactQuill và CSS của nó

const AddFlashcard = () => {
  const [word, setWord] = useState("");
  const [note, setNote] = useState("");

  // Tạo refs cho các input
  const wordInputRef = useRef(null);
  const noteInputRef = useRef(null);

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
    // if (!note.trim()) {
    //   alert("Note cannot be empty.");
    //   if (noteInputRef.current) {
    //     noteInputRef.current.focus();
    //   }
    //   return;
    // }

    const newCard = {
      word: word,
      note: note,
    };

    try {
      await addDoc(collection(db, "flashcards"), newCard);
      // Không có alert thành công theo yêu cầu trước
      setWord("");
      setNote("");
      if (wordInputRef.current) {
        wordInputRef.current.focus(); // Focus lại vào word input sau khi submit thành công
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add flashcard. See console for details.");
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

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Add Flashcard (Word and Note)
      </h2>
      {/* Sử dụng thẻ form và hàm handleSubmit của nó. 
        Việc nhấn Enter trong input field thường sẽ tự động trigger submit 
        nếu có một button type="submit" trong form.
        Tuy nhiên, để kiểm soát tốt hơn việc focus và submit, ta sẽ dùng onKeyDown.
      */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="wordInput" style={{ display: "block", marginBottom: "5px" }}>Word:</label>
        <input
          ref={wordInputRef} // Gán ref
          id="wordInput"
          type="text"
          placeholder="Enter the word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, noteInputRef)} // Chuyển focus sang noteInput khi Enter
          required
          className="input-field"
        />
        <br />
        <br />

        <label htmlFor="noteInput" style={{ display: "block", marginBottom: "5px" }}>Note:</label>
        <input
          ref={noteInputRef} // Gán ref
          id="noteInput"
          type="text" // Thay ReactQuill bằng input type="text"
          placeholder="Write your notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)} // Submit form khi Enter ở đây
          className="input-field"
          // Bạn có thể thêm 'required' nếu muốn note là bắt buộc
        />
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
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          box-sizing: border-box;
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
          width: 100%;
          margin-top: 10px;
        }
        .btn-submit:hover {
          background-color: #45a049;
        }
        /* Bỏ CSS của ReactQuill */
      `}</style>
    </div>
  );
};

export default AddFlashcard;
