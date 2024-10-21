import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => { // e - event object
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:5000/api/auth/login',{
                usernameOrEmail, password
            });
        
            // console.log('Login attempted with',username,password);
            const {token,user} = response.data;
            // localStorage.setItem('token',token);
            // localStorage.setItem('user',JSON.stringify(user));
            login(token);

            

            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'cashier') {
                navigate('/cashier');
            } else {
                navigate('/kitchen');
            }
        } catch (error) {
            setError('Invalid login credentials. Please try again.');
            setTimeout(() => setError(''), 3000);
        }
        
    };

    

    // JSX - Javascript XML
    return (
        <div className="login-container">

            <div className="tagline">
                <h1>CanManage</h1>
                <p>where <strong>CANTEEN</strong> efficiency 
                meets <strong>SMART</strong> solutions</p>
            </div>

            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="usernameOrEmail">Username or Email</label>
                    <input
                        type="text"
                        id = "usernameOrEmail"
                        value = {usernameOrEmail}
                        onChange = {(e) => setUsernameOrEmail(e.target.value)}
                        placeholder="Enter Username"
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id = "password"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        required
                    />

                    <button type="submit" className="login-button">Login</button>
                    {error && <div className="error-message">{error}</div>}
                    <div className="links">
                        <a href="/signup">Admin User? Sign up</a>
                        <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                    </div>
                </form>
            </div>

            {/* Add contact us section */}
            {/* <div className="contact-us">
                <p>Contact Us: 
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a> | 
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> | 
                    <a href="mailto:support@canmanage.com">Email</a>
                </p>
            </div> */}
            
        </div>
    );
};

export default Login;