import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { message } from 'antd';

const redirectMiddleware: Middleware<{}, unknown> = (store) => (next) => (action) => {
  const isLoginAction = 
    isRejectedWithValue(action) && 
    action.meta?.arg && 
    typeof action.meta.arg === 'object' && 
    'endpointName' in action.meta.arg &&
    action.meta.arg.endpointName === 'login';

  if (
    isRejectedWithValue(action) &&
    action.payload &&
    typeof action.payload === 'object' &&
    'status' in action.payload &&
    action.payload.status === 401 &&
    !isLoginAction
  )
  {
    message.error('Sessão expirada. Faça login novamente.');
    
    setTimeout(() => {
        window.location.href = '/';
        localStorage.removeItem('token')
    }, 1500);
  }

  return next(action);
};

export default redirectMiddleware;
