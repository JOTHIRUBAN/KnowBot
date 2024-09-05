import React from 'react';
import Card from './Card';

const teamMembers = [
  {
    name: 'Prof K Vani',
    position: 'Mentor',
    image: '../../public/images/team/Vani_IST.png',
    quote:'Professor in the Dept of IST at Anna University, specializing in image processing, remote sensing, and IoT',
    webpageLink: 'https://www.bing.com/ck/a?!&&p=a85b221f06201320JmltdHM9MTcyMjY0MzIwMCZpZ3VpZD0zZDhiNGZiZi1kYzc3LTY1YzEtMGVkZi01YzQ5ZGRjNTY0NTImaW5zaWQ9NTIwNw&ptn=3&ver=2&hsh=3&fclid=3d8b4fbf-dc77-65c1-0edf-5c49ddc56452&psq=professor+vani+ceg&u=a1aHR0cHM6Ly9hbm5hdW5pdi5pcmlucy5vcmcvcHJvZmlsZS8xMTc4NzQ&ntb=1',
  },
  {
    name: 'Vijay K G',
    position: 'Developer',
    image: '../../public/images/team/Vijay.jpg',
    quote: '',
    linkedinLink : 'https://www.linkedin.com/in/vijay-k-g-42634526b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    githubLink: '',


    
  },
  {
    name: 'Deepak Chandhru N',
    position: 'Developer',
    image: '../../public/images/team/Deepak.jpg',
    quote: '',
    linkedinLink : 'https://www.linkedin.com/in/deepak-chandhru?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    githubLink: '',
  },
  {
    name: 'Jothiruban',
    position: 'Developer',
    image: '../../public/images/team/Jothiruban.jpg',
    quote: '',
    linkedinLink : 'https://www.linkedin.com/in/jothiruban-m-843755251/',
    githubLink: '',
  },
];

const Team = () => {
  return (
    <div className="bg-black bg-opacity-90 py-14 px-8">
      <div className="container mx-auto mb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Meet the Team</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {/* Senior Card */}
          <div className="flex justify-center lg:col-span-2">
            {teamMembers.filter(member => member.position === 'Mentor').map((member, index) => (
              <Card
              key={index}
                name={member.name}
                position={member.position}
                image={member.image}
                quote={member.quote}
                twitterLink={member.twitterLink}
                linkedinLink={member.linkedinLink}
                githubLink={member.githubLink}
                webpageLink={member.webpageLink}
              />
            ))}
          </div>

          {/* Junior Cards */}
          <div className='flex pt-8 justify-center space-x-14 lg:col-span-2'>
            {teamMembers.filter(member => member.position !== 'Mentor').map((member, index) => (
              <Card
              key={index}
              name={member.name}
              position={member.position}
              image={member.image}
              quote={member.quote}
              twitterLink={member.twitterLink}
              linkedinLink={member.linkedinLink}
              githubLink={member.githubLink}
              webpageLink={member.webpageLink}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
