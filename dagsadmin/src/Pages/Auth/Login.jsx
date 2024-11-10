import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { emailInSuccess, phoneInSuccess } from "../../redux/PhoneSlice";
import { clearError } from "../../redux/UserSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.user)

  const [formData, setFormData] = useState({});
  // console.log(formData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault();
    dispatch(emailInSuccess(formData.email));
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/credintials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token)
        if (data.isNewIP) {
          dispatch(phoneInSuccess(data.phone))
          navigate("/verify/otp");
        } else {
          dispatch(clearError())
          dispatch(phoneInSuccess(data.phone));
          navigate('/verify/passcode')
        }
      } else {
        // dispatch(signInFailure(data.message))
        toast.warning(data.message)
      }
    } catch (error) {
      toast.warning(error.message)
      // console.log(error)
    }
  }

  const handleSendOTP = async (e) => {

    // e.preventDefault();
    // dispatch(emailInSuccess(formData.email));
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/resendOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // if (res.ok) {
      //     localStorage.setItem("token",data.token)
      //     if (data.isNewIP) {
      //       dispatch(phoneInSuccess(data.phone))
      //       navigate("/verify/otp");
      //     } else {
      //       dispatch(clearError())
      //       dispatch(phoneInSuccess(data.phone));
      //       navigate('/verify/passcode')
      //     }
      //   } else {
      //   // dispatch(signInFailure(data.message))
      //   toast.warning(data.message)
      //   }

    } catch (error) {
      toast.warning(error.message)
      // console.log(error)
    }
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: "#F8F8FB" }}
    >
      <div class="account-pages">
        <div style={{ paddingTop: "15vh" }} class="container">
          <div class="d-flex row justify-content-center">
            <div class="col-md-8 col-lg-6 col-xl-5">
              <div class="card overflow-hidden">
                <div
                  style={{ backgroundColor: "#D5DAFA" }}
                  class="bg-primary-subtle"
                >
                  <div class="row">
                    <div class="col-7">
                      <div class="text-primary p-4">
                        <h5 class="text-primary">Welcome Back !</h5>
                        <p style={{ fontSize: "13px" }}>
                          Sign in to continue to DAGS.
                        </p>
                      </div>
                    </div>
                    <div class="col-5 align-self-end">
                      <img
                        src="assets/images/profile-img.png"
                        alt=""
                        class="img-fluid"
                      />
                    </div>
                  </div>
                </div>
                <div class="card-body pt-0">

                  <div class="auth-logo">
                    <div class="avatar-md profile-user-wid mb-4">
                      <span class="avatar-title rounded-circle bg-light">
                        <img src="/assets/Dags.jpg" alt="" height="17" />
                      </span>
                    </div>
                  </div>

                  <div class="p-2">
                    <form class="form-horizontal" action="index.html">
                      <div class="mb-3">
                        <label for="Email" class="form-label">
                          Email
                        </label>
                        <input
                          onChange={handleChange}
                          type="text"
                          class="form-control"
                          id="email"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Password</label>
                        <div class="input-group auth-pass-inputgroup">
                          <input
                            onChange={handleChange}
                            type="password"
                            id="password"
                            class="form-control"
                            placeholder="Enter password"
                            aria-label="Password"
                            aria-describedby="password-addon"
                          />
                        </div>
                      </div>

                      <div class="mt-4 w-100 d-grid">
                        <Link to="/verify/otp">
                          <button
                            class="btn btn-primary waves-effect waves-light"
                            type="submit"
                            onClick={handleSubmit}
                          >
                            Log In
                          </button>
                        </Link>
                      </div>

                      <div class="mt-4 text-center">
                        <Link
                          to="/verify/ForgotPasswordOtp"
                          href="auth-recoverpw.html"
                          class="text-muted"
                          onClick={handleSendOTP}
                        >
                          <i class="mdi mdi-lock me-1"></i> Forgot your
                          password?
                        </Link>
                      </div>
                      {error && (
                        <p className="text-danger text-center">{error}</p>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
