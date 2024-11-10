import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "datatables.net-bs4";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";

const LogisticSettlementDelivery = () => {
  const tableRef = useRef();
  const navigate = useNavigate();

  const [logisticDeliverySettlement, setLogisticDeliverySettlement] = useState(
    [],
  );
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState({});
  const [yesClick, setYesClick] = useState({});

  const token = localStorage.getItem('token');

  const [logisticBank, setLogisticBank] = useState({});
  const [logisticDetails, setLogisticDetails] = useState({});
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

  // console.log("logisticBank", logisticBank);
  // console.log("logisticDetails", logisticDetails);

  useEffect(() => {
    if (logisticDeliverySettlement.length > 0) {
      // Destroy previous instance of DataTable if exists
      if ($.fn.dataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      // Initialize DataTable
      $(tableRef.current).DataTable();
    }
  }, [logisticDeliverySettlement]);

  const [verifyPayment, setVerifyPayment] = useState(false);

  const handleClose = () => {
    setYesClick({});
    setLogisticBank({});
    setLogisticDetails({});
    setShow(false);
  };

  // console.log("yesClick", yesClick);

  const handleShow = (user) => {
    setYesClick(user);

    // console.log("bandjhbhfvbdjbjdsfgbbgrffgvb", user.orders[0].logisticId);

    const logisticBank = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/fetchBankDetails`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bankId: user.orders[0].logisticId }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          setLogisticBank(data.bankDetails);
        }
      } catch (error) {
        console.error("Error fetching vendor settlements", error);
      }
    };
    const getLogistic = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/getLogistic`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ logisticId: user.orders[0].logisticId }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          // console.log("fetchLogistic", data.logistic);
          setLogisticDetails(data.logistic[0]);
        }
      } catch (error) {
        console.error("Error fetching vendor settlements", error);
      }
    };
    logisticBank();
    getLogistic();
    setShow(true);
    setModalData(user);
  };

  useEffect(() => {
    const logisticDeliverySettlement = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/deliverySettlement`,
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
          console.log(data)
          setLogisticDeliverySettlement(data);
          // console.log("data", data);
        }
      } catch (error) {
        console.error("Error fetching vendor settlements", error);
      }
    };
    logisticDeliverySettlement();
  }, []);

  const settleAmount = () => {
    setShow(false);
    setVerifyPayment(true);
  };


  const closeSettleModal = () => {
    setShow(true);
    setVerifyPayment(false);
    navigate("/settlement/LogisticSettlementDelivery");
  };

  const paymentDone = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/settleDeliveredAmount`,
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
        // console.log(data);
        toast.success("Amount Settled Successfully")
        navigate("/settlement/SettlementHistory");
      }
    } catch (error) {
      toast.error(error.message)
     }

    setShow(false);
    setVerifyPayment(false);
   
  };

  const seeDetails = (order) => {
    navigate("/orders/orderDetails", {
      state: {
        order,
      },
    });
  };

  return (
    <div className="main-content" style={{ backgroundColor: "#F6F6F9" }}>
      <div className="page-content">
        <div className="container-fluid p-2">
          <h5 className="text-center">Settlement of Logistic delivery</h5>
          <div className="table-responsive tableBg p-3">
            <table
              ref={tableRef}
              className="table table-bordered table-hover table-centered mb-0"
            >
              <thead>
                <tr className="text-center">
                  <th>Logistic Id</th>
                  <th>Orders Completed</th>
                  <th>Payment Generated</th>
                  <th>View Summary</th>
                </tr>
              </thead>
              <tbody>
                {logisticDeliverySettlement.length > 0 ? (
                  logisticDeliverySettlement.map((user) => (
                    <tr className="text-center" key={user.orders[0].logisticId}>
                      <td>{user.orders[0].logisticId[1]}</td>
                      <td>{user.orders.length}</td>
                      <td>₹ {(user.totalSettlement).toFixed(2)}</td>
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
                ) : (<span className="text-center">No settlements for Logistic</span>
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
                  src={
                    logisticDetails && logisticDetails?.profilePic
                      ? logisticDetails?.profilePic
                      : "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG-Free-Download.png"
                  }
                  alt="VendorImage"
                  className="avatar-sm mx-auto rounded-circle"
                />
                <div className="mt-2 d-flex flex-column flex-start">
                  <span>
                    {logisticDetails?.name} ({logisticDetails?.logisticId})
                  </span>
                  <span>{logisticDetails?.address}</span>
                </div>
              </div>
              <div className="mx-auto mt-4">
                <span>Amount to Settle :</span> <br />
                <span style={{ fontSize: "25px" }}>
                  ₹{(modalData?.totalSettlement.toFixed(2))}
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
                        value={logisticBank?.accountHolderName}
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
                        value={logisticBank?.accountNumber}
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
                        value={logisticBank?.bankName}
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
                        value={logisticBank?.IFSC}
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
                      <td>{formatDateToUTC(order?.orderDate)}</td>
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

export default LogisticSettlementDelivery;
