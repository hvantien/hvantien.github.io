import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase"; // Đảm bảo đường dẫn này chính xác
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const ListFlashcards = () => {
  const [flashcards, setFlashcards] = useState([]);

  // Hàm fetchFlashcards không cần thay đổi nhiều vì nó lấy tất cả dữ liệu
  // và chúng ta sẽ chỉ chọn hiển thị word và note.
  const fetchFlashcards = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "flashcards"));
      const cards = [];
      querySnapshot.forEach((doc) => {
        // Dữ liệu từ doc.data() sẽ tự động chỉ chứa word và note
        // đối với các flashcard mới được thêm vào.
        // Các flashcard cũ hơn có thể vẫn chứa image và examples,
        // nhưng chúng ta sẽ không hiển thị chúng.
        cards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(cards);
    } catch (error) {
      console.error("Error fetching flashcards: ", error);
      // Bạn có thể thêm thông báo lỗi cho người dùng ở đây nếu muốn
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá flashcard này không?")) {
      try {
        await deleteDoc(doc(db, "flashcards", id));
        // Sau khi xóa, gọi lại fetchFlashcards để cập nhật danh sách
        fetchFlashcards();
        alert("Flashcard đã được xóa thành công!");
      } catch (error) {
        console.error("Error deleting flashcard: ", error);
        alert("Xóa flashcard thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="container" style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        List of Flashcards
      </h2>
      {flashcards.length === 0 ? (
        <p style={{ textAlign: "center" }}>No flashcards found. <Link to="/add">Add a new one!</Link></p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Word</th>
              <th style={{ width: "50%" }}>Note</th>
              <th style={{ width: "20%", textAlign: "center" }}>Actions</th> {/* Gộp các action lại */}
            </tr>
          </thead>
          <tbody>
            {flashcards.map((card) => (
              <tr key={card.id}>
                <td>{card.word || "N/A"}</td> {/* Hiển thị N/A nếu word không có */}
                {/* Sử dụng div bên trong td để giới hạn chiều cao và cho phép cuộn nếu note quá dài */}
                <td>
                  <div
                    dangerouslySetInnerHTML={{ __html: card.note || "No note available" }}
                    style={{ maxHeight: "100px", overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  />
                </td>
                {/* Loại bỏ cột Image và Examples */}
                <td style={{ textAlign: "center" }}>
                  <Link to={`/edit/${card.id}`} title="Edit Flashcard">
                    <FaEdit
                      style={{
                        cursor: "pointer",
                        marginRight: "15px", // Tăng khoảng cách
                        fontSize: "1.2em", // Tăng kích thước icon
                        color: "#007bff" // Màu cho icon edit
                      }}
                    />
                  </Link>
                  <FaTrash
                    title="Delete Flashcard"
                    style={{
                      cursor: "pointer",
                      color: "red",
                      fontSize: "1.2em" // Tăng kích thước icon
                    }}
                    onClick={() => handleDelete(card.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
       <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/add-flashcard" className="btn-add-new" style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '16px'
        }}>
          + Add New Flashcard
        </Link>
      </div>
    </div>
  );
};

export default ListFlashcards;