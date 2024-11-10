import React, { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "datatables.net-bs4";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import OrderTimeline from "./OrderTimeline";
import StarRatings from 'react-star-ratings';

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tableRef = useRef();
  const [order, setOrder] = useState()
  // const order = location.state?.order;
  // console.log("order", order);
  const [showModal, setShowModal] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const { id } = useParams()
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
          body: JSON.stringify({ orderId: id }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Refund initiated successfully");
        setOrder(data)
      }
    } catch (error) {
      console.log(error)
    }
    setShowModal(false);

  };

  // Function to safely get the rating as a number
  const getRating = (rating) => {
    if (typeof rating === 'number') {
      return rating;
    }
    if (typeof rating === 'string' && !isNaN(parseFloat(rating))) {
      return parseFloat(rating);
    }
    return 0; // Default value if rating is not a valid number
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

  const [status, setStatus] = useState("");
  const [vendorDetail, setVendor] = useState({});
  const [logisticPickupDetail, setPickup] = useState({});
  const [logisticDeliveryDetail, setDelivery] = useState({});
  const [userData, setUser] = useState({});
  const currentYear = new Date().getFullYear();

  // console.log("order", location.state.order);
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/getOrder`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ orderId: id }),
          }
        );

        const data = await res.json();
        console.log(data.order)
        if (res.ok) {
          setOrder(data.order);
          setTotalQuantity(data.totalQty);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    };
    fetchOrderDetails()
  }, [])

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
          // console.log("user", data);
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
    try {
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
        }
      );
      const data = await res.json();
      // console.log(data);
      if (res.ok) {
        toast.success("Order status updated successfully");
        setOrder(data.order)
      } else {
        toast.error(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleViewInvoice = (order) => {
    navigate(`/invoice/invoiceDetail/${id}`, {
      state: {
        order,
      },
    });
  };

  const handleUserDirect = () => {
    navigate(`/users/UserProfile/${order.userId}`, {
      state: {
        order,
      },
    });
  };
  const handleVendorDirect = () => {
    navigate(`/vendors/vendorProfile/${order.vendorId}`, {
      state: {
        order,
      },
    });
  };
  const handleL1Direct = () => {
    navigate(`/logistic/partnerProfile/${order.logisticId[0]}`, {
      state: {
        order,
      },
    });
  };
  const handleL2Direct = () => {
    navigate(`/logistic/partnerProfile/${order.logisticId[1]}`, {
      state: {
        order,
      },
    });
  };

  if (!order) {
    return <div>Loading...</div>; // Show a loading message or spinner while order data is being fetched
  }

  // console.log(
  //   "orderSttatus",
  //   order.orderStatus[order.orderStatus.length - 1].status,
  // );

  return (
    <div className="main-content" style={{ minHeight: "220vh" }}>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-8 p-4">
              <h4 className="mb-4 text-center">Order Details</h4>

              {/* Order Information Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header d-flex flex-row justify-content-between align-items-center text-dark">
                  <span>Order Information</span>
                  <button
                    onClick={handleShow}
                    className={`btn ${order.orderStatus[order.orderStatus.length - 1].status === "cancelled" && order.refundRequest === true ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={
                      !(
                        order.orderStatus[order.orderStatus.length - 1].status === "cancelled" &&
                        order.refundRequest === true
                      )
                    }
                  >
                    {order.orderStatus[order.orderStatus.length - 1].status === "refunded"
                      ? 'Refunded'
                      : 'Refund'}
                  </button>
                </div>

                <div className="card-body">
                  <p>
                    <strong>Order ID:</strong> {order.orderId}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {formatDateToUTC(order.orderDate)}
                  </p>
                  <p>
                    <strong>Order Status:</strong>{" "}
                    <select
                      className="form-select"
                      value={order.orderStatus[order.orderStatus.length - 1].status}
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
                    (as of {formatDateToUTC(order.orderStatus[order.orderStatus.length - 1].time)})
                  </p>
                </div>
              </div>


              <div className="card shadow-sm mb-4">
                <div className="card-header text-dark">
                  Order Status
                </div>
                <OrderTimeline order={order} />
              </div>

              {/* Customer info Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header d-flex flex-row justify-content-between align-items-center text-dark">
                  <span>Customer Information</span>
                  <button onClick={handleUserDirect} className="btn btn-primary">
                    View User
                  </button>
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
                          <th className="text-center">Item Name</th>
                          <th className="text-center">Service Name</th>
                          <th className="text-center">Qty</th>
                          <th className="text-center">Unit Price</th>
                          <th className="text-center">Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order && order.items ? (
                          order.items.map((item) => (
                            <tr key={item.itemId}>
                              <td className="text-center">{item.itemNAME}</td>
                              <td className="text-center">{item.serviceNAME}</td>
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
                <div className="card-header d-flex flex-row justify-content-between align-items-center text-dark">
                  <span>Vendor Details</span>
                  <button
                    onClick={handleVendorDirect}
                    className={`btn ${vendorDetail ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={!vendorDetail}
                  >
                    View Vendor
                  </button>
                </div>
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
                                {vendorDetail.name ? vendorDetail.name : "not assigned yet"}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Vendor Contact:</strong>
                              </td>
                              <td>
                                {vendorDetail.phone ? vendorDetail.phone : "not assigned yet"}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Completed on:</strong>
                              </td>
                              <td>
                                {order.deliveryDate
                                  ? formatDateToUTC(order.deliveryDate)
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
                <div className="card-header d-flex flex-row justify-content-between align-items-center text-dark">
                  <span>Logistics Assigned</span>
                  <div>
                    <button
                      onClick={handleL1Direct}
                      className={`btn mr-2 ${logisticPickupDetail ? 'btn-primary' : 'btn-secondary'}`}
                      disabled={!logisticPickupDetail}
                    >
                      View Logistic Pickup
                    </button>
                    <button
                      onClick={handleL2Direct}
                      className={`btn ${logisticDeliveryDetail ? 'btn-primary' : 'btn-secondary'}`}
                      disabled={!logisticDeliveryDetail}
                    >
                      View Logistic Delivery
                    </button>
                  </div>
                </div>
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
                                <td>{formatDateToUTC(order.pickupDate)}</td>
                              </tr>
                            ) : (
                              <tr>
                                <td colSpan="2">Not picked up yet</td>
                              </tr>
                            )}
                          </>
                        ) : (
                          <tr>
                            <td colSpan="2">Pickup Logistic not assigned yet</td>
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
                                <td>{formatDateToUTC(order.deliveryDate)}</td>
                              </tr>
                            ) : (
                              <tr>
                                <td colSpan="2">Not Delivered yet</td>
                              </tr>
                            )}
                          </>
                        ) : (
                          <tr>
                            <td colSpan="2">Delivery Logistic not assigned yet</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Payment Information Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header text-dark">Payment Details</div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <td><strong>Total items:</strong></td>
                          <td>{totalQuantity}</td>
                        </tr>
                        <tr>
                          <td><strong>Items Total:</strong></td>
                          <td>{order.amount ? `₹${order.amount}` : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Delivery Fee:</strong></td>
                          <td>{order.deliveryFee ? `₹${(order.deliveryFee).toFixed(2)}` : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Tax:</strong></td>
                          <td>{order.taxes ? `₹${(order.taxes).toFixed(2)}` : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>PlatformFee:</strong></td>
                          <td>{order.platformFee ? `₹${order.platformFee}` : "N/A"}</td>
                        </tr>
                        <tr style={{ backgroundColor: '#9ED6AC' }}>
                          <td><strong>Grand total:</strong></td>
                          <td style={{ fontWeight: 'bold' }}>{order.finalAmount ? `₹${(order.finalAmount).toFixed(2)}` : "N/A"}</td>
                        </tr>
                        <tr style={{ backgroundColor: '#9ED6AC' }}>
                          <td><strong>Profit:</strong></td>
                          <td style={{ fontWeight: 'bold' }}>
                            {order.finalAmount ? `₹${(order.finalAmount - order.deliveryFee - order.vendorFee).toFixed(2)}` : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Settlement to Vendor:</strong></td>
                          <td>{order.settlementToVendor ? `₹${(order.settlementToVendor).toFixed(2)}` : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Settlement to Pickup Logistic:</strong></td>
                          <td>{order.settlementForLogisticsOnPickup ? `₹${(order.settlementForLogisticsOnPickup).toFixed(2)}` : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Settlement to Delivery Logistic:</strong></td>
                          <td>{order.settlementForLogisticsOnDelivery ? `₹${(order.settlementForLogisticsOnDelivery).toFixed(2)}` : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Discount:</strong></td>
                          <td>{order.discount ? (order.discount).toFixed(2) : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Coupon:</strong></td>
                          <td>{order.coupon ? order.coupon : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Vendor Commission:</strong></td>
                          <td>{order.vendorFee ? `₹${(order.vendorFee).toFixed(2)}` : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Delivery Type:</strong></td>
                          <td>{order.deliveryType ? `${order.deliveryType}` : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Payment Mode:</strong></td>
                          <td>RAZORPAY</td>
                        </tr>
                        <tr>
                          <td><strong>Payment Signature:</strong></td>
                          <td>{order.paymentSignature ? order.paymentSignature : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Razorpay Key:</strong></td>
                          <td>{order.razorpayKey ? order.razorpayKey : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Transaction ID:</strong></td>
                          <td>{order.transactionId ? order.transactionId : "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Order's Secret Key:</strong></td>
                          <td>{order.secretKey ? order.secretKey : "N/A"}</td>
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

              {/* Order Images Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header text-dark">Order Images</div>
                <div className="card-body">
                  {order.orderPics && order.orderPics.length > 0 ? (
                    <div className="row">
                      {order.orderPics.map((pic, index) => (
                        <div className="col-md-4 mb-3" key={index}>
                          <img
                            src={pic} // Assuming `pic` is the image URL
                            alt={`Order Image ${index + 1}`}
                            className="img-fluid"
                            style={{ borderRadius: '5px', boxShadow: '0 0 5px rgba(0,0,0,0.2)' }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
              </div>

              {/* Review Information Card */}
              <div className="card shadow-sm mb-4">
                <div className="card-header text-dark">
                  Review for Order
                </div>
                <div className="card-body">
                  <p>
                    {order?.feedbackProvided ? order?.feedbackProvided : "N/A"}
                  </p>
                  <StarRatings
                    rating={getRating(order?.feedbackRating)}
                    starRatedColor="gold"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    name="rating"
                  />
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
      {
        showModal && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Refund Confirmation</h5>
                  <button type="button" className="close" onClick={handleClose}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body ">
                  <p style={{
                    fontWeight: "bold", marginBottom: "2px"
                  }}>Amount ₹{order?.finalAmount}
                  </p>
                </div>
                <div className="modal-footer" style={{ justifyContent: "space-between" }}>
                  <p style={{ textAlign: "left", }}>
                    Do you really want to continue?
                  </p>
                  <p >
                    <button
                      type="button"
                      className="btn btn-secondary mr-2"
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
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default OrderDetails;
