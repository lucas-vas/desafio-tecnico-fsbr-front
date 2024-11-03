import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Button, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Car, UpdateCar } from '../../../interfaces/car';
import { Brand } from '../../../interfaces/brand';
import { useDeleteCarMutation, useGetAllCarsQuery, useLazyGetAllCarsWithFilterQuery } from '../../../services/endpoints/carEndpoints';
import { useGetAllBrandsQuery } from '../../../services/endpoints/brandEndpoints';

const { Title } = Typography;
const { Option } = Select;

const ListCarComponent: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [year, setYear] = useState<number>();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>();
  const [cars, setCars] = useState<Car[]>([]);

  const { data: responseCars, refetch: refetchGetAllCars } = useGetAllCarsQuery();
  const { data: responseBrands, refetch: refetchGetAllBrands } = useGetAllBrandsQuery();
  const [getCarsFiltered, { data: responseCarsFiltered }] = useLazyGetAllCarsWithFilterQuery();
  const [deleteCar] = useDeleteCarMutation();
  const navigate = useNavigate();

  const handleSearch = async () => {
    await getCarsFiltered({ modelDescription: description, year, brandId: selectedBrandId });
  };

  useEffect(() => {
    refetchGetAllCars();
  }, [refetchGetAllCars]);

  useEffect(() => {
    refetchGetAllBrands();
  }, [refetchGetAllBrands]);

  useEffect(() => {
    if (responseBrands) {
      setBrands(responseBrands.data);
    }
  }, [responseBrands]);

  useEffect(() => {
    if (responseCars) {
      setCars(responseCars.data);
    }
  }, [responseCars]);

  useEffect(() => {
    if (responseCarsFiltered) {
      setCars(responseCarsFiltered.data);
    }
  }, [responseCarsFiltered]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleEdit = (car: Car) => {
    const updateCar: UpdateCar = {
      id: car.id,
      brandId: car.brandId,
      modelDescription: car.modelDescription,
      value: car.value,
      year: car.year
    }

    navigate(`/home/update-car/${car.modelDescription}`, { state: updateCar })
  };

  const handleDelete = async (car: Car) => {
    var data = await deleteCar({ carId: car.id });

    if (data.data?.succeeded){
      message.success(`Carro ${car.modelDescription} deletado com sucesso`)
      refetchGetAllCars();
    }
  };

  return (
    <div>
      <Title level={2}>Lista de Carros</Title>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <Input
          placeholder="Descrição do modelo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: 200, marginRight: '10px' }}
        />
        <Input
          placeholder="Ano"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ width: 100, marginRight: '10px' }}
        />
        <Select
          placeholder="Selecione a marca"
          onChange={setSelectedBrandId}
          style={{ width: 200, marginRight: '10px' }}
        >
          <Option value={undefined} style={{ color: '#bfbfbf' }}>
            Selecione uma marca
          </Option>
          {brands.map((brand) => (
            <Option key={brand.id} value={brand.id}>
              {brand.name}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={handleSearch}
          icon={<SearchOutlined />}
        >
          Pesquisar
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/home/register-car')}
          style={{ marginLeft: '10px' }}
        >
          Cadastrar Carro
        </Button>
      </div>
      <Table
        dataSource={cars}
        columns={[
          { title: 'Modelo', dataIndex: 'modelDescription', key: 'modelDescription' },
          { title: 'Ano', dataIndex: 'year', key: 'year' },
          { title: 'Marca', dataIndex: 'brandName', key: 'brandName' },
          {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            render: (text) => formatCurrency(text),
          },
          {
            title: 'Ações',
            key: 'actions',
            render: (text, record: Car) => (
              <div>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                  style={{ marginRight: '10px' }}
                />
                <Popconfirm
                  title="Tem certeza que deseja excluir este carro?"
                  onConfirm={() => handleDelete(record)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Button icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            ),
          },
        ]}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default ListCarComponent;
