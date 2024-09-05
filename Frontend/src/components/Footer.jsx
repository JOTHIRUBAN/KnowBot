import React from 'react';
import { Button } from './ui/button';

const Footer = () => {
  return (
    <footer className="bg-[#5b5858] text-white py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 pt-5">
  <div class=" p-4 ml-5 rounded flex flex-col justify-center items-center">
    <h3 class="text-xl font-bold mb-2 px-10  text-center">Empowering minds, one interaction at a time.</h3>
    
  </div>
  <div class=" p-4 rounded flex flex-col justify-center items-center">
  <div className="text-center mb-4 md:mb-0">
  <a href="mailto:KnowBot@example.com" className="bg-black py-2 z-50 px-3 rounded-l-lg text-white">
            Contact
          </a>
    <input class="w-[90] bg-white border  border-black p-2 rounded-r-lg" type="text" placeholder="KnowBot@gmail.com" />
          
          
     </div>
  </div>
  <div className=" p-4 rounded flex flex-col justify-center pr-20 items-center">
  <h3 className="text-xl font-bold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-white z-50 hover:text-gray-400"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-white z-50 hover:text-gray-400"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-white hover:text-gray-400"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="text-white hover:text-gray-400"><i className="fab fa-instagram"></i></a>
          </div>
  </div>
</div>

      {/* Divider Line */}
      <hr className="border-white-600 my-4" />

      {/* Rights Reserved */}
      <div className="text-center text-md font-bold">
        <p>&copy; 2024 KnowBOT. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
