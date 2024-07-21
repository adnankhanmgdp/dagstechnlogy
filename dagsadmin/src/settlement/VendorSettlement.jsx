import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "datatables.net-bs4";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";

const VendorSettlement = () => {
  const tableRef = useRef();

  const [vendorSettlements, setVendorSettlements] = useState([]);
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState({});
  const [yesClick, setYesClick] = useState({});

  const [vendorBank, setVendorBank] = useState({})
  const [vendorDetails, setVendorDetails] = useState({})

  console.log("vendorBank", vendorBank);
  console.log("vendorDetails", vendorDetails);

  useEffect(() => {
    if (vendorSettlements.length > 0) {
      // Destroy previous instance of DataTable if exists
      if ($.fn.dataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      // Initialize DataTable
      $(tableRef.current).DataTable();
    }
  }, [vendorSettlements]);

  const [verifyPayment, setVerifyPayment] = useState(false);

  const handleClose = () => {
    setYesClick({})
    setVendorBank({})
    setVendorDetails({})
    setShow(false)
  };

  console.log("yesClick", yesClick);

  const token = localStorage.getItem('token');


  const handleShow = (user) => {
    setYesClick(user);
    const vendorBank = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/fetchBankDetails`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bankId: user.orders[0].vendorId }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          setVendorBank(data.bankDetails);
        }
      } catch (error) {
        console.error("Error fetching vendor settlements", error);
      }
    };
    const getVendor = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/getVendor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ vendorId: user.orders[0].vendorId }),
        });
        const data = await res.json();
        if (res.ok) {
          setVendorDetails(data.vendor);
        }
      } catch (error) {
        console.error("Error fetching vendor settlements", error);
      }
    };
    vendorBank();
    getVendor();
    setShow(true);
    setModalData(user);
  };

  const seeDetails = (order) => {
    navigate("/orders/orderDetails", {
      state: {
        order,
      },
    });
  };

  useEffect(() => {
    const vendorSettlement = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/vendorSettlement`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        if (res.ok) {
          setVendorSettlements(data);
          console.log("data", data);
        }
      } catch (error) {
        console.error("Error fetching vendor settlements", error);
      }
    };
    vendorSettlement();
  }, []);

  const settleAmount = () => {
    setShow(false)
    setVerifyPayment(true);
  }

  const navigate = useNavigate();

  const closeSettleModal = () => {
    setShow(true)
    setVerifyPayment(false);
    navigate("/settlement/VendorSettlement");
  }



  const paymentDone = async () => {

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/settleVendorAmount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(yesClick),
        },
      );

      const data = await res.json();
      if (res.ok) {
        console.log(data)
      }

    } catch (error) {

    }

    setShow(false)
    setVerifyPayment(false)
    navigate("/settlement/SettlementHistory");
  }

  return (
    <div className="main-content" style={{ backgroundColor: "#F6F6F9" }}>
      <ToastContainer />
      <div className="page-content">
        <div className="container-fluid p-2">
          <h5 className="text-center">Settlement of Vendor</h5>
          <div className="table-responsive tableBg p-3">
            <table
              ref={tableRef}
              className="table table-bordered table-hover table-centered mb-0"
            >
              <thead>
                <tr className="text-center">
                  <th>Vendor Id</th>
                  <th>Orders Completed</th>
                  <th>Payment Generated</th>
                  <th>View Summary</th>
                </tr>
              </thead>
              <tbody>
                {vendorSettlements.length > 0 ? (
                  vendorSettlements.map((user) => (
                    <tr className="text-center" key={user.vendorId}>
                      <td>{user.orders[0].vendorId}</td>
                      <td>{user.orders.length}</td>
                      <td>₹ {user.totalSettlement}</td>
                      <td>
                        <button
                          onClick={() => handleShow(user)}
                          className="pl-5 border-0 bg-primary text-white pr-5"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <span className="text-center">No settlement for the vendor</span>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {show && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title style={{ fontSize: "17px" }}>
              Settlement Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="shadow-sm d-flex flex-row">
              <div
                style={{ borderRadius: "30px" }}
                className="text-center ml-3 w-50 d-flex flex-column border p-4 bg-white mb-3"
              >
                <img
                  src="/assets/images/users/avatar-1.jpg"
                  alt="VendorImage"
                  className="avatar-sm mx-auto rounded-circle"
                />
                <div className="mt-2 d-flex flex-column flex-start">
                  <span>
                    {vendorDetails.name} ({vendorDetails.vendorId})
                  </span>
                  <span>{vendorDetails.address}</span>
                </div>
              </div>
              <div className="mx-auto mt-4">
                <span>Amount to Settle :</span> <br />
                <span style={{ fontSize: "25px" }}>
                  ₹{modalData.totalSettlement}
                </span>{" "}
                <br />
                <button
                  onClick={settleAmount}
                  className="bg-success mt-2 text-white border-0 pl-4 pr-4 pt-1 pb-1"
                >
                  Settle Amount
                </button>
              </div>
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
                        value={vendorBank.accountHolderName}
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
                        value={vendorBank.accountNumber}
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
                        value={vendorBank.bankName}
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
                        value={vendorBank.IFSC}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr className="text-center">
                    <th className="text-center">Order Date</th>
                    <th className="text-center">Order Id</th>
                    <th className="text-center">View details</th>
                  </tr>
                </thead>
                <tbody>
                  {modalData.orders.map((order, index) => (
                    <tr className="text-center" key={index}>
                      <td>{order.orderDate}</td>
                      <td>{order.orderId}</td>
                      <td>
                        <button
                          onClick={() => seeDetails(order)}
                          className="bg-primary text-white border-0 pl-3 pr-3 pt-1 pb-1"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {verifyPayment && (
        <Modal show={verifyPayment}>
          <Modal.Header>
            <Modal.Title style={{ fontSize: "17px" }}>
              Verify Payment
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>have you made the payment yet ?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={paymentDone}>
              Yes
            </Button>
            <Button variant="secondary" onClick={closeSettleModal}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default VendorSettlement;
