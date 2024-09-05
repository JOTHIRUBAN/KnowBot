import React, { useState } from "react";

const DocumentPage = () => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    setFile(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="flex h-screen">
      {/* Left Component: File Upload */}
      <div className="w-1/5 bg-gray-200 p-4">
        <button className="bg-purple-500 text-white rounded-full px-4 py-2 mb-4">
          Upload document
        </button>
        <input
          type="file"
          onChange={handleFileUpload}
          className="mt-4"
          accept="application/pdf"
        />
        {file && (
          <div className="mt-4 bg-white p-4 rounded shadow">
            <p className="text-purple-500">JLB-3.1.pdf</p>
            <p>08/21/2024 21:17 PM</p>
          </div>
        )}
      </div>

      {/* Middle Component: Document Display */}
      <div className="w-3/5 bg-gray-100 p-4 overflow-auto">
        {file ? (
          <iframe
            src={file}
            title="Document Preview"
            className="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No document selected</p>
          </div>
        )}
      </div>

      {/* Right Component: Chatbot UI */}
      <div className="w-1/5 bg-white p-4 flex flex-col">
        <div className="flex-grow">
          <div className="bg-gray-200 rounded p-4 mb-4">
            <p className="text-gray-700">what is the third line of question 1</p>
          </div>
          <div className="bg-purple-100 rounded p-4">
            <p className="text-purple-700">
              The third line of question 1 is: <br />
              <code>for(int i=1;i&lt;16;i+=2)</code>
            </p>
          </div>
        </div>
        <input
          type="text"
          placeholder="Type your message..."
          className="border-t border-gray-300 px-4 py-2 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default DocumentPage;
