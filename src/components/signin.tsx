import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/KSUCU logo updated document.png';
import { Link, useNavigate } from 'react-router-dom';
import loadingAnime from '../assets/Animation - 1716747954931.gif';

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const [generalLoading, setgeneralLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async () => {
        // Check if the user is online
        if (!navigator.onLine) {
            setError('Check your internet and try again...');
            return;
        }
    
        window.scrollTo({
            top: 0,
            behavior: 'auto', // 'auto' for instant scroll
        });
    
        setgeneralLoading(true);
    
        try {
            const response = await axios.post('https://ksucu-mc-backend.onrender.com/users/login', formData, {
                withCredentials: true, // This is necessary to include cookies in the request
            });
            console.log('Response:', response.data);
            navigate('/');
    
        } catch (error: any) {
            console.error('Error:', error);
    
            // Check if the error response status is 400
            if (error.response && error.response.status === 401) {
                try {
                    // Try logging in to the admin endpoint
                    const adminResponse = await axios.post('https://ksucu-mc-backend.onrender.com/adminnews/login', formData, {
                        withCredentials: true,
                    });
                    console.log('Admin Response:', adminResponse.data);
                    navigate('/adminnews'); // Navigate to the admin dashboard or relevant page
    
                } catch (adminError) {
                    console.error(' Login Error:', adminError);
                    setError('Please check your credentials.');
                }
            } else {
                // Handle other errors
                setError('Login failed. Please try again.');
            }
        } finally {
            setgeneralLoading(false);
        }
    };
    
    return (
        <div className={styles.body}>
            {generalLoading && (
                <div className={styles['loading-screen']}>
                    <p className={styles['loading-text']}>Please wait...</p>
                    <img src={loadingAnime} alt="animation gif" />
                </div>
            )}
            <div className={styles['container']}>
                <Link to={"/"} className={styles.logo_div}>
                    <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
                </Link>
                
                {error && <div className={styles.error}>{error}</div>}

                <h2 className={styles['text']}>Log in</h2>

                <form action="" className={styles['form']}>

                    <div>
                        <label htmlFor="email">e-mail</label>
                        <input type="text" id="email" value={formData.email} onChange={handleChange} />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={formData.password} onChange={handleChange} />
                    </div>

                </form>

                <div className={styles['submisions']}>
                    <div className={styles['clearForm']} onClick={() => setFormData({ email: '', password: '' })}>Clear</div>
                    <div className={styles['submitData']} onClick={handleSubmit}>Next</div>
                </div>

                <div className={styles['form-footer']}>
                    <p><Link to={'/forgotPassword'}>Forgot pasword</Link></p>
                    <p>Have no account <Link to={"/signUp"}>click Here</Link></p>
                </div>

                <div className={styles['form-footer']}>
                    <p><Link to={"/Home"}>Home</Link></p>
                </div>

            </div>

        </div>
    );
};

export default SignIn;

