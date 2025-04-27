import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const ListFlashcards = () => {
  const [flashcards, setFlashcards] = useState([]);

  const fetchFlashcards = async () => {
    const querySnapshot = await getDocs(collection(db, "flashcards"));
    const cards = [];
    querySnapshot.forEach((doc) => {
      cards.push({ id: doc.id, ...doc.data() });
    });
    setFlashcards(cards);
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá không?")) {
      await deleteDoc(doc(db, "flashcards", id));
      fetchFlashcards();
    }
  };

  return (
    <div className="container">
      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Word</th>
            <th>Note</th>
            <th>Image</th>
            <th>Examples</th>
            <th></th> {/* Action icons */}
          </tr>
        </thead>
        <tbody>
          {flashcards.map((card) => (
            <tr key={card.id}>
              <td>{card.word}</td>
              <td dangerouslySetInnerHTML={{ __html: card.note }} />
              <td>
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.word}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
              </td>
              <td>
                <ul style={{ paddingLeft: "20px" }}>
                  {card.examples?.map((ex, idx) => (
                    <li key={idx}>{ex.sentence}</li>
                  ))}
                </ul>
              </td>
              <td style={{ textAlign: "center" }}>
                <Link to={`/edit/${card.id}`}>
                  <FaEdit style={{ cursor: "pointer", marginRight: "10px" }} />
                </Link>
                <FaTrash
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => handleDelete(card.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListFlashcards;
