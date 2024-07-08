import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"

const ForgotPasscode = () => {

  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Initialize OTP state with empty array
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]; // Refs for input fields

  const navigate = useNavigate();
  const{phone,email} = useSelector((state)=>state.phone)

  const handleInputChange = (index, e) => {
    const input = e.target;
    const value = input.value;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const isBackspace = e.keyCode === 8;
    if (value && index < 5) {
      inputRefs[index + 1].current.focus(); // Move focus to the next input field
    } else if (isBackspace && index > 0 && !value) {
      inputRefs[index - 1].current.focus(); // Move focus to the previous input field
    }
 };
 
 const [cotp, csetOtp] = useState(["", "", "", "", "", ""]); // Initialize OTP state with empty array
 const cinputRefs = [
   useRef(null),
   useRef(null),
   useRef(null),
   useRef(null),
   useRef(null),
   useRef(null),
 ]; // Refs for input fields

 const chandleInputChange = (index, e) => {
   const input = e.target;
   const value = input.value;

   const cnewOtp = [...cotp];
   cnewOtp[index] = value;
   csetOtp(cnewOtp);

   const isBackspace = e.keyCode === 8;
   if (value && index < 5) {
     cinputRefs[index + 1].current.focus(); // Move focus to the next input field
   } else if (isBackspace && index > 0 && !value) {
     cinputRefs[index - 1].current.focus(); // Move focus to the previous input field
   }
  };
  
  const token = localStorage.getItem("token")

//  console.log(otp,cotp);

 const handleVerify = async (e) => {
   
   const otpData = otp.join("");
   const cotpData = cotp.join("");
  //  console.log(otpData, cotpData);

    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/forgotPasscode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`
        },
        body: JSON.stringify({
         passcode: otpData,
         cpasscode: cotpData,
          phone: phone,
         email:email
        }),
      });
      const data = await res.json();
      // console.log("data", data);
      if (res.ok) {
        navigate("/verify/passcode");
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div style={{ backgroundColor: "#F8F8FB" }}>
      <div className="d-flex justify-content-center container align-items-center">
        <div className="cardd border p-4">
          <div className="avatar-md my-3 mx-auto">
            <div className="avatar-title rounded-circle bg-light">
              <i className="bx bxs-check-shield h1 mb-0 text-primary"></i>
            </div>
          </div>
          <h5 className="m-0 text-center">
            Please enter passcode to verify Authentication
          </h5>
          <span className="text-center py-3">Enter your Passcode</span>

          <div className="d-flex flex-row mt-3">
            {/* Map through inputRefs array */}
            {inputRefs.map((ref, index) => (
              <input
                key={index}
                ref={ref}
                type="text"
                className="form-controll text-center"
                maxLength={1}
                autoFocus={index === 0}
                value={otp[index]} // Bind value to state
                onChange={(e) => handleInputChange(index, e)}
              />
            ))}
          </div>

          <div className="d-flex flex-row mt-3">
            {/* Map through inputRefs array */}
            {cinputRefs.map((cref, index) => (
              <input
                key={index}
                ref={cref}
                type="text"
                className="form-controll text-center"
                maxLength={1}
                autoFocus={index === 0}
                value={cotp[index]} // Bind value to state
                onChange={(e) => chandleInputChange(index, e)}
              />
            ))}
          </div>

          <div className="mt-5">
            <button
              style={{ backgroundColor: "#34C38F" }}
              className="btn btn-success w-md"
              onClick={handleVerify}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasscode;
