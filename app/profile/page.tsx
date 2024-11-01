'use client';

import { Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const currentUser = {
  name: 'John Doe',
  email: 'john@example.com',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export default function Profile() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <Card>
        <div className="flex items-center space-x-6">
          <Avatar
            size={96}
            src={currentUser.imageUrl}
            icon={<UserOutlined />}
          />
          <div>
            <h2 className="text-xl font-semibold">{currentUser.name}</h2>
            <p className="text-gray-600">{currentUser.email}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}