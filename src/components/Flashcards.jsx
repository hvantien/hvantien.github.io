import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState, useCallback, useRef } from "react";
import { db } from "../firebase";
import "../Flashcards.css"; // Đảm bảo file CSS này tồn tại và được cấu hình

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [userInputNote, setUserInputNote] = useState("");
  const [noteComparisonResult, setNoteComparisonResult] = useState(null);
  const [revealOriginalNote, setRevealOriginalNote] = useState(false);

  const inputNoteRef = useRef(null);

  // Hàm loại bỏ tag HTML khỏi chuỗi
  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // Fetch flashcards từ Firebase
  useEffect(() => {
    const fetchFlashcards = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "flashcards"));
        const cardsData = [];
        querySnapshot.forEach((doc) => {
          // Lấy dữ liệu cơ bản, không có logic SRS trong phiên bản này
          cardsData.push({ id: doc.id, ...doc.data() });
        });
        setFlashcards(cardsData);
      } catch (error) {
        console.error("Error fetching flashcards: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlashcards();
  }, []);

  // Reset trạng thái và focus input khi đổi card hoặc khi tải xong
  useEffect(() => {
    setUserInputNote("");
    setNoteComparisonResult(null);
    setRevealOriginalNote(false);
    if (!isLoading && flashcards.length > 0 && inputNoteRef.current) {
      inputNoteRef.current.focus();
    }
  }, [currentIndex, isLoading, flashcards]);


  // Hàm chuyển đến flashcard trước đó
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Hàm chuyển đến flashcard tiếp theo
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, flashcards.length - 1));
  }, [flashcards.length]); // Phụ thuộc vào flashcards.length để tính toán giới hạn

  // Hàm tạo các spans để hiển thị so sánh (phiên bản nâng cao: word-by-word)
  const generateComparisonSpans = (userInput, correctText) => {
    const userWords = userInput.split(/(\s+)/); // Tách từ và giữ lại khoảng trắng
    const correctWords = correctText.split(/(\s+)/); // Tách từ và giữ lại khoảng trắng
    const resultSpans = [];
    // let hasError = false; // Biến này không được sử dụng trong phiên bản hiện tại, nhưng logic so sánh vẫn có thể xác định lỗi
    let keyCounter = 0;

    const maxLength = Math.max(userWords.length, correctWords.length);

    for (let i = 0; i < maxLength; i++) {
      const userWord = userWords[i];
      const correctWord = correctWords[i];

      if (userWord === undefined && correctWord !== undefined) {
        // Người dùng nhập thiếu từ/khoảng trắng
        // hasError = true;
        if (correctWord.trim() === "") {
            resultSpans.push(<span key={`space-missing-${keyCounter++}`}>{correctWord}</span>);
        } else {
            resultSpans.push(
              <span key={`missing-word-${keyCounter++}`} style={{ color: "red", backgroundColor: "#ffe0e0", fontWeight: "500" }}>
                {correctWord}
              </span>
            );
        }
      } else if (userWord !== undefined && correctWord === undefined) {
        // Người dùng nhập thừa từ/khoảng trắng
        // hasError = true;
        if (userWord.trim() === "") {
             resultSpans.push(<span key={`space-extra-${keyCounter++}`}>{userWord}</span>);
        } else {
            resultSpans.push(
              <span key={`extra-word-${keyCounter++}`} style={{ color: "red", backgroundColor: "#fff0f0", textDecoration: "line-through", fontWeight: "500" }}>
                {userWord}
              </span>
            );
        }
      } else if (userWord !== undefined && correctWord !== undefined) {
        // Cả hai đều có từ/khoảng trắng ở vị trí này
        if (userWord.trim() === "" && correctWord.trim() === "") { // Cả hai đều là khoảng trắng
          resultSpans.push(<span key={`space-both-${keyCounter++}`}>{userWord}</span>);
          continue;
        }
        // Xử lý trường hợp một bên là khoảng trắng, một bên là từ
        if (userWord.trim() === "" && correctWord.trim() !== "") {
            // hasError = true;
            resultSpans.push(<span key={`space-user-${keyCounter++}`}>{userWord}</span>); // Hiển thị khoảng trắng người dùng nhập
            // Đánh dấu từ đúng bị thiếu
            resultSpans.push(<span key={`missing-word-after-space-${keyCounter++}`} style={{ color: "red", backgroundColor: "#ffe0e0", fontWeight: "500" }}>{correctWord}</span>);
            continue;
        }
        if (correctWord.trim() === "" && userWord.trim() !== "") {
            // hasError = true;
            // Đánh dấu từ người dùng nhập thừa
            resultSpans.push(<span key={`extra-word-before-space-${keyCounter++}`} style={{ color: "red", backgroundColor: "#fff0f0", textDecoration: "line-through", fontWeight: "500" }}>{userWord}</span>);
            resultSpans.push(<span key={`space-correct-${keyCounter++}`}>{correctWord}</span>); // Hiển thị khoảng trắng đúng
            continue;
        }

        // Cả hai đều là từ (không phải khoảng trắng)
        if (userWord === correctWord) {
          resultSpans.push(<span key={`correct-word-${keyCounter++}`} style={{ color: "green" }}>{userWord}</span>);
        } else {
          // Từ khác nhau, so sánh từng ký tự trong từ đó
          // hasError = true;
          const userChars = userWord.split('');
          const correctChars = correctWord.split('');
          const maxCharLength = Math.max(userChars.length, correctChars.length);
          for (let j = 0; j < maxCharLength; j++) {
            const userChar = userChars[j];
            const correctChar = correctChars[j];

            if (userChar === undefined) { // Thiếu ký tự
              resultSpans.push(<span key={`char-missing-${keyCounter++}-${j}`} style={{ color: "red", backgroundColor: "#ffe0e0", fontWeight: "bold" }}>{correctChar}</span>);
            } else if (correctChar === undefined) { // Thừa ký tự
              resultSpans.push(<span key={`char-extra-${keyCounter++}-${j}`} style={{ color: "red", backgroundColor: "#fff0f0", textDecoration: "line-through" }}>{userChar}</span>);
            } else if (userChar === correctChar) {
              resultSpans.push(<span key={`char-correct-${keyCounter++}-${j}`} style={{ color: "green" }}>{userChar}</span>);
            } else {
              resultSpans.push(<span key={`char-incorrect-${keyCounter++}-${j}`} style={{ color: "red", backgroundColor: "#fff0f0", fontWeight: "bold" }}>{userChar}</span>);
            }
          }
        }
      }
    }
    // if (userInput.length === 0 && correctText.length > 0) hasError = true;

    // Trả về mảng các spans. Biến hasError không được sử dụng trực tiếp trong phiên bản này
    // nhưng logic so sánh đã được cải thiện.
    return resultSpans.length > 0 ? resultSpans : [<span key="empty-comp" style={{ fontStyle: 'italic' }}>Nội dung bạn nhập còn trống.</span>];
  };

  // Xử lý khi nhấn Enter trong ô input
  const handleNoteInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Ngăn hành vi mặc định của Enter
      const currentCard = flashcards[currentIndex];
      if (currentCard) {
        const plainNoteText = stripHtml(currentCard.note || ""); // Đảm bảo note không null/undefined
        const comparisonSpans = generateComparisonSpans( // Lấy trực tiếp mảng spans
          userInputNote,
          plainNoteText
        );
        setNoteComparisonResult(comparisonSpans);
        setRevealOriginalNote(true);
        // Logic `hasError` và `markCardAsIncorrect` đã bị loại bỏ trong phiên bản này
      }
    }
  };

  // Xử lý sự kiện bàn phím chung (Next/Previous)
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (document.activeElement === inputNoteRef.current) {
        // Nếu ô input đang được focus
        if (revealOriginalNote && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
          // Và nếu đáp án đã hiện, phím mũi tên sẽ chuyển card
          event.preventDefault();
          if (event.key === "ArrowRight" && currentIndex < flashcards.length - 1) {
            goToNext();
          } else if (event.key === "ArrowLeft" && currentIndex > 0) {
            goToPrevious();
          }
        }
        // Nếu đáp án chưa hiện, phím mũi tên sẽ di chuyển con trỏ trong input (mặc định)
      } else {
        // Nếu ô input KHÔNG được focus, phím mũi tên chuyển card
        switch (event.key) {
          case "ArrowRight":
            if (currentIndex < flashcards.length - 1) goToNext();
            break;
          case "ArrowLeft":
            if (currentIndex > 0) goToPrevious();
            break;
          default: break;
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [goToNext, goToPrevious, currentIndex, flashcards.length, revealOriginalNote]);

  const card = flashcards[currentIndex]; // Lấy card hiện tại

  // Hiển thị trạng thái loading ban đầu
  if (isLoading) {
    return <div className="flashcards-wrapper" style={{ textAlign: 'center', padding: '50px' }}>Loading flashcards...</div>;
  }

  // Hiển thị nếu không có flashcard nào
  if (flashcards.length === 0 && !isLoading) {
    return <div className="flashcards-wrapper" style={{ textAlign: 'center', padding: '50px' }}>No flashcards found.</div>;
  }
  
  return (
    <div className="flashcards-wrapper">
      <div className="flashcard-scrollable">
        {card && ( // Đảm bảo card tồn tại trước khi render
          <div className="card">
            <h3>{card.word || "Word not available"}</h3>

            <div className="card-attempt-area" style={{ marginTop: '15px' }}>
              <h4>Type your remembered note and press Enter:</h4>
              <input
                ref={inputNoteRef} // Gán ref cho input
                type="text"
                value={userInputNote}
                onChange={(e) => setUserInputNote(e.target.value)}
                onKeyDown={handleNoteInputKeyDown}
                placeholder="Type the note content here..."
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginBottom: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  fontSize: '16px'
                }}
              />

              {/* Hiển thị đáp án gốc nếu revealOriginalNote là true */}
              {revealOriginalNote && (
                <div className="original-note-section" style={{ marginBottom: '15px'}}>
                  <h4>Original Note (Answer):</h4>
                  {card.note ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: card.note }} 
                      style={{ border: '1px solid #e0e0e0', padding: '10px', borderRadius: '4px', background: '#f9f9f9', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    />
                  ) : (
                    <p>No original note was available for this card.</p>
                  )}
                </div>
              )}

              {/* Hiển thị kết quả so sánh nếu có */}
              {noteComparisonResult && (
                <div className="note-comparison-result">
                  <h4>Your Attempt & Comparison:</h4>
                  <div style={{ 
                    border: '1px solid #d1d1d1', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    background: '#ffffff',
                    lineHeight: '1.6',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap' // Quan trọng để các span và khoảng trắng được hiển thị đúng
                  }}>
                    {noteComparisonResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Hiển thị loading cho chi tiết card nếu card chưa có nhưng flashcards đã có dữ liệu */}
        {!card && flashcards.length > 0 && !isLoading && <p style={{textAlign: 'center'}}>Loading card details...</p>}
      </div>

      <div className="flashcard-controls">
        <button onClick={goToPrevious} disabled={currentIndex === 0}>
          ⬅ Previous
        </button>
        <button
          onClick={goToNext}
          disabled={!flashcards || flashcards.length === 0 || currentIndex === flashcards.length - 1}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
