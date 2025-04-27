import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Flashcards from './components/Flashcards';
import AddFlashcard from './components/AddFlashcard';
import ListFlashcards from "./components/ListFlashcards";
import EditFlashcard from "./components/EditFlashcard";
import './App.css'; // Import CSS file

const App = () => {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li>
              <Link to="/flashcards" className="nav-link">Flashcards</Link>
            </li>
            <li>
              <Link to="/add-flashcard" className="nav-link">Add Flashcard</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/" element={<ListFlashcards />} />
          <Route path="/add-flashcard" element={<AddFlashcard />} />
          <Route path="/edit/:id" element={<EditFlashcard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
