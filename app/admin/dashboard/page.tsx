"use client"

import withAuth from '../../hoc/withAuth';

const Admin = () => {
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome to the admin panel!</p>
    </div>
  );
};

export default withAuth(Admin, 'admin');
