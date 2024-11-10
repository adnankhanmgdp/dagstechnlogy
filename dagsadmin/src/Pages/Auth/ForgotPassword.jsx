import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cpasswordVisible, setCpasswordVisible] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/forgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cpassword: formData.cpassword, password: formData.password })
      });

      if (res.ok) {
        toast.success("Password reset successful!");
        navigate('/');
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message || "Failed to reset password"}`);
      }
    } catch (error) {
      toast.error("An error occurred while resetting the password.");
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleCpasswordVisibility = () => {
    setCpasswordVisible(!cpasswordVisible);
  };

  return (
    <div className="account-pages my-5 pt-sm-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card overflow-hidden">
              <div style={{ backgroundColor: "#D5DAFA" }} className="bg-primary-subtle">
                <div className="row">
                  <div className="col-7">
                    <div className="text-primary p-4">
                      <h5 className="text-primary">Reset Password</h5>
                      <p>Reset Password with Dags.</p>
                    </div>
                  </div>
                  <div className="col-5 align-self-end">
                    <img
                      src="/assets/images/profile-img.png"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
              <div className="card-body pt-0">
                <div className="auth-logo">
                  <div className="avatar-md profile-user-wid mb-4">
                    <span className="avatar-title rounded-circle bg-light">
                      <img src="/assets/Dags.jpg" alt="" height="17" />
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  <form className="form-horizontal" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <div className="input-group auth-pass-inputgroup">
                        <input
                          type={passwordVisible ? "text" : "password"}
                          onChange={handleChange}
                          className="form-control"
                          id="password"
                          placeholder="Enter password"
                          aria-label="Password"
                          aria-describedby="password-addon"
                        />
                        <button
                          className="btn btn-light"
                          type="button"
                          id="password-addon"
                          onClick={togglePasswordVisibility}
                        >
                          <i className={`mdi ${passwordVisible ? 'mdi-eye-off' : 'mdi-eye-outline'}`}></i>
                        </button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm Password</label>
                      <div className="input-group auth-pass-inputgroup">
                        <input
                          type={cpasswordVisible ? "text" : "password"}
                          onChange={handleChange}
                          id="cpassword"
                          className="form-control"
                          placeholder="Confirm password"
                          aria-label="Confirm Password"
                          aria-describedby="cpassword-addon"
                        />
                        <button
                          className="btn btn-light"
                          type="button"
                          id="cpassword-addon"
                          onClick={toggleCpasswordVisibility}
                        >
                          <i className={`mdi ${cpasswordVisible ? 'mdi-eye-off' : 'mdi-eye-outline'}`}></i>
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 d-grid">
                      <button
                        className="btn btn-primary waves-effect waves-light"
                        type="submit"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
