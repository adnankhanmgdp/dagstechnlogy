import React, { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "datatables.net-bs4";
import { useLocation, useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tableRef = useRef();
  const order = location.state?.order;
  console.log("order", order);
  const [showModal, setShowModal] = useState(false);


  const token = localStorage.getItem("token");

  const handleShow = () => setShowModal(true);
  const handleRefund = async () => {

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/initiateRefund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ orderId: order.orderId }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Refund initiated successfully");
      }
    } catch (error) {
      console.log(error)
    }
    setShowModal(false);

  };



  const [status, setStatus] = useState("");
  const [vendorDetail, setVendor] = useState({});
  const [logisticPickupDetail, setPickup] = useState({});
  const [logisticDeliveryDetail, setDelivery] = useState({});
  const [userData, setUser] = useState({});
  const currentYear = new Date().getFullYear();

  // console.log("order", location.state.order);

  useEffect(() => {
    if (order && order.items && order.items.length > 0) {
      // Destroy previous instance of DataTable if exists
      if ($.fn.dataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
      // Initialize DataTable
      $(tableRef.current).DataTable();
    }
  }, [order]);

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    const getVendor = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/getVendor`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ vendorId: order.vendorId }),
        });
        const data = await res.json();
        if (res.ok) {
          setVendor(data.vendor[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const getDelivery = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/getLogistic`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ logisticId: order.logisticId[1] }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          setDelivery(data.logistic[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const getPickup = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/getLogistic`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ logisticId: order.logisticId[0] }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          setPickup(data.logistic[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };



    const getUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/getUser`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ phone: order.userId }),
        });
        const data = await res.json();
        if (res.ok) {
          console.log("user", data);
          setUser(data.user[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (order) {
      getVendor();
      getDelivery();
      getPickup();
      getUser();
    }
  }, [order, token]);

  const handleStatusChange = async (event) => {
    setStatus(event.target.value);
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/updateOrderStatus`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order.orderId,
          newStatus: event.target.value,
        }),
      },
    );
    const data = await res.json();
    if (res.ok) {
      toast.success("Order status updated successfully");
    }
  };

  const handleViewInvoice = (order) => {
    navigate("/invoice/invoiceDetail", {
      state: {
        order,
      },
    });
  };

  if (!order) {
    return <div>Loading...</div>; // Show a loading message or spinner while order data is being fetched
  }

  console.log(
    "orderSttatus",
    order.orderStatus[order.orderStatus.length - 1].status,
  );

  return (
    <div className="main-content" style={{ minHeight: "220vh" }}>
      <ToastContainer />
      <div className="page-content">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-8 p-4">
              <h4 className="mb-4 text-center">Order Details</h4>

              {/* Order Information Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header d-flex flex-row justify-content-between align-items-center text-dark">
                  <span>Order Information</span>
                  {order.orderStatus[order.orderStatus.length - 1].status ===
                    "cancelled" &&
                    order.refundRequest === true && (
                      <button onClick={handleShow} className="btn btn-primary">
                        Refund
                      </button>
                    )}
                </div>
                <div className="card-body">
                  <p>
                    <strong>Order ID:</strong> {order.orderId}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Order Status:</strong>{" "}
                    <select
                      className="form-select"
                      value={
                        order.orderStatus[order.orderStatus.length - 1].status
                      }
                      onChange={handleStatusChange}
                    >
                      <option value="pending">pending</option>
                      <option value="initiated">initiated</option>
                      <option value="readyToPickup">readyToPickup</option>
                      <option value="pickedUp">pickedUp</option>
                      <option value="cleaning">cleaning</option>
                      <option value="readyToDelivery">readyToDelivery</option>
                      <option value="outForDelivery">outForDelivery</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                      <option value="refunded">refunded</option>
                    </select>{" "}
                    (as of{" "}
                    {new Date(order.orderStatus[0].time).toLocaleString()})
                  </p>
                </div>
              </div>

              <div className="card shadow-sm mb-4">
                <div className="card-header text-dark">
                  Customer Information
                </div>
                <div className="card-body">
                  <p>
                    <strong>Customer Name:</strong>{" "}
                    {userData ? userData.name : "---"}
                  </p>
                  <p>
                    <strong>Customer Phone:</strong>{" "}
                    {userData ? userData.phone : "---"}
                  </p>
                  <p>
                    <strong>Order Location:</strong>{" "}
                    {order.orderLocation ? order.orderLocation : "N/A"}
                  </p>
                </div>
              </div>

              {/* Items Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header text-dark">Items</div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table
                      ref={tableRef}
                      className="table table-striped table-bordered"
                    >
                      <thead>
                        <tr>
                          <th className="text-center">Item ID</th>
                          <th className="text-center">Service ID</th>
                          <th className="text-center">Qty</th>
                          <th className="text-center">Unit Price</th>
                          <th className="text-center">Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order && order.items ? (
                          order.items.map((item) => (
                            <tr key={item.itemId}>
                              <td className="text-center">{item.itemId}</td>
                              <td className="text-center">{item.serviceId}</td>
                              <td className="text-center">{item.qty}</td>
                              <td className="text-center">
                                {item.unitPrice !== "N/A"
                                  ? `₹${item.unitPrice}`
                                  : "N/A"}
                              </td>
                              <td className="text-center">
                                {item.unitPrice !== "N/A"
                                  ? `₹${item.qty * item.unitPrice}`
                                  : "N/A"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Vendor Assigned Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header text-dark">Vendor Details</div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        {vendorDetail ? (
                          <>
                            <tr>
                              <td>
                                <strong>Vendor Name:</strong>
                              </td>
                              <td>
                                {vendorDetail.name
                                  ? vendorDetail.name
                                  : "not assigned yet"}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Vendor Contact:</strong>
                              </td>
                              <td>
                                {vendorDetail.phone
                                  ? vendorDetail.phone
                                  : "not assigned yet"}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Completed on:</strong>
                              </td>
                              <td>
                                {order.deliveryDate
                                  ? new Date(
                                    order.deliveryDate,
                                  ).toLocaleDateString()
                                  : "In process"}
                              </td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td colSpan="2">Vendor Not Assigned Yet</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Logistics Assigned Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header text-dark">Logistics Assigned</div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        {logisticPickupDetail ? (
                          <>
                            <tr>
                              <td>
                                <strong>Pickup Logistic name:</strong>
                              </td>
                              <td>{logisticPickupDetail.name}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Pickup Logistic contact:</strong>
                              </td>
                              <td>{logisticPickupDetail.phone}</td>
                            </tr>
                            {order.pickupDate ? (
                              <tr>
                                <td>
                                  <strong>Picked:</strong>
                                </td>
                                <td>
                                  {new Date(
                                    order.pickupDate,
                                  ).toLocaleDateString()}
                                </td>
                              </tr>
                            ) : (
                              <tr>
                                <td colSpan="2">Not picked up yet</td>
                              </tr>
                            )}
                          </>
                        ) : (
                          <tr>
                            <td colSpan="2">
                              Pickup Logistic not assigned yet
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan="2"></td>
                        </tr>
                        {logisticDeliveryDetail ? (
                          <>
                            <tr>
                              <td>
                                <strong>Delivery Logistic name:</strong>
                              </td>
                              <td>{logisticDeliveryDetail.name}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Delivery Logistic contact:</strong>
                              </td>
                              <td>{logisticDeliveryDetail.phone}</td>
                            </tr>
                            {order.deliveryDate ? (
                              <tr>
                                <td>
                                  <strong>Delivered:</strong>
                                </td>
                                <td>
                                  {new Date(
                                    order.deliveryDate,
                                  ).toLocaleDateString()}
                                </td>
                              </tr>
                            ) : (
                              <tr>
                                <td colSpan="2">Not Delivered yet</td>
                              </tr>
                            )}
                          </>
                        ) : (
                          <tr>
                            <td colSpan="2">
                              Delivery Logistic not assigned yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="card shadow-sm mb-4">
                <div className="card-header text-dark">Payment Details</div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Total items:</strong>
                          </td>
                          <td>{order.items.length}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Discount:</strong>
                          </td>
                          <td>{order.discount ? order.discount : "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Vendor Commission:</strong>
                          </td>
                          <td>
                            {order.vendorFee ? `₹${order.vendorFee}` : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Delivery Fee:</strong>
                          </td>
                          <td>
                            {order.deliveryFee
                              ? `₹${order.deliveryFee}`
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Tax:</strong>
                          </td>
                          <td>{order.taxes ? `₹${order.taxes}` : "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Grand total:</strong>
                          </td>
                          <td>{order.amount ? `₹${order.amount}` : "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Profit:</strong>
                          </td>
                          <td>
                            {order.amount
                              ? `₹${order.amount -
                              order.deliveryFee -
                              order.vendorFee
                              }`
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Payment Mode:</strong>
                          </td>
                          <td>RAZORPAY</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Payment Signature:</strong>
                          </td>
                          <td>
                            {order.paymentSignature
                              ? order.paymentSignature
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Razorpay Key:</strong>
                          </td>
                          <td>
                            {order.razorpayKey ? order.razorpayKey : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Transaction ID:</strong>
                          </td>
                          <td>
                            {order.transactionId ? order.transactionId : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Secret Key:</strong>
                          </td>
                          <td>{order.secretKey ? order.secretKey : "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Settlement to Vendor:</strong>
                          </td>
                          <td>
                            {order.settlementToVendor
                              ? `₹${order.settlementToVendor}`
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Settlement to Pickup Logistic:</strong>
                          </td>
                          <td>
                            {order.settlementForLogisticsOnPickup
                              ? `₹${order.settlementForLogisticsOnPickup}`
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Settlement to Delivery Logistic:</strong>
                          </td>
                          <td>
                            {order.settlementForLogisticsOnDelivery
                              ? `₹${order.settlementForLogisticsOnDelivery}`
                              : "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Additional Information Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header text-dark">
                  Additional Information
                </div>
                <div className="card-body">
                  <p>
                    <strong>Notes:</strong> {order.notes ? order.notes : "N/A"}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  className="btn w-100 btn-primary mb-3"
                  onClick={() => handleViewInvoice(order)}
                >
                  View Invoice
                </button>
              </div>
              <footer className="text-center text-dark">
                <p>&copy; {currentYear} Dags</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Refund Confirmation</h5>
                <button type="button" className="close" onClick={handleClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>You have refunded</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRefund}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
