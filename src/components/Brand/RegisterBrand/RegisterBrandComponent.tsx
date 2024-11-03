import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RegisterBrand } from '../../../interfaces/brand';
import { useRegisterBrandMutation } from '../../../services/endpoints/brandEndpoints';

const { Title } = Typography;

const RegisterBrandComponent: React.FC = () => {
  const [form] = Form.useForm();
  const [registerBrand] = useRegisterBrandMutation();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const brandData: RegisterBrand = {
      name: values.name
    };

    const { data } = await registerBrand(brandData);

    if (data?.succeeded) {
      message.success('Marca cadastrada com sucesso!');
      form.resetFields();
      navigate('/home/list-brand');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <Title level={2}>Cadastrar Marca</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Nome da Marca"
          name="name"
          rules={[{ required: true, message: 'Por favor, insira o nome da marca!' }]}
        >
          <Input placeholder="Nome da Marca" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
          >
            Cadastrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterBrandComponent;
