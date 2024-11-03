import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Typography, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpdateCar } from '../../../interfaces/car';
import { Brand } from '../../../interfaces/brand';
import { useGetAllBrandsQuery } from '../../../services/endpoints/brandEndpoints';
import { useUpdateCarMutation } from '../../../services/endpoints/carEndpoints';

const { Title } = Typography;
const { Option } = Select;

const UpdateCarComponent: React.FC = () => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [carId, setCarId] = useState<string>('');

  const { state } = useLocation();
  const { data: responseBrands } = useGetAllBrandsQuery();
  const [updateCar] = useUpdateCarMutation();
  const navigate = useNavigate();

  const car = state as UpdateCar;

  useEffect(() => {
    if (responseBrands) {
      setBrands(responseBrands.data);
    }
  }, [responseBrands]);

  useEffect(() => {
    if (car) {
      const { id, modelDescription, year, value, brandId } = car;
      setCarId(id);

      form.setFieldsValue({
        modelDescription,
        year,
        value,
        brand: brandId,
      });
      setSelectedBrandId(brandId);
    }
  }, [car, form]);

  const onFinish = async (values: any) => {
    const carData: UpdateCar = {
      id: carId,
      modelDescription: values.modelDescription,
      year: values.year,
      value: values.value,
      brandId: selectedBrandId,
    };

    const data = await updateCar(carData);
    if (data.data?.succeeded){
        message.success('Carro atualizado com sucesso!');
        form.resetFields();
        navigate('/home/list-car');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto'}}>
      <Title level={2}>Editar Carro {car.modelDescription}</Title>
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
            Atualizar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateCarComponent;
