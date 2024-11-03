import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home'; 
import './style.css';
import RegisterCarPage from './pages/Car/RegisterCar';
import RegisterBrandPage from './pages/Brand/RegisterBrand';
import ListCarPage from './pages/Car/ListCar';
import UpdateCarPage from './pages/Car/UpdateCar';
import ListBrandPage from './pages/Brand/ListBrand';
import UpdateBrandPage from './pages/Brand/UpdateBrand';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />}>
          <Route path="list-car" element={<ListCarPage />} />
          <Route path="register-car" element={<RegisterCarPage />} />
          <Route path="update-car/:carName" element={<UpdateCarPage />} />
          <Route path="list-brand" element={<ListBrandPage />} />
          <Route path="register-brand" element={<RegisterBrandPage />} />
          <Route path="update-brand/:brandName" element={<UpdateBrandPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
