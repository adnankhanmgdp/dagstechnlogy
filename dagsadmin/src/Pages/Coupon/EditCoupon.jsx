import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState({
    couponName: "",
    couponDiscount: "",
    description: "",
    expiryAt: "",
    maxDiscount: "",
    minAmount: "",
    status: "active",
    isFlat: "flat",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCoupon = async () => {
      // console.log(id)
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/coupon/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        // console.log(data)
        if (res.ok) {
          // Properly parse the expiryAt date and convert status and isFlat
          setCoupon({
            couponName: data.coupon.couponName || "",
            couponDiscount: data.coupon.couponDiscount || "",
            description: data.coupon.description || "",
            expiryAt: data.coupon.expiryAt ? new Date(data.coupon.expiryAt).toISOString().substring(0, 10) : "",
            maxDiscount: data.coupon.maxDiscount || "",
            minAmount: data.coupon.minAmount || "",
            status: data.coupon.status ? "active" : "inactive",
            isFlat: data.coupon.isFlat ? "flat" : "percentage",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCoupon();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoupon({
      ...coupon,
      [name]: name === "status" ? value : name === "isFlat" ? value : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/coupon/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...coupon,
          status: coupon.status === "active",
          isFlat: coupon.isFlat === "flat",
        }),
      });
      if (res.ok) {
        toast.success("Coupon updated successfully!");
        navigate("/coupon/allCoupons");
      } else {
        toast.error("Failed to update the coupon");
      }
    } catch (error) {
      toast.error("An error occurred while updating the coupon");
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
                <h4 className="mb-sm-0 font-size-18">Edit Coupon</h4>
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
                <label>Status</label>
                <select
                  name="status"
                  value={coupon.status}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
        </div>
      </div>
    </div>
  );
};

export default EditCoupon;
