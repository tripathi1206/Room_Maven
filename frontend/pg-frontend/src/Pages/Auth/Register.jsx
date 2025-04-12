import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import avatar from '../../assets/profile.png';
import '../../Styles/Auth.css';

const Register = () => {
    const navigate = useNavigate();

    // State for form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        profileImage: null,
    });

    // State for password validation
    const [passwordMatch, setPasswordMatch] = useState(true);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value
        }));
    };

    // Password validation effect
    useEffect(() => {
        setPasswordMatch(formData.password === formData.confirmPassword);
    }, [formData.password, formData.confirmPassword]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (!formData.profileImage) return toast.error('Please upload an image');
        if (!formData.firstName) return toast.error('Please enter your first name');
        if (!formData.lastName) return toast.error('Please enter your last name');
        if (!formData.email) return toast.error('Please enter your email');
        if (!formData.password) return toast.error('Please enter a password');
        if (!passwordMatch) return toast.error('Passwords do not match');

        try {
            const registerData = new FormData();
            Object.keys(formData).forEach((key) => {
                registerData.append(key, formData[key]);
            });

            const response = await fetch('http://localhost:3000/api/v1/auth/register', {
                method: 'POST',
                body: registerData,
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.msg || 'Registration successful!');
                navigate('/login');
            } else {
                toast.error(result.msg || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration Failed:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <section className="register-section">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="heading">
                <h1>Register Here</h1>
                <h3>Lorem ipsum dolor sit amet consectetur, adipisicing elit...</h3>
            </div>
            <div className="register-container">
                <form className="register-info" onSubmit={handleSubmit}>
                    <input 
                        id="image"
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleChange}
                    />
                    <label htmlFor="image">
                        <img
                            className="uploader"
                            src={formData.profileImage ? URL.createObjectURL(formData.profileImage) : avatar}
                            alt="Profile"
                        />
                    </label>

                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
                    
                    {!passwordMatch && <p style={{ color: 'red' }}>Passwords do not match!</p>}

                    <button type="submit" disabled={!passwordMatch} className="btn">REGISTER</button>
                </form>
                <div className="bottom">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </section>
    );
};

export default Register;
