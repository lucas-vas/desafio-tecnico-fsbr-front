import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Brand } from '../../../interfaces/brand';
import { useDeleteBrandMutation, useGetAllBrandsQuery, useLazyGetAllBrandsWithFilterQuery } from '../../../services/endpoints/brandEndpoints';

const { Title } = Typography;

const ListBrandComponent: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [brands, setBrands] = useState<Brand[]>([]);

  const { data: responseBrands, refetch: refetchGetAllBrands } = useGetAllBrandsQuery();
  const [getBrandsFiltered, { data: responseBrandsFiltered }] = useLazyGetAllBrandsWithFilterQuery();
  const [deleteBrand] = useDeleteBrandMutation();
  const navigate = useNavigate();

  const handleSearch = async () => {
    await getBrandsFiltered({ name });
  };

  useEffect(() => {
    refetchGetAllBrands();
  }, [refetchGetAllBrands]);

  useEffect(() => {
    if (responseBrands) {
      setBrands(responseBrands.data);
    }
  }, [responseBrands]);

  useEffect(() => {
    if (responseBrandsFiltered) {
      setBrands(responseBrandsFiltered.data);
    }
  }, [responseBrandsFiltered]);

  const handleEdit = (brand: Brand) => {
    navigate(`/home/update-brand/${brand.name}`, { state: brand });
  };

  const handleDelete = async (brand: Brand) => {
    const data = await deleteBrand({ brandId: brand.id });

    if (data.data?.succeeded) {
      message.success(`Marca ${brand.name} deletada com sucesso`);
      refetchGetAllBrands();
    }
  };

  return (
    <div>
      <Title level={2}>Lista de Marcas</Title>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <Input
          placeholder="Nome da Marca"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: 300, marginRight: '10px' }}
        />
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
          onClick={() => navigate('/home/register-brand')}
          style={{ marginLeft: '10px' }}
        >
          Cadastrar Marca
        </Button>
      </div>
      <Table
        dataSource={brands}
        columns={[
          { title: 'Nome', dataIndex: 'name', key: 'name' },
          {
            title: 'Ações',
            key: 'actions',
            render: (text, record: Brand) => (
              <div>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                  style={{ marginRight: '10px' }}
                />
                <Popconfirm
                  title="Tem certeza que deseja excluir esta marca?"
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

export default ListBrandComponent;
