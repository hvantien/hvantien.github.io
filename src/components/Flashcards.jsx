import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import "../Flashcards.css";

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const querySnapshot = await getDocs(collection(db, "flashcards"));
      const cards = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.examples = data.examples.map((ex) => ({ ...ex, userInput: "" }));
        cards.push(data);
      });
      setFlashcards(cards);
    };

    fetchFlashcards();
  }, []);

  const handleInputChange = (e, exampleIdx) => {
    const updatedCards = [...flashcards];
    updatedCards[currentIndex].examples[exampleIdx].userInput = e.target.value;
    setFlashcards(updatedCards);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setShowDetails(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, flashcards.length - 1));
    setShowDetails(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const card = flashcards[currentIndex];

  const renderComparison = (userInput, sentence) => {
    const maxLength = Math.max(userInput.length, sentence.length);
    const spans = [];

    for (let i = 0; i < maxLength; i++) {
      const inputChar = userInput[i] || "";
      const correctChar = sentence[i] || "";

      const isCorrect = inputChar === correctChar;

      spans.push(
        <span
          key={i}
          style={{ color: isCorrect ? "black" : "red", whiteSpace: "pre" }}
        >
          {inputChar}
        </span>
      );
    }

    return spans;
  };

  return (
    <div className="flashcards-wrapper">
      <div className="flashcard-scrollable">
        {card && (
          <div className="card">
            <h3>{card.word}</h3>

            {showDetails && (
              <>
                <div dangerouslySetInnerHTML={{ __html: card.note }} />
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.word}
                    width="200"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}

                <h4>Examples:</h4>
                <ul>
                  {card.examples.map((example, idx) => {
                    const userInput = example.userInput || "";
                    const sentence = example.sentence || "";
                    const isCorrect =
                      userInput.trim().toLowerCase() ===
                      sentence.trim().toLowerCase();

                    return (
                      <div key={idx} style={{ marginBottom: "20px" }}>
                        <p>
                          <strong>Translation:</strong> {example.translation}
                        </p>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="text"
                            value={userInput}
                            onChange={(e) => handleInputChange(e, idx)}
                            placeholder="Type your answer here"
                            style={{
                              border: `2px solid ${
                                userInput.length === 0
                                  ? "#ccc"
                                  : isCorrect
                                  ? "green"
                                  : "red"
                              }`,
                              width: "100%",
                              maxWidth: "500px",
                            }}
                          />
                          {userInput.length > 0 && (
                            <span
                              title={sentence}
                              style={{
                                marginLeft: "10px",
                                fontSize: "20px",
                                cursor: "help",
                              }}
                            >
                              {isCorrect ? "✅" : "❌"}
                            </span>
                          )}
                        </div>

                        {userInput.length > 0 && (
                          <div
                            style={{
                              marginTop: "5px",
                              padding: "5px",
                              background: "#f5f5f5",
                              borderRadius: "5px",
                              minHeight: "30px",
                              maxWidth: "500px",
                              wordBreak: "break-word",
                            }}
                          >
                            {renderComparison(userInput, sentence)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flashcard-controls">
        <button onClick={goToPrevious} disabled={currentIndex === 0}>
          ⬅ Previous
        </button>
        <button onClick={toggleDetails}>
          {showDetails ? "Hide" : "Show"}
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
