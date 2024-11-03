import React from 'react';
import { Layout, Menu, theme, Typography } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
    localStorage.removeItem('token');
  };

  const currentPath = location.pathname;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Menu theme="dark" mode="horizontal" style={{ flex: 1, minWidth: 0 }} selectedKeys={[currentPath]}>
          <Menu.Item key="/home" onClick={() => handleNavigate('/home')}>
            Home
          </Menu.Item>
          <Menu.Item key="/home/list-car" onClick={() => handleNavigate('/home/list-car')}>
            Sessão Carro
          </Menu.Item>
          <Menu.Item key="/home/list-brand" onClick={() => handleNavigate('/home/list-brand')}>
            Sessão Marca
          </Menu.Item>
        </Menu>
        <Menu theme="dark" mode="horizontal" style={{ marginLeft: 'auto' }}>
          <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
            Sair
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 48px', marginTop: 64 }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 'calc(100vh - 100px - 100px)',
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {currentPath === '/home' ? (
            <div
              style={{
                background: colorBgContainer,
                minHeight: 'calc(100vh - 124px - 124px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Title level={3}>Bem-vindo à home!</Title>
              <Title level={4}>Sistema criado para controle de carros e marcas</Title>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        ©{new Date().getFullYear()} Criado por Lucas Vasconcelos
      </Footer>
    </Layout>
  );
};

export default HomePage;
