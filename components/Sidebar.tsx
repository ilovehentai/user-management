'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Layout, Menu } from 'antd';
import { UserOutlined, TableOutlined } from '@ant-design/icons';

const { Sider } = Layout;

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/',
      icon: <TableOutlined />,
      label: <Link href="/">Users Table</Link>,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link href="/profile">User Profile</Link>,
    },
  ];

  return (
    <Sider
      theme="light"
      className="min-h-screen border-r border-gray-200"
      width={200}
    >
      <div className="p-4 text-xl font-bold border-b border-gray-200">
        User Manager
      </div>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        className="h-full"
      />
    </Sider>
  );
}