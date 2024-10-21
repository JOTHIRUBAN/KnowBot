import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@material-tailwind/react';

const YOUTUBE_API_KEY = 'AIzaSyCvU2GHxWziKhYd1wngvtJvsOEmafQVUlo'; // Replace with your YouTube API key

function UploadLink() {
  const [isUploading, setIsUploading] = useState(false);
  const [inputData, setInput] = useState("");  // Search query input
  const [videoResults, setVideoResults] = useState([]);  // Stores fetched video results
  const navigate = useNavigate();

  // Function to handle searching videos from YouTube API
  const handleSearch = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: inputData,  // Search query entered by the user
          type: 'video',
          maxResults: 15,  // Limit to 5 video results for simplicity
          key: YOUTUBE_API_KEY
        }
      });
      setVideoResults(response.data.items);  // Set video results to state
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    }
  };

  // Function to handle uploading the selected video link
  const handleLinkUpload = async (videoId) => {
    setIsUploading(true);
    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    console.log('Selected video link:', videoLink);
    try {
      // Send the selected video link to the backend
      const response = await axios.post('http://localhost:5000/api/uploadLink', {
        "link": videoLink,
      });

      // Navigate to the chat interface after successful upload
      setIsUploading(false);
      navigate('/chatLink', { state: { summary: response.data } });
    } catch (error) {
      console.error('Error uploading the video link:', error);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-60 flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center space-y-4">
        {!isUploading ? (
          <>
            <h1 className="text-2xl font-bold">Search YouTube Videos</h1>
            <input
              type="text"
              placeholder="Enter query to search videos..."
              onChange={(e) => setInput(e.target.value)}
              className="px-4 py-3 w-64 text-center bg-gray-800 text-white rounded-lg border-2 border-gray-600 cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
            />
            <Button className='px-3' onClick={handleSearch}>
              Search
            </Button>

            {/* Scrollable container for video results */}
            <div className="video-results mt-4 w-full max-h-80 overflow-y-scroll">
              {videoResults.map(video => (
                <div key={video.id.videoId} className="flex flex-col items-center mb-4">
                  <img
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                    className="w-64 h-36"
                  />
                  <p className="mt-2 text-lg">{video.snippet.title}</p>
                  <Button
                    className='mt-2'
                    onClick={() => handleLinkUpload(video.id.videoId)}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        )}
      </div>
    </div>
  );
}

export default UploadLink;
