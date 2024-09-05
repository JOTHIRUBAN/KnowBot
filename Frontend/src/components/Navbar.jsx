import React from "react";
import { Button } from "@/components/ui/button";

function Butt({ content, onClick }) {
  return (
    <Button 
      className="rounded-md bg-black text-white border border-white font-bold hover:bg-white hover:text-black"
      onClick={onClick}
    >
      {content}
    </Button>
  );
}

export default function Navbar({ scrollToSection }) {
  return (
    <div className="flex flex-row mx-auto justify-end px-15 mr-10 py-4 gap-4 pr-14 mt-[4px] space-x-4">
      <Butt content="Home" onClick={() => scrollToSection('home')} />
      <Butt content="Features" onClick={() => scrollToSection('features')} />
      <Butt content="Try Out" onClick={() => scrollToSection('try-out')} />
      <Butt content="Team" onClick={() => scrollToSection('team')} />
      <Butt content="Contact" onClick={() => scrollToSection('contact')} />
    </div>
  );
}
