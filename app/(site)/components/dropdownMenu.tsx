// DropdownMenu.tsx
import { Menu } from '@headlessui/react';
import Link from 'next/link';

const DropdownMenu = () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Продукция
        </Menu.Button>
      </div>

      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <Link href="/product/3d-printing">
                <a className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : 'text-gray-700'}`}>
                  3д печать
                </a>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link href="/product/exhibition">
                <a className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : 'text-gray-700'}`}>
                  Выставка
                </a>
              </Link>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default DropdownMenu;
