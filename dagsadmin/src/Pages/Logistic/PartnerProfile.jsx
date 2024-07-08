import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4"; // Import the Bootstrap 4 DataTables extension
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PartnerProfile = () => {
  const tableRef = useRef();
  const [orders, setOrders] = useState([]);
  const [bankDetails, setBankDetails] = useState({});
  const [vendorOrder, setVendorOrder] = useState([]);

  console.log("orders", orders)
  console.log("vendorOrder", vendorOrder)

  const navigate = useNavigate();
  const location = useLocation();
  const logistic = location.state;
  const [logisticData, updatedLogistic] = useState(logistic);

  // console.log("logistic", logisticData)
  // console.log("logisticcccccccc",logistic)

  const token = localStorage.getItem("token");

  let count = 0;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/logisticOrders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              logisticId: logistic.logisticId
            }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders);
          setVendorOrder(data.orders);
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
            body: JSON.stringify({ bankId: logisticData.partnerId? logisticData.partnerId:logisticData.logisticId }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          setBankDetails(data.bankDetails || {});
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
      }
    };

    fetchOrders();
    fetchBankDetails();
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

  const handleDeactivateVendor = async (logisticId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/updateLogistic`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ logisticId, status: "inactive" }),
        },
      );
      if (res.ok) {
        navigate("/logistic/allPartners");
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Error deactivating vendor:", error);
    }
  };

  const vendorOrderModal = (order) => {
    navigate("/invoice/invoiceDetail", {
      state: { order },
    });
  };

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const [formData, setFormData] = useState({});

  const handleChangetheprofile = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const logisticId = logisticData.logisticId
    const updatedFormData = { ...formData, logisticId };
    console.log("formData", updatedFormData );
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/updateLogistic`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFormData),
        },
      );
      console.log("res",res)
      const data = await res.json();
      if (res.ok) {
        setBankDetails({
          accountHolderName: data.updateLogistic?.accountHolderName,
          accountNumber: data.updateLogistic?.accountNumber,
          bankName: data.updateLogistic?.bankName,
          IFSC: data.updateLogistic?.IFSC,
        });
        updatedLogistic({
          name: data.updateLogistic.name,
          email: data.updateLogistic.email,
          phone: data.updateLogistic.phone,
          address: data.updateLogistic.address,
        });
        setShowModal(false);
        count++;
        toast.success("Logistic updated successfully");
      }
    } catch (error) {
      console.log(error);
    }
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
                        src="https://tse2.mm.bing.net/th?id=OIP.6UhgwprABi3-dz8Qs85FvwHaHa&pid=Api&P=0&h=180"
                        className="avatarCustom"
                        alt="user's img"
                      />
                    </div>
                    <div className="col-12">
                      <div className="p-3">
                        <h5 className="text-center">
                          {logisticData && logisticData.name}'s Profile
                        </h5>
                        <p className="text-center text-primary">
                          " It will seem like simplified "
                        </p>
                      </div>
                      <div className="d-flex h-25 flex-column">
                        <button
                          onClick={() => setShowModal(true)}
                          style={{ borderRadius: "7px" }}
                          className="bg-primary border-0 text-white pt-1 pb-1 pl-4 pr-4"
                        >
                          Edit Logistic's profile
                        </button>
                        <button
                          onClick={() =>
                            handleDeactivateVendor(logisticData.logisticId)
                          }
                          style={{ borderRadius: "7px" }}
                          className="bg-danger mt-2 border-0 text-white pt-1 pb-1 pl-4 pr-4"
                        >
                          Deactivate Logistic
                        </button>
                      </div>
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
                    Hi, I'm {logisticData && logisticData.name}, a trusted name
                    in the logistics industry, dedicated to providing efficient
                    and reliable transportation and supply chain solutions.
                  </p>
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Full Name :
                          </th>
                          <td>{logisticData && logisticData.name}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Mobile :
                          </th>
                          <td>{logisticData && logisticData.phone}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            E-mail :
                          </th>
                          <td>{logisticData && logisticData.email}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Location :
                          </th>
                          <td>{logisticData && logisticData.address}</td>
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
                            : ""
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
                            : ""
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
                        value={bankDetails.bankName ? bankDetails.bankName : ""}
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
                        value={bankDetails.IFSC ? bankDetails.IFSC : ""}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Recent Orders</h4>
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
                                  {order.orderStatus[0].status}
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
                    defaultValue={logisticData.name}
                  />
                </div>
                <div className="form-group">
                  <label>Mobile :</label>
                  <input
                    id="phone"
                    type="text"
                    className="form-control"
                    readOnly
                    defaultValue={logisticData.phone}
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
                    defaultValue={logisticData.email}
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
                    defaultValue={logisticData.address}
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
                            : "No Data"
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
                        id="accountNo"
                        onChange={handleChangetheprofile}
                        defaultValue={
                          bankDetails.accountNumber
                            ? bankDetails.accountNumber
                            : "No Data"
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
                        onChange={handleChangetheprofile}
                        defaultValue={
                          bankDetails.bankName
                            ? bankDetails.bankName
                            : "No Data"
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
                        id="ifscCode"
                        onChange={handleChangetheprofile}
                        defaultValue={
                          bankDetails.IFSC ? bankDetails.IFSC : "No Data"
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

export default PartnerProfile;
