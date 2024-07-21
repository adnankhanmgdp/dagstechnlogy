import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from "react-bootstrap";


const Coupon = () => {
  const [coupon, setCoupon] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  // console.log("services", services);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/coupon`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          // console.log(data.service);
          setCoupon(data.activeCoupons);
        }
      } catch (error) {
        // console.log(error);
      }
    };

    handleFetch();
  }, []);

  const handleDeleteCoupon = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/coupon/${couponToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Corrected Bearer token format
        },
      });

      if (res.ok) {
        toast.warning("Coupon deleted successfully");
        // Fetch updated list of coupons
        const updatedRes = await fetch(`${process.env.REACT_APP_API_URL}/coupon`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setCoupon(data.activeCoupons); // Update state with the latest coupons
        } else {
          throw new Error("Failed to fetch updated coupons");
        }
      } else {
        throw new Error("Failed to delete coupon");
      }
    } catch (error) {
      console.error(error);
    }
    setShowModal(false);
  };


  const openModal = (itemId) => {
    setCouponToDelete(itemId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="main-content">
      <ToastContainer />
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">Coupon</h4>

                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <span>Categories</span>
                    </li>
                    <li className="breadcrumb-item active">Coupon</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            {
              coupon.length > 0 ? (<table className="table table-bordered table-hover table-centered mb-0">
                <thead>
                  <tr className="text-center">
                    <th>Coupon Code</th>
                    <th>Coupon Discount</th>
                    <th>Description</th>
                    <th>No. of times used</th>
                    <th>Expiry At</th>
                    <th>Max Discount</th>
                    <th>Min Amount for Cart</th>
                    {/* <th>Status</th> */}
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(coupon) &&
                    coupon.map((item) => (
                      <tr key={item._id} data-id="1" className="text-center">
                        <td data-field="id">{item.couponName}</td>
                        <td data-field="name">{item.couponDiscount}</td>
                        <td data-field="name">{item.description}</td>
                        <td data-field="name">{item.usedTimes}</td>
                        <td data-field="name">
                          {new Date(item.expiryAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </td>
                        <td data-field="name">{item.maxDiscount}</td>
                        <td data-field="name">{item.minAmount}</td>
                        {/* <td data-field="name">{item.status}</td> */}
                        <td data-field="price">
                          <Link
                            to={`/coupon/editCoupon/${item._id}`}
                          >
                            <button className="border-0 pl-3 pr-3 pt-1 pb-1 bg-primary text-white">
                              Edit
                            </button>
                          </Link>
                        </td>
                        <td className="text-center">
                          <Link
                            to="#"
                            className="btn btn-outline-secondary btn-sm delete"
                            title="delete"
                            onClick={() => openModal(item._id)}
                          >
                            <i className="fa fa-trash"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>) : (<span className="text-center fs-15">No Coupon available</span>)
            }
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to delete the Coupon?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleDeleteCoupon}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Coupon;
