import React from 'react';

export function Footer() {
  return (
    <footer className=" p-20 mt-8">
      <div className="container mx-auto text-center">
        &copy; Робожуки, {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;