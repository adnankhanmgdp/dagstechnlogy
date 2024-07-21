import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCoupon = () => {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState({
    couponName: "",
    couponDiscount: "",
    description: "",
    expiryAt: "",
    maxDiscount: "",
    minAmount: "",
    isFlat: "flat",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoupon({
      ...coupon,
      [name]: value, // Directly set value for all fields
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...coupon,
          isFlat: coupon.isFlat === "flat", // Convert isFlat to boolean
        }),
      });
      if (res.ok) {
        toast.success("Coupon created successfully!");
        navigate("/coupon/allCoupons");
      } else {
        toast.error("Failed to create the coupon");
      }
    } catch (error) {
      toast.error("An error occurred while creating the coupon");
      console.error(error);
    }
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">Create Coupon</h4>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Coupon Code</label>
              <input
                type="text"
                name="couponName"
                value={coupon.couponName}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Coupon Discount</label>
              <input
                type="number"
                name="couponDiscount"
                value={coupon.couponDiscount}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={coupon.description}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Max Discount</label>
              <input
                type="number"
                name="maxDiscount"
                value={coupon.maxDiscount}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Min Amount for Cart</label>
              <input
                type="number"
                name="minAmount"
                value={coupon.minAmount}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group d-flex align-items-center">
              <div className="form-group mr-3">
              <label>Expiry At</label>
              <input
                type="date"
                name="expiryAt"
                value={coupon.expiryAt}
                onChange={handleChange}
                className="form-control"
              />
              </div>
              <div className="form-group">
                <label>Discount Type</label>
                <select
                  name="isFlat"
                  value={coupon.isFlat}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="flat">Flat Off</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Save
            </button>
          </form>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ zIndex: 9999 }} // Ensuring the toast is on top
          />
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;
