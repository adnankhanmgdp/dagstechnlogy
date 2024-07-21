import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {

  const [formData, setFormData] = useState({})
  // console.log(formData);
  const token = localStorage.getItem("token");

  const navigate = useNavigate()

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/forgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cpassword: formData.cpassword, password: formData.password, phone: '8299112380' })
      })

      const data = res.json()
      if (res.ok) {
        // console.log(data)
        navigate('/')
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (

    <div class="account-pages my-5 pt-sm-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card overflow-hidden">
              <div
                style={{ backgroundColor: "#D5DAFA" }}
                class="bg-primary-subtle"
              >

                <div class="row">
                  <div class="col-7">
                    <div class="text-primary p-4">
                      <h5 class="text-primary"> Reset Password</h5>
                      <p>Reset Password with Dags.</p>
                    </div>
                  </div>
                  <div class="col-5 align-self-end">
                    <img
                      src="/assets/images/profile-img.png"
                      alt=""
                      class="img-fluid"
                    />
                  </div>
                </div>
              </div>
              <div class="card-body pt-0">
                <div class="auth-logo">
                  <a href="index.html" class="auth-logo-light">
                    <div class="avatar-md profile-user-wid mb-4">
                      <span class="avatar-title rounded-circle bg-light">
                        <img src="/assets/Dags.jpg" alt="" height="17" />
                      </span>
                    </div>
                  </a>
                </div>
                <div class="p-2">
                  <form class="form-horizontal" action="index.html">
                    <div class="mb-3">
                      <label class="form-label">Password</label>
                      <div class="input-group auth-pass-inputgroup">
                        <input
                          type="password"
                          onChange={handleChange}
                          class="form-control"
                          id="password"
                          placeholder="Enter password"
                          aria-label="Password"
                          aria-describedby="password-addon"
                        />
                        <button
                          class="btn btn-light "
                          type="button"
                          id="password-addon"
                        >
                          <i class="mdi mdi-eye-outline"></i>
                        </button>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Confirm Password</label>
                      <div class="input-group auth-pass-inputgroup">
                        <input
                          type="password"
                          onChange={handleChange}
                          id="cpassword"
                          class="form-control"
                          placeholder="Enter password"
                          aria-label="Password"
                          aria-describedby="password-addon"
                        />
                        <button
                          class="btn btn-light "
                          type="button"
                          id="password-addon"
                        >
                          <i class="mdi mdi-eye-outline"></i>
                        </button>
                      </div>
                    </div>

                    <div class="mt-4 d-grid">
                      <Link to="/verify/otp">
                        <button
                          class="btn btn-primary waves-effect waves-light"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Reset
                        </button>
                      </Link>
                    </div>

                    <div class="mt-4 text-center">
                      <Link to="/" class="text-muted">
                        <i class="mdi mdi-lock me-1"></i> Remember?
                      </Link>
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
