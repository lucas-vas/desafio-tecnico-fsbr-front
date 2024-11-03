import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { Brand } from '../../../interfaces/brand';
import { useUpdateBrandMutation } from '../../../services/endpoints/brandEndpoints';

const { Title } = Typography;

const UpdateBrandComponent: React.FC = () => {
  const [form] = Form.useForm();
  const [brandId, setBrandId] = useState<string>('');
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const brand = state as Brand;

  const [updateBrand] = useUpdateBrandMutation();

  useEffect(() => {
    if (brand) {
      const { id, name } = brand;
      setBrandId(id);
      form.setFieldsValue({ name });
    }
  }, [brand, form]);

  const onFinish = async (values: any) => {
    const updatedBrand: Brand = {
      id: brandId,
      name: values.name,
    };

    const data = await updateBrand(updatedBrand);
    if (data.data?.succeeded) {
      message.success('Marca atualizada com sucesso!');
      form.resetFields();
      navigate('/home/list-brand');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <Title level={2}>Editar Marca {brand?.name}</Title>
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
            Atualizar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateBrandComponent;
