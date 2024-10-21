import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminPage from './components/AdminPage';
import Cashier from './components/CashierPage';
import Kitchen from './components/KitchenPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route 
                    path="/admin/*" 
                    element={
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                  />
                  <Route 
                    path="/cashier/*" 
                    element={
                        <ProtectedRoute>
                            <Cashier />
                        </ProtectedRoute>
                    }
                  />
                  <Route 
                    path="/kitchen/*" 
                    element={
                        <ProtectedRoute>
                            <Kitchen />
                        </ProtectedRoute>
                    }
                  />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
