import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../../redux/UserSlice";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const { phone } = useSelector((state) => state.phone)
  const { email } = useSelector((state) => state.phone);
  // console.log("phone", phone, email)

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const inputRefs = useRef([
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]);

  const handleInputChange = (index, e) => {
    const value = e.target.value;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const isBackspace = e.keyCode === 8;
    if (value && index < 5) {
      inputRefs.current[index + 1].current.focus();
    } else if (isBackspace && index > 0 && !value) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    const otpData = otp.join("");
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/verifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({
          phone: phone,
          OTP: otpData,
          email: email,
        }),
      });
      const data = await res.json();
      // console.log("data",data)
      if (res.ok) {
        localStorage.setItem("token", data.token)
        dispatch(clearError())
        navigate("/verify/passcode");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resendCode = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/resendOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await res.json();
      // console.log("data",data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div style={{ backgroundColor: "#F8F8FB" }}>
      <div className="d-flex justify-content-center container align-items-center">
        <div className="cardd border p-4">
          <div class="avatar-md my-3 mx-auto">
            <div class="avatar-title rounded-circle bg-light">
              <i class="bx bxs-envelope h1 mb-0 text-primary"></i>
            </div>
          </div>
          <h5 className="m-0">Verify your number</h5>
          <span className="text-center py-3">
            Enter the code we just sent to your Mobile Phone <br />{" "}
            <strong>+91 {phone}</strong>
          </span>

          <div className="d-flex flex-row mt-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs.current[index]}
                type="text"
                className="form-controll text-center mx-1"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e)}
              />
            ))}
          </div>

          <div class="mt-5">
            <button
              style={{ backgroundColor: "#34C38F" }}
              class="btn btn-success w-md"
              onClick={handleSubmit}
            >
              Verify
            </button>
          </div>

          <div className="text-center mt-3">
            <span className="d-block mobile-text">
              Didn't receive the code?
            </span>
            <span className="font-weight-bold text-primary hover:text-cursor">
              <button onClick={resendCode}>Resend Code</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
