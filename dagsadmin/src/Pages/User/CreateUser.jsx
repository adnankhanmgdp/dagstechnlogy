import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateUser = () => {

  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  // console.log(formData);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/createUser`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();
      if (res.ok) {
        // console.log(data);
        toast.success("user created successfully")
        navigate("/users/allUsers");
      }
      // console.log(data)

    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div
      style={{ background: "#F8F8FB", height: "100vh", paddingTop: "200px" }}
      className="main-content d-flex justify-content-center align-items-center"
    >
      <div className="page-content">
        <div className="container">
          <form className="border bg-white mt-5 p-4">
            <div className="row">
              <div class="col-lg-12">
                <div class="mb-3">
                  <label
                    className="customizeFont"
                    for="basicpill-firstname-input"
                  >
                    Name
                  </label>
                  <input
                    onChange={handleChange}
                    required
                    type="text"
                    class="form-control"
                    id="name"
                    placeholder="Enter Name"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div class="col-lg-12">
                <div class="mb-3">
                  <label
                    className="customizeFont"
                    for="basicpill-firstname-input"
                  >
                    Email
                  </label>
                  <input
                    onChange={handleChange}
                    required
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder="Enter Email address"
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label customizeFont">Phone</label>
                <input
                  onChange={handleChange}
                  type="number"
                  className="form-control"
                  id="phone"
                  placeholder="Enter Phone"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="pincode" className="form-label customizeFont">
                  Pincode
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  id="pincode"
                  placeholder="Enter Postal code"
                />
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col-md-12">
                <label htmlFor="address" className="form-label customizeFont">
                  Address
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="Enter complete address"
                />
              </div>
            </div>
            <button onClick={handleSubmit} className="createUserBtn">
              Create User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
