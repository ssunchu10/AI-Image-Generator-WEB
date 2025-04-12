import React from 'react';
import ImageGenerator from './components/ImageGenerator';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Visionary Brush</h1>
      </header>
      <main>
        <ImageGenerator />
      </main>
      <footer>
        <p>Powered by DALL-E Mini API</p>
      </footer>
    </div>
  );
}

export default App;