import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UploadImage() {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    setIsUploading(true);
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('img', file);

    try {
      // Send the file to the backend
      // Send the file to the backend
await axios.post('http://localhost:5000/api/uploadimg', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true
  });

      // Navigate to the chat interface after successful upload
      setIsUploading(false);
      navigate('/chat-img');
    } catch (error) {
      console.error('Error uploading the file:', error);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-60 flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center space-y-4">
        {!isUploading ? (
          <>
            <h1 className="text-2xl font-bold">Upload your Image</h1>
            <input
              type="file"
              accept="application/image"
              onChange={handleFileUpload}
              className="px-4 py-3 w-64 text-center bg-gray-800 text-white rounded-lg border-2 border-gray-600 cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
            />
          </>
        ) : (
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        )}
      </div>
    </div>
  );
}

export default UploadImage;
