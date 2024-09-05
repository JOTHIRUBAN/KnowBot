import React, { useState } from 'react';

const Card = ({ name, position, image, quote, twitterLink, linkedinLink, githubLink, webpageLink }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="relative h-72 w-60 rounded-lg bg-gray-800 text-center p-8 shadow-lg">
      <div className={`transition-all duration-500 ease-in-out ${isVisible ? 'opacity-0 transform translate-y-[-100%]' : 'opacity-100 translate-y-0'}`}>
        <img className="w-32 h-32 mx-auto rounded-full border-2 border-gray-400" src={image} alt={name} />
        <div className="mt-4">
          <p className="font-bold text-white">{name}</p>
          <p className="italic text-gray-400">{position}</p>
        </div>
      </div>
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
        <p className="font-bold text-white">{name}</p>
        <q className="text-gray-400">{quote}</q>
        <ul className="flex gap-4 mt-4">
          {twitterLink && (
            <li>
              <a href={twitterLink}  target="_blank">
                <i className="fa-brands fa-twitter fa-xl text-gray-300"></i>
              </a>
            </li>
          )}
          {linkedinLink && (
            <li>
              <a href={linkedinLink}   target="_blank">
                <i className="fa-brands fa-linkedin fa-xl text-gray-300"></i>
              </a>
            </li>
          )}
          {githubLink && (
            <li>
              <a href={githubLink}  target="_blank">
                <i className="fa-brands fa-github fa-xl text-gray-300"></i>
              </a>
            </li>
          )}
          {webpageLink && (
            <li>
              <a href={webpageLink}  target="_blank">
                <i className="fa-solid fa-globe fa-xl text-gray-300"></i>
              </a>
            </li>
          )}
        </ul>
      </div>
      <button
        onClick={handleToggle}
        className={`absolute left-[40%] top-[90%] text-center rounded-full w-12 h-12 transition-all duration-500 ${isVisible ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'}`}
      >
        <i className={`fa-solid ${isVisible ? 'fa-xmark' : 'fa-plus'} text-white transition-transform duration-500 ${isVisible ? 'rotate-45' : ''}`}></i>
      </button>
    </div>
  );
};

export default Card;
