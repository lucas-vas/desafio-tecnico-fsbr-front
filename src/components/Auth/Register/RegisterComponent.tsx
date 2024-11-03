import React, { useState } from 'react';
import { Form, Input, Button, Typography, Tooltip, message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../../services/endpoints/authEndpoints';
import { User } from '../../../interfaces/user';

const { Title } = Typography;

const RegisterComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegister = async () => {
    const user: User = {
      email: email,
      password: password
    }

    const { data } = await registerUser(user);

    if ((data && data.status !== 400) || data === null){
      message.success('Cadastro realizado com sucesso')
      navigate('/');
    }
  };

  const emailIsValid = (email: string) => /\S+@\S+\.\S+/.test(email);

  const passwordIsValid = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return passwordRegex.test(password);
  };

  const isFormValid = () => emailIsValid(email) && passwordIsValid(password);

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '50px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Registrar-se</Title>
      <Form layout="vertical" onFinish={handleRegister}>
        <Form.Item 
          label="Email" 
          required 
          validateStatus={email && !emailIsValid(email) ? 'error' : undefined}
          help={email && !emailIsValid(email) ? 'Email inválido' : ''}
        >
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Digite seu email" 
          />
        </Form.Item>
        <Form.Item 
          label={
            <span>
              Senha&nbsp;
              <Tooltip title="A senha deve conter pelo menos 8 caracteres, 1 maiúsculo, 1 minúsculo, 1 número e 1 caractere especial.">
                <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
              </Tooltip>
            </span>
          } 
          required 
          validateStatus={password && !passwordIsValid(password) ? 'error' : undefined}
        >
          <Input 
            type={visible ? 'text' : 'password'} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Digite sua senha" 
            suffix={
              visible ? (
                <EyeOutlined onClick={() => setVisible(false)} />
              ) : (
                <EyeInvisibleOutlined onClick={() => setVisible(true)} />
              )
            }
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block 
            disabled={!isFormValid()}
          >
            Registrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterComponent;
