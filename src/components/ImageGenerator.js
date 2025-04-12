import React, { useState, useEffect, useRef } from 'react';
import './ImageGenerator.css';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [error, setError] = useState(null);
  
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLoadingPercentage(0);
      const updateInterval = 1200; 
      const incrementPerUpdate = 1; 
      
      progressIntervalRef.current = setInterval(() => {
        setLoadingPercentage(prevPercentage => {
          return prevPercentage < 95 ? prevPercentage + incrementPerUpdate : prevPercentage;
        });
      }, updateInterval);

      const response = await fetch('https://ai-image-generator-mg75.onrender.com/openai/generateimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
      
      setLoadingPercentage(100);
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.success && data.images && data.images.length > 0) {
        setImage(data.images[0]);
      } else {
        throw new Error('No images returned');
      }
    } catch (err) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      setError(err.message);
      console.error('Error generating image:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setLoadingPercentage(0), 500);
    }
  };

  return (
    <div className="image-generator">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt for image generation..."
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>

      <div className="image-container">
        {loading ? (
          <div className="loading">
            <p>Generating your image... {loadingPercentage}%</p>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${loadingPercentage}%` }}
              ></div>
            </div>
            <div className="spinner"></div>
          </div>
        ) : image ? (
          <div className="result">
            <img 
              src={`data:image/png;base64,${image}`} 
              alt={prompt} 
            />
            <p className="prompt-text">"{prompt}"</p>
          </div>
        ) : (
          <div className="placeholder">
            <p>Your generated image will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;