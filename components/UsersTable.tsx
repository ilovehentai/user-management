"use client";

import { useState } from 'react';
import { Table, Button, InputNumber, Modal, Switch, Form, Input, message } from 'antd';
import type { User, EditUserFormData } from '@/lib/types';
import { updateUserPayment } from '@/lib/api';

export default function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [changedUsers, setChangedUsers] = useState<Set<number>>(new Set());
  const [originalData, setOriginalData] = useState<Map<number, Pick<User, 'newPayment' | 'percentageIncrease'>>>(new Map());
  const [form] = Form.useForm();

  const handlePaymentChange = (value: number | null, record: User) => {
    if (!value) return;
    if (!changedUsers.has(record.id)) {
      setOriginalData(prev => new Map(prev).set(record.id, {
        newPayment: record.newPayment,
        percentageIncrease: record.percentageIncrease
      }));
      setChangedUsers(prev => new Set(prev).add(record.id));
    }
    const percentageIncrease = ((value - record.payment) / record.payment) * 100;
    setUsers(users.map(user => 
      user.id === record.id 
        ? { ...user, newPayment: value, percentageIncrease }
        : user
    ));
  };

  const handlePercentageChange = (value: number | null, record: User) => {
    if (!value) return;
    if (!changedUsers.has(record.id)) {
      setOriginalData(prev => new Map(prev).set(record.id, {
        newPayment: record.newPayment,
        percentageIncrease: record.percentageIncrease
      }));
      setChangedUsers(prev => new Set(prev).add(record.id));
    }
    const newPayment = record.payment * (1 + value / 100);
    setUsers(users.map(user => 
      user.id === record.id 
        ? { ...user, newPayment, percentageIncrease: value }
        : user
    ));
  };

  const handleSaveChanges = async () => {
    try {
      const promises = Array.from(changedUsers).map(userId => {
        const user = users.find(u => u.id === userId);
        if (!user) return Promise.resolve();
        return updateUserPayment(userId, {
          newPayment: user.newPayment,
          percentageIncrease: user.percentageIncrease
        });
      });

      await Promise.all(promises);
      message.success('Changes saved successfully');
      setChangedUsers(new Set());
      setOriginalData(new Map());
    } catch (error) {
      message.error('Failed to save changes');
    }
  };

  const handleCancelChanges = () => {
    setUsers(users.map(user => {
      const originalValues = originalData.get(user.id);
      if (originalValues) {
        return { ...user, ...originalValues };
      }
      return user;
    }));
    setChangedUsers(new Set());
    setOriginalData(new Map());
  };

  const showEditModal = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue(record);
  };

  const handleEdit = (values: EditUserFormData) => {
    if (!editingUser) return;
    setUsers(users.map(user => 
      user.id === editingUser.id 
        ? { ...user, ...values }
        : user
    ));
    setEditingUser(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Switch checked={active} disabled />
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      key: 'payment',
      render: (payment: number) => `$${payment.toFixed(2)}`,
    },
    {
      title: 'New Payment',
      dataIndex: 'newPayment',
      key: 'newPayment',
      render: (newPayment: number, record: User) => (
        <InputNumber
          value={newPayment}
          onChange={(value) => handlePaymentChange(value, record)}
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        />
      ),
    },
    {
      title: 'Increase %',
      dataIndex: 'percentageIncrease',
      key: 'percentageIncrease',
      render: (percentageIncrease: number, record: User) => (
        <InputNumber
          value={percentageIncrease}
          onChange={(value) => handlePercentageChange(value, record)}
          formatter={(value) => `${value}%`}
          parser={(value) => value!.replace('%', '')}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Button type="primary" onClick={() => showEditModal(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="relative">
      <Table 
        dataSource={users} 
        columns={columns} 
        rowKey="id"
        pagination={false}
      />

      {changedUsers.size > 0 && (
        <div className="fixed bottom-8 right-8 bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex gap-4">
          <Button type="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
          <Button onClick={handleCancelChanges}>
            Cancel
          </Button>
        </div>
      )}

      <Modal
        title="Edit User"
        open={!!editingUser}
        onOk={() => form.submit()}
        onCancel={() => {
          setEditingUser(null);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEdit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="active"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="payment"
            label="Payment"
            rules={[{ required: true, message: 'Please input the payment!' }]}
          >
            <InputNumber
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}