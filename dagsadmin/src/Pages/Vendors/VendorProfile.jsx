import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4"; // Import the Bootstrap 4 DataTables extension
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver"; // Import file-saver for saving files
import moment from "moment";

const VendorProfile = () => {
  const tableRef = useRef();
  const [orders, setOrders] = useState([]);
  const [bankDetails, setBankDetails] = useState({});
  const [vendorOrder, setVendorOrder] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const vendor = location.state;
  // console.log("vendorData", vendor);
  // console.log("vendor orders",vendorOrder)
  const [vendorData, updateVendor] = useState(vendor);

  // console.log("vendor data", vendor.vendorId)

  const token = localStorage.getItem("token");

  let count = 0;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/vendorOrders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ vendorId: vendorData.vendorId }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          // console.log("data",data)
          setOrders(data.populatedOrders);
          setVendorOrder(data.populatedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/fetchFeedback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ vendorId: vendorData.vendorId }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          setFeedbacks(data.feedbacks);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchBankDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/fetchBankDetails`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bankId: vendorData.vendorId }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          setBankDetails(data.bankDetails ? data.bankDetails : {});
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
      }
    };

    fetchOrders();
    fetchBankDetails();
    fetchFeedbacks();
  }, [count]);

  useEffect(() => {
    if (orders?.length > 0) {
      if ($.fn.dataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
      $(tableRef.current).DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
      });
    }
  }, [orders]);

  const handleDeactivateVendor = async (vendorId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/editVendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vendorId: vendorId, status: "inactive" }),
      });
    } catch (error) {
      console.error("Error deactivating vendor:", error);
    }
  };

  const handleActivateVendor = async (vendorId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/editVendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vendorId: vendorId, status: "active" }),
      });
    } catch (error) {
      console.error("Error deactivating vendor:", error);
    }
  };

  const vendorOrderModal = (order) => {
    navigate("/orders/orderDetails", { state: { order } });
  };

  // const vendorOrderModal = (order) => {
  //   navigate("/invoice/invoiceDetail", {
  //     state: { order },
  //   });
  // };

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const [formData, setFormData] = useState({});

  const handleChangetheprofile = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleEdit = async (e) => {
    // console.log(formData);
    e.preventDefault();
    // console.log(vendorData.vendorId);
    // console.log("formData", formData);
    const updatedFormData = { ...formData, vendorId: vendor.vendorId }
    // console.log("updatedFormData", updatedFormData);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/editVendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFormData),
      });
      const data = await res.json();
      // console.log("edited", data);
      if (res.ok) {
        setBankDetails({
          accountHolderName: data.updateBankDetails.accountHolderName,
          accountNumber: data.updateBankDetails.accountNumber,
          bankName: data.updateBankDetails.bankName,
          IFSC: data.updateBankDetails.IFSC,
        });
        updateVendor({
          name: data.updatedVendor.name,
          email: data.updatedVendor.email,
          phone: data.updatedVendor.phone,
          address: data.updatedVendor.address,
        });
        setShowModal(false);
        count++;
        toast.success("vendor updated successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-warning">
            &#9733;
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="text-secondary">
            &#9733;
          </span>,
        );
      }
    }
    return stars;
  };
  // const { latitude, longitude } = vendor.geoCoordinates;

  const handleDownload = async (option) => {
    // Determine the date range based on the selected option
    let start = moment();
    let end = moment();

    if (option === "week") {
      start = moment().startOf("week");
      end = moment().endOf("week");
    } else if (option === "month") {
      start = moment().startOf("month");
      end = moment().endOf("month");
    } else if (option === "year") {
      start = moment().startOf("year");
      end = moment().endOf("year");
    }

    // Filter orders within the date range
    const filteredOrders = vendorOrder.filter((order) => {
      const orderDate = moment(order.orderDate); // Assuming `orderDate` is a date field in your order object
      return orderDate.isBetween(start, end, null, "[]"); // '[]' includes both start and end dates
    });

    //  console.log("filtered",filteredOrders)

    // Generate CSV content
    let csvContent =
      "Order Date,User Name,User Phone,Order Id,Vendor Id, Total Amount,Total Items,Logistic Pickup Name,Logistic Pickup Phone,Logistic Delivery Name, Logistic Delivery Phone  \n";
    filteredOrders.forEach((order) => {
      const logisticPickup = order.logisticId[0] || ""; // Assuming logistic pickup is the first element in logisticId array
      const logisticDelivery = order.logisticId[1] || ""; // Assuming logistic delivery is the second element in logisticId array

      csvContent += `${order.orderDate},${order.user.name},${order.user.phone},${order.orderId},${order.vendorId},${order.amount},${order.items.length},${order.logistics[0]?.name ? order.logistics[0].name : "Not assigned yet"},${order.logistics[0]?.phone ? order.logistics[0].phone : "N/A"},${order.logistics[1]?.name ? order.logistics[1].name : "Not Assigned Yet"},${order.logistics[1]?.phone ? order.logistics[1].phone : "N/A"}\n`;
    });

    // Create a Blob object to hold the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Save the Blob as a file using FileSaver.js
    saveAs(
      blob,
      `orders_${option}_${start.format("YYYY-MM-DD")}_${end.format("YYYY-MM-DD")}.csv`,
    );
  };

  return (
    <div className="main-content" style={{ backgroundColor: "#F6F6F9" }}>
      <div className="page-content">
        <ToastContainer />
        <div className="container-fluid">
          <div className="row">
            <div className="d-flex flex-column m-3 flex-xl-row">
              <div className="card xl-mb-0 mr-xl-4 col-xl-4">
                <div className="bg-primary-subtle p-2">
                  <div className="row">
                    <div className="mx-auto mt-3">
                      <img
                        src={
                          vendor?.profilePic
                            ? vendor?.profilePic
                            : "https://tse3.mm.bing.net/th?id=OIP.K4jXSK4XQahOLPEliCtvlwHaHa&pid=Api&P=0&h=180"
                        }
                        className="avatarCustom"
                        alt="user's img"
                      />
                    </div>
                    <div className="col-12">
                      <div className="p-3">
                        <h5 className="text-center">
                          {vendorData && vendorData.name}'s Profile
                        </h5>
                        <p className="text-center text-primary">
                          " It will seem like simplified "
                        </p>
                      </div>

                      {vendor && vendor.status === "active" ? (
                        <div className="d-flex h-25 flex-column">
                          <button
                            onClick={() => setShowModal(true)}
                            style={{ borderRadius: "7px" }}
                            className="bg-primary border-0 text-white pt-1 pb-1 pl-4 pr-4"
                          >
                            Edit vendor's profile
                          </button>
                          <button
                            onClick={() =>
                              handleDeactivateVendor(vendor.vendorId)
                            }
                            style={{ borderRadius: "7px" }}
                            className="bg-danger mt-2 border-0 text-white pt-1 pb-1 pl-4 pr-4"
                          >
                            Deactivate vendor
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex h-25 flex-column">
                          <button
                            onClick={() =>
                              handleActivateVendor(vendor.vendorId)
                            }
                            style={{ borderRadius: "7px" }}
                            className="bg-danger mt-2 mb-3 border-0 text-white pt-1 pb-1 pl-4 pr-4"
                          >
                            Activate vendor
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4 font-size-20">
                    Personal Information
                  </h4>
                  <p className="text-muted mb-4 font-size-14">
                    Hi, I'm {vendorData && vendorData.name}, a trusted name in
                    the industry, offering top-quality services and products.
                    With years of experience, I strive to provide unparalleled
                    customer satisfaction and value.
                  </p>
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Full Name :
                          </th>
                          <td>{vendorData && vendorData.name}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Mobile :
                          </th>
                          <td>{vendorData && vendorData.phone}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            E-mail :
                          </th>
                          <td>{vendorData && vendorData.email}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Location :
                          </th>
                          <td>{vendorData && vendorData.address}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card mt-2 mb-4">
              <div className="card-body">
                <h5 className="card-title">Account Details</h5>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label
                        className="headingCustom"
                        htmlFor="accountHolderName"
                      >
                        Account Holder Name:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="accountHolderName"
                        value={
                          bankDetails.accountHolderName
                            ? bankDetails.accountHolderName
                            : "N/A"
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="headingCustom" htmlFor="accountNo">
                        Account No:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="accountNo"
                        value={
                          bankDetails.accountNumber
                            ? bankDetails.accountNumber
                            : "N/A"
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="headingCustom" htmlFor="bankName">
                        Bank Name:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="bankName"
                        value={
                          bankDetails.bankName ? bankDetails.bankName : "N/A"
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="headingCustom" htmlFor="ifscCode">
                        IFSC Code:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="ifscCode"
                        value={bankDetails.IFSC ? bankDetails.IFSC : "N/A"}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* { vendor.geoCoordinates?.latitude ? (
            <div style={{ width: "100%", maxWidth: "100%" }}>
              <iframe
                width="100%"
                height="170"
                frameborder="0"
                scrolling="no"
                marginheight="0"
                marginwidth="0"
                src={`https://maps.google.com/maps?q=${latitude},${longitude}&hl=es&z=14&amp;output=embed`}
                title="Vendor Location on Google Maps"
                style={{ border: 0 }}
                allowfullscreen=""
                loading="lazy"
              ></iframe>
            </div>
          ) : (
            <div style={{ width: "100%", maxWidth: "100%" }}>
              <p>
                <i>geoCoordinates are not available</i>
              </p>
            </div>
          )} */}

          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-row justify-content-between">
                    <span>
                      <h4 className="card-title">Recent Orders</h4>
                    </span>
                    <div>
                      <Button
                        onClick={() => handleDownload("week")}
                        variant="primary"
                      >
                        Week
                      </Button>{" "}
                      <Button
                        onClick={() => handleDownload("month")}
                        variant="primary"
                      >
                        Month
                      </Button>{" "}
                      <Button
                        onClick={() => handleDownload("year")}
                        variant="primary"
                      >
                        Year
                      </Button>{" "}
                    </div>
                  </div>
                  <p className="card-title-desc">
                    This Datatables is about the recent orders that have been
                    assigned to the Logistic.
                  </p>
                  <div className="table-responsive">
                    <table
                      ref={tableRef}
                      className="table table-striped table-bordered"
                    >
                      <thead>
                        <tr>
                          <th className="headingCustom">Order ID</th>
                          <th className="headingCustom">Order Date</th>
                          <th className="headingCustom text-center">
                            Order Amount
                          </th>
                          <th className="headingCustom">Order status</th>
                          <th className="headingCustom">Manage Order</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendorOrder?.map((order) => (
                          <tr key={order.orderId}>
                            <td>{order.orderId}</td>
                            <td>{order.orderDate}</td>
                            <td className="text-center">{order.amount}</td>
                            <td>
                              <div>
                                <span
                                  className="p-2 rounded-pill"
                                  style={{
                                    backgroundColor:
                                      order.orderStatus[0].status ===
                                        "Delivered"
                                        ? "#a7ebc0"
                                        : order.orderStatus[0].status ===
                                          "Pending"
                                          ? "#ffa8a8"
                                          : order.orderStatus[0].status ===
                                            "Processing"
                                            ? "#ffe38b"
                                            : order.orderStatus[0].status ===
                                              "Shipped"
                                              ? "#c9ecc3"
                                              : "",
                                    width: "100px",
                                  }}
                                >
                                  {order.orderStatus[order.orderStatus.length - 1].status}
                                </span>
                              </div>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => vendorOrderModal(order)}
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="border rounded shadow-sm p-3">
                <h4 className="mt-3 pl-3 mb-3">Ratings & Reviews</h4>
                <div className="d-flex flex-wrap">
                  {feedbacks?.length > 0
                    ? feedbacks?.map((feedback, index) => (
                      <div key={index} className="col-md-4 mb-3">
                        <div className="card border h-100">
                          <div className="card-body d-flex flex-column">
                            <p className="card-text mb-auto">
                              <i>Order ID: {feedback.orderId}</i>
                            </p>
                            <h5 className="card-title">
                              {feedback.feedback}
                            </h5>

                            <div className="mt-auto">
                              {renderStars(parseInt(feedback.rating))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                    : "No Reviews"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title style={{ fontSize: "17px" }}>
              Edit Vendor Profiles
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="border p-3 m-1">
              <form>
                <div className="form-group">
                  <label>Full Name :</label>
                  <input
                    id="name"
                    type="text"
                    className="form-control"
                    onChange={handleChangetheprofile}
                    defaultValue={vendorData.name}
                  />
                </div>
                <div className="form-group">
                  <label>Mobile :</label>
                  <input
                    id="phone"
                    type="text"
                    className="form-control"
                    readOnly
                    defaultValue={vendorData.phone}
                  />
                </div>
                <div className="form-group">
                  <label>Email :</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="john@gmail.com "
                    onChange={handleChangetheprofile}
                    defaultValue={vendorData.email}
                  />
                </div>
                <div className="form-group">
                  <label>Location :</label>
                  <input
                    id="address"
                    type="text"
                    className="form-control"
                    placeholder="5/683 vikas nagar lucknow"
                    onChange={handleChangetheprofile}
                    defaultValue={vendorData.address}
                  />
                </div>
                {/* Add more fields as needed */}
              </form>
            </div>
            <div className="card shadow-sm mt-2 mb-4">
              <div className="card-body">
                <h5 className="card-title">Account Details</h5>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label
                        className="headingCustom"
                        htmlFor="accountHolderName"
                      >
                        Account Holder Name:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="accountHolderName"
                        onChange={handleChangetheprofile}
                        defaultValue={
                          bankDetails.accountHolderName
                            ? bankDetails.accountHolderName
                            : "N/A"
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="headingCustom" htmlFor="accountNo">
                        Account No:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="accountNumber"
                        placeholder="123456788765"
                        onChange={handleChangetheprofile}
                        defaultValue={
                          bankDetails.accountNumber
                            ? bankDetails.accountNumber
                            : "N/A"
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="headingCustom" htmlFor="bankName">
                        Bank Name:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="bankName"
                        placeholder="Bank Of Baroda"
                        onChange={handleChangetheprofile}
                        defaultValue={
                          bankDetails.bankName ? bankDetails.bankName : "N/A"
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="headingCustom" htmlFor="ifscCode">
                        IFSC Code:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="IFSC"
                        onChange={handleChangetheprofile}
                        placeholder="BARB0FGIETX"
                        defaultValue={
                          bankDetails.IFSC ? bankDetails.IFSC : "N/A"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <button
              variant="secondary"
              className="p-1 pl-2 pr-2"
              onClick={handleEdit}
            >
              Edit
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default VendorProfile;
