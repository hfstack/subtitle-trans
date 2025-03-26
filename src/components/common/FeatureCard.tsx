import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
  link: string;
};

const FeatureCard = ({ title, description, icon, link }: FeatureCardProps) => {
  return (
    <Link 
      href={link}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 mb-4 relative">
        <Image 
          src={icon} 
          alt={title}
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
};

export default FeatureCard; 