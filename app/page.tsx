'use client';

import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface UserData {
  key: string;
  name: string;
  email: string;
  active: boolean;
  payment: number;
  newPayment: number;
  percentageIncrease: number;
}

const initialData: UserData[] = [
  {
    key: '1',
    name: 'John Doe',
    email: 'john@example.com',
    active: true,
    payment: 1000,
    newPayment: 1000,
    percentageIncrease: 0,
  },
  {
    key: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    active: true,
    payment: 2000,
    newPayment: 2000,
    percentageIncrease: 0,
  },
];

export default function Home() {
  const [data, setData] = useState<UserData[]>(initialData);
  const [editingKey, setEditingKey] = useState<string>('');
  const [form] = Form.useForm();

  const handleNewPaymentChange = (value: number, record: UserData) => {
    const percentageIncrease = ((value - record.payment) / record.payment) * 100;
    const newData = [...data];
    const index = newData.findIndex((item) => record.key === item.key);
    newData[index] = {
      ...record,
      newPayment: value,
      percentageIncrease: Number(percentageIncrease.toFixed(2)),
    };
    setData(newData);
  };

  const handlePercentageChange = (value: number, record: UserData) => {
    const newPayment = record.payment * (1 + value / 100);
    const newData = [...data];
    const index = newData.findIndex((item) => record.key === item.key);
    newData[index] = {
      ...record,
      newPayment: Number(newPayment.toFixed(2)),
      percentageIncrease: value,
    };
    setData(newData);
  };

  const columns: ColumnsType<UserData> = [
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
      title: 'Current Payment',
      dataIndex: 'payment',
      key: 'payment',
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: 'New Payment',
      dataIndex: 'newPayment',
      key: 'newPayment',
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => handleNewPaymentChange(Number(val), record)}
          prefix="$"
          step={100}
        />
      ),
    },
    {
      title: 'Increase %',
      dataIndex: 'percentageIncrease',
      key: 'percentageIncrease',
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => handlePercentageChange(Number(val), record)}
          suffix="%"
          step={1}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleEdit = (record: UserData) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
  };

  const handleCancel = () => {
    setEditingKey('');
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => editingKey === item.key);
      newData[index] = { ...newData[index], ...values };
      setData(newData);
      setEditingKey('');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users Management</h1>
      <Table columns={columns} dataSource={data} pagination={false} />
      
      <Modal
        title="Edit User"
        open={!!editingKey}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
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
              { type: 'email', message: 'Please input a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="active" valuePropName="checked" label="Active">
            <Input type="checkbox" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}