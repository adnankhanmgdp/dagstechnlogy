import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4"; // Import the Bootstrap 4 DataTables extension
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver"; // Import file-saver for saving files
import moment from "moment";

const VendorProfile = () => {
  const tableRef = useRef();
  const [orders, setOrders] = useState([]);
  const { id } = useParams()
  const [bankDetails, setBankDetails] = useState({});
  const [vendorOrder, setVendorOrder] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [ifscCode, setIfscCode] = useState(""); // State for IFSC code
  const [averageRating, setAverageRating] = useState(""); // State for IFSC code

  const navigate = useNavigate();
  const location = useLocation();
  const vendor = location.state;
  // console.log("vendorData", vendor);
  // console.log("vendor orders",vendorOrder)
  const [vendorData, updateVendor] = useState();

  // console.log("vendor data", vendor.vendorId)

  const token = localStorage.getItem("token");

  let count = 0;

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/vendor/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          updateVendor(data.vendor);
        } else {
          toast.warning(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchVendorDetails();
  }, [count]);

  useEffect(() => {
    if (feedbacks?.length > 0) {
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
  }, [feedbacks]);

  useEffect(() => {
    console.log("hii")
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
            body: JSON.stringify({ vendorId: id }),
          },
        );
        const data = await res.json();
        console.log(data.populatedOrders)
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
            body: JSON.stringify({ vendorId: id }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          console.log(data.feedbacks)
          setFeedbacks(data.feedbacks);
          setAverageRating(data.averageRating)
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchBankDetails = async () => {
      // console.log(vendorData)
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/fetchBankDetails`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bankId: id }),
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
        body: JSON.stringify({ vendorId: id, verificationStatus: "inactive" }),
      });

      const data = await res.json();
      console.log(data.updatedVendor)

      if (res.ok) {
        updateVendor({
          verificationStatus: data.updatedVendor.verificationStatus
        });
        toast.success("Vendor Deactivated Successfully");
        navigate("/vendors/deactivatedVendors");
      }
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
        body: JSON.stringify({ vendorId: id, verificationStatus: "active" }),
      });

      const data = await res.json();

      if (res.ok) {
        updateVendor({
          verificationStatus: data.updatedVendor.verificationStatus
        });
        toast.success("Vendor Deactivated Successfully");
        navigate("/vendors/allVendors");
      }
    } catch (error) {
      console.error("Error deactivating vendor:", error);
    }
  };

  const vendorOrderModal = (order) => {
    navigate(`/orders/orderDetails/${order.orderId}`, { state: { order } });
  };

  //IFSC
  const fetchBankDetailsByIfsc = async (ifsc) => {
    try {
      console.log("hi", ifsc)
      const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
      const data = await res.json();
      if (res.ok) {
        // setBankDetails({
        //   bankName: data.BANK,
        //   IFSC: data.IFSC,
        //   city: data.CITY,
        //   branch: data.BRANCH,
        // });
        document.getElementById('branch1').value = data.BRANCH
        document.getElementById('city').value = data.CITY
        document.getElementById('bankName1').value = data.BANK
        console.log("hi", data)
      } else {
        toast.warning(data.message || "Unable to fetch bank details");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching bank details");
    }
  };

  const handleChangetheIFSC = (e) => {
    let ifsc = e.target.value
    if (ifsc.length >= 11) {
      console.log(ifsc)// Assuming IFSC code is of length 11
      fetchBankDetailsByIfsc(ifsc);
    } else {
      // setBankDetails({});
      document.getElementById('branch1').value = "Loading..."
      document.getElementById('city').value = "Loading..."
      document.getElementById('bankName1').value = "Loading..."
    }
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const [formData, setFormData] = useState({});

  const handleChangetheprofile = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleEdit = async (e) => {

    e.preventDefault();

    const updatedFormData = { ...formData, vendorId: id, bankId: vendorData.vendorId, bankFor: "vendor" }
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

      // console.log(updatedFormData)
      const data = await res.json();
      console.log(data.updateBankDetails)
      // console.log("edited", data);
      if (res.ok) {
        updateVendor({
          name: data.updatedVendor.name,
          email: data.updatedVendor.email,
          phone: data.updatedVendor.phone,
          address: data.updatedVendor.address,
          profilePic: data.updatedVendor.profilePic,
          verificationStatus: data.updatedVendor.verificationStatus,
          capacity: data.updatedVendor.capaciy
        });
        setBankDetails({
          accountHolderName: data.updateBankDetails.accountHolderName,
          accountNumber: data.updateBankDetails.accountNumber,
          bankName: data.updateBankDetails.bankName,
          IFSC: data.updateBankDetails.IFSC,
          city: data.updateBankDetails.city,
          branch: data.updateBankDetails.branch,
        });
        setShowModal(false);
        count++;
        toast.success("vendor updated successfully");
      }
    } catch (error) {
      toast.error(error.message)
      // console.log(error);
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

  const formatDateToUTC = (date) => {
    const options = {
      timeZone: 'UTC',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
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
        <div className="container-fluid">
          <div className="row">
            <div className="d-flex flex-column m-3 flex-xl-row">
              <div className="card xl-mb-0 mr-xl-4 col-xl-4">
                <div className="bg-primary-subtle p-2">
                  <div className="row">
                    <div className="mx-auto mt-3">
                      <img
                        src={
                          vendorData && vendorData.profilePic
                            ? vendorData.profilePic
                            : "https://tse3.mm.bing.net/th?id=OIP.K4jXSK4XQahOLPEliCtvlwHaHa&pid=Api&P=0&h=180"
                        }
                        className="avatarCustom"
                        alt={vendorData ? `${vendorData.name}'s profile` : "default profile"}
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

                      {vendorData && vendorData.verificationStatus === "active" ? (
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
                              handleDeactivateVendor(vendorData.vendorId)
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
                              handleActivateVendor(vendorData.vendorId)
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
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 className="card-title font-size-20">Personal Information</h4>
      <div>
        {vendorData && vendorData.profilePic ? (
          <a href={vendorData.profilePic} target="_blank" rel="noopener noreferrer" className="mr-3">
            Profile pic
          </a>
        ) : (
          <span className="text-muted mr-3" style={{ cursor: "not-allowed" }}>
            Profile pic
          </span>
        )}
        {vendorData && vendorData.document ? (
          <a href={vendorData.document} target="_blank" rel="noopener noreferrer">
            Document
          </a>
        ) : (
          <span className="text-muted" style={{ cursor: "not-allowed" }}>
            Document
          </span>
        )}
      </div>
    </div>
    <p className="text-muted mb-4 font-size-14">
      Hi, I'm {vendorData && vendorData.name}, a trusted name in the industry, offering top-quality services and products. With years of experience, I strive to provide unparalleled customer satisfaction and value.
    </p>
    <div className="table-responsive">
      <table className="table table-nowrap mb-0">
        <tbody>
          <tr>
            <th className="headingCustom" scope="row">Full Name :</th>
            <td>{vendorData && vendorData.name}</td>
          </tr>
          <tr>
            <th className="headingCustom" scope="row">Mobile :</th>
            <td>{vendorData && vendorData.phone}</td>
          </tr>
          <tr>
            <th className="headingCustom" scope="row">E-mail :</th>
            <td>{vendorData && vendorData.email}</td>
          </tr>
          <tr>
            <th className="headingCustom" scope="row">Address :</th>
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
                      <label className="headingCustom" htmlFor="branch">
                        Branch:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="branch"
                        value={bankDetails.branch ? bankDetails.branch : "N/A"}
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

          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-row justify-content-between">
                    <span>
                      <h4 className="card-title">Orders</h4>
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
                    This Datatables is about the orders that have been
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
                            <td>{formatDateToUTC(order.orderDate)}</td>
                            <td className="text-center">{(order?.amount).toFixed(2)}</td>
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

              {/* editing this*/}
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-row justify-content-between">
                    <span>
                      <h4 className="card-title">Reviews</h4>
                    </span>
                    <div style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "5px",
                      padding: "10px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <h5 style={{
                        margin: 0,
                        color: "#333",
                        fontWeight: "bold"
                      }}>
                        Average Rating: {averageRating}
                      </h5>
                    </div>
                  </div>
                  <p className="card-title-desc">
                  All reviews given to vendors by users
                  </p>
                  <div className="table-responsive">
                    <table
                      ref={tableRef}
                      className="table table-striped table-bordered"
                    >
                      <thead>
                        <tr>
                          <th className="headingCustom">Order ID</th>
                          <th className="headingCustom">Feedback</th>
                          <th className="headingCustom">Ratings</th>
                          <th className="headingCustom">User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbacks?.length > 0 ?
                          feedbacks?.map((feedback, index) => (
                            <tr key={index}>
                              <td>{feedback?.orderId}</td>
                              <td>{feedback?.feedback}</td>
                              <td>{renderStars(parseInt(feedback?.rating))}</td>
                              <td>{(feedback?.userId)}</td>
                            </tr>
                          ))
                          : "No Reviews"}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>


              {/* <div className="border rounded shadow-sm p-3">
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
              </div> */}

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
                  <label>Address :</label>
                  <input
                    id="address"
                    type="text"
                    className="form-control"
                    placeholder="5/683 vikas nagar lucknow"
                    onChange={handleChangetheprofile}
                    defaultValue={vendorData.address}
                  />
                </div>
                <div className="form-group">
                  <label>Capacity :</label>
                  <input
                    id="capacity"
                    type="text"
                    className="form-control"
                    placeholder="10"
                    onChange={handleChangetheprofile}
                    defaultValue={vendorData.capacity}
                  />
                </div>

                {/* Add more fields as needed */}
              </form>
            </div>
            <div className="card shadow-sm mt-2 mb-4">
              <div className="card-body">
                <h5 className="card-title">Account Details</h5>
                <div className="row">

                  <div className="col-md-6">
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
                            ? bankDetails?.accountNumber
                            : "N/A"
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="headingCustom" htmlFor="IFSC">
                        IFSC Code:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="IFSC"
                        onChange={handleChangetheIFSC}
                        placeholder="BARB0FGIETX"
                        defaultValue={
                          bankDetails?.IFSC ? bankDetails?.IFSC : "N/A"
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="headingCustom" htmlFor="bankName1">
                        Bank Name:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="bankName1"
                        placeholder="Bank Of Baroda"
                        onChange={handleChangetheprofile}
                        defaultValue={
                          bankDetails?.bankName ? bankDetails?.bankName : ""
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="headingCustom" htmlFor="branch1">
                        Branch:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="branch1"
                        placeholder="Bank Of Baroda"
                        onChange={handleChangetheprofile}
                        defaultValue={
                          bankDetails?.branch ? bankDetails?.branch : "N/A"
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="headingCustom" htmlFor="city">
                        City:
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white"
                        id="city"
                        placeholder="Bank Of Baroda"
                        onChange={handleChangetheprofile}
                        defaultValue={
                          bankDetails?.city ? bankDetails?.city : "N/A"
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
              Save
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default VendorProfile;