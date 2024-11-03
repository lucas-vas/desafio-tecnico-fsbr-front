import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RegisterCar } from '../../../interfaces/car';
import { Brand } from '../../../interfaces/brand';
import { useGetAllBrandsQuery } from '../../../services/endpoints/brandEndpoints';
import { useRegisterCarMutation } from '../../../services/endpoints/carEndpoints';

const { Title } = Typography;
const { Option } = Select;

const RegisterCarComponent: React.FC = () => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const { data: responseBrands } = useGetAllBrandsQuery();
  const [registerCar] = useRegisterCarMutation();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const carData: RegisterCar = {
      modelDescription: values.modelDescription,
      year: values.year,
      value: values.value,
      brandId: selectedBrandId
    };

    const { data } = await registerCar(carData);
    
    if (data?.succeeded){
      message.success('Carro cadastrado com sucesso!');
      form.resetFields();
      navigate('/home/list-car');
    }

  };

  useEffect(() => {
    if (responseBrands) {
      setBrands(responseBrands.data);
    }
  }, [responseBrands]);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto'}}>
      <Title level={2}>Cadastrar Carro</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Descrição do modelo"
          name="modelDescription"
          rules={[{ required: true, message: 'Por favor, insira a descrição do modelo!' }]}
        >
          <Input placeholder="Descrição do modelo" />
        </Form.Item>
        <Form.Item
          label="Ano"
          name="year"
          rules={[{ required: true, message: 'Por favor, insira o ano!' }]}
        >
          <Input type="number" placeholder="Ano" />
        </Form.Item>
        <Form.Item
          label="Valor"
          name="value"
          rules={[{ required: true, message: 'Por favor, insira o valor!' }]}
        >
          <Input type="number" placeholder="Valor em reais" prefix="R$" />
        </Form.Item>
        <Form.Item
          label="Marca"
          name="brand"
          rules={[{ required: true, message: 'Por favor, selecione uma marca!' }]}
        >
          <Select
          placeholder="Selecione a marca"
          onChange={setSelectedBrandId}
        >
          {brands.map((brand) => (
            <Option key={brand.id} value={brand.id}>
              {brand.name}
            </Option>
          ))}
        </Select>
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

export default RegisterCarComponent;
