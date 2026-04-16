import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Book from './components/Book';
import Success from './components/Success';

function App() {
  return (
    <Router>
      <header>
        <Link to="/"><h1>Campus<span>Escapes</span></h1></Link>
        <nav>
          <Link to="/">Home</Link>
          <a href="/#trips">Trips</a>
        </nav>
      </header>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:tripId" element={<Book />} />
        <Route path="/success" element={<Success />} />
      </Routes>

      <footer>
        <p>&copy; 2026 CampusEscapes. All rights reserved.</p>
      </footer>
    </Router>
  );
}

export default App;
