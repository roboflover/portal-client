// components/Sidebar.tsx
import Link from 'next/link';

export const Sidebar = () => {
  return (
    <div className="h-full bg-gray-900 text-white w-64 flex flex-col">
      <div className="p-4 text-xl font-bold">Admin Panel</div>
      <nav className="flex-1">
        <ul>
          <li className="p-4 hover:bg-gray-700">
            <Link href="/admin/exhibitions">Exhibitions</Link>
          </li>
          {/* <li className="p-4 hover:bg-gray-700">
            <Link href="/admin/gallery">Gallery</Link>
          </li> */}
          <li className="p-4 hover:bg-gray-700">
            <Link href="/admin/projects">Проекты</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
