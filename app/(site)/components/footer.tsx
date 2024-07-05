import React from 'react';

export function Footer() {
  return (
    <footer className="flex p-20 mt-8 justify-center items-center">
      <div className="mx-auto text-center ">
        &copy; Робожуки, {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;