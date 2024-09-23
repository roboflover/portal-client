import React from 'react';

export function Footer() {
  return (
    <footer className="flex p-20 mt-8 justify-center items-center">
      <div className="mx-auto text-center ">
        <div className="text-sm my-5">
          <p>Реквизиты</p>
          <p>ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ГРИГОРЯН СТЕПАН НИКОЛАЕВИЧ</p>
          <p>ИНН 770372636777</p>
          <p>ОГРН/ОГРНИП 323774600632191</p>
        </div>
        <span className='bolt'>&copy; Сервис 3D печати Робожук, {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};

export default Footer;