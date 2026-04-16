import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import FeedbackList from './components/FeedbackList';
import FeedbackForm from './components/FeedbackForm';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Header />
        <main className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
          <Routes>
            <Route path="/" element={<FeedbackList />} />
            <Route path="/submit" element={<FeedbackForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
