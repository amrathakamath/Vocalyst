import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './Signup.css'; // Import the CSS file
import { useState } from 'react';
import { handleError, handleSuccess } from '../utils';

export default function Signup() {
    const [signupInfo , setSignupInfo] = useState({
        name : "",
        email : "",
        password : ""
    })
    const navigate = useNavigate();

    function handleChange(e){
        const {name , value} = e.target;
        console.log(name , value)
        const copySignupInfo = {...signupInfo};
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo)
    }
    console.log(signupInfo)
    async function handleSignup(e){
        e.preventDefault();
        const {name, email, password} = signupInfo;
        if(!name || !email || !password){
            return handleError("All fields are required");
        }
    
        try{
            const url = "/user/signup";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            
            const result = await response.json();
            console.log("Response:", result);
            
            if(result.success){
                handleSuccess(result.message);
                navigate("/signin");
            }
            else if(result.error){
                if(result.error.issues && result.error.issues.length > 0){
                    const details = result.error.issues[0].message;
                    handleError(details);
                } else {
                    handleError(result.error.message || "Signup failed");
                }
            }
            else {
                handleError(result.message || "Signup failed");
            }
    
        } catch(err) {
            console.error("Signup error:", err);
            handleError("Network error. Please try again.");
        }
    }
    
  
    return (
        <div className="signup-container">

            <div className="signup-card">
                <h1 className="signup-title">Welcome back</h1>
                
                {/* Google Sign Up Button */}
                <button className="google-btn" type="button">
                    <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign up with Google
                </button>

                {/* Divider */}
                <div className="divider">
                    <div className="divider-line"></div>
                    <span className="divider-text">or</span>
                    <div className="divider-line"></div>
                </div>
                
                {/* Sign Up Form */}
                <form className="signup-form" onSubmit={handleSignup}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input 
                            onChange={handleChange}
                            type="text" 
                            id="name" 
                            name="name" 
                            className="form-input"
                            autoFocus 
                            placeholder="Enter your name" 
                            value={signupInfo.name}
                        />
                    </div>
                                     
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            onChange={handleChange}
                            type="email" 
                            id="email" 
                            name="email" 
                            className="form-input"
                            placeholder="Enter your email" 
                            value={signupInfo.email}
                        />
                    </div>
                                     
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            onChange={handleChange}
                            type="password" 
                            id="password" 
                            name="password" 
                            className="form-input"
                            placeholder="Enter your password" 
                            value={signupInfo.password}
                        />
                    </div>
                    
                    {/* Terms and conditions */}
                    <div className="checkbox-group">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            className="checkbox-input"
                        />
                        <label htmlFor="terms" className="checkbox-label">
                            I agree to the <a href="#" className="link">Terms of Service</a>, and acknowledge Vocalyst <a href="#" className="link">Privacy Policy</a>
                        </label>
                    </div>
                                     
                    <button type="submit" className="submit-btn">Sign up</button>
                </form>
                
                <div className="footer-text">
                    Already registered? <Link to="/login" className="link">Sign in</Link>
                </div>
                
                <ToastContainer />
            </div>
        </div>
    );
}