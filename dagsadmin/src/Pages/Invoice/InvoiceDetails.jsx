import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const InvoiceDetails = () => {
  const location = useLocation();
  const [order, setOrder] = useState()
  const userOrder = location.state?.order;
  // const orderLocation = location.state.location
  const { id } = useParams();

  // console.log("userOrderrrr", userOrder);

  const token = localStorage.getItem("token");

  const [dataOfUser, setDataOfUser] = useState({});
  const [allTotal, setAllTotal] = useState(0);
  // console.log("dataOfUser", dataOfUser)

  useEffect(() => {
    const fetchOrderAndUserDetails = async () => {
      try {
        // Fetch order details
        const orderRes = await fetch(
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

        const orderData = await orderRes.json();
        if (orderRes.ok) {
          setOrder(orderData.order);

          // Fetch user details using userId from order
          const userRes = await fetch(`${process.env.REACT_APP_API_URL}/getUser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              phone: orderData.order.userId,
            }),
          });

          const userData = await userRes.json();
          if (userRes.ok) {
            console.log("userOrderData", userData.user[0]);
            setDataOfUser(userData.user[0]);
          }
        } else {
          toast.error(orderData.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    };

    fetchOrderAndUserDetails();
  }, [id, token]);


  useEffect(() => {
    if (order?.items) {
      const newTotal = order.items.reduce(
        (acc, item) => acc + item.unitPrice * item.qty,
        0,
      );
      setAllTotal(newTotal);
    }
  }, [order]);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div>
        <h2>No order details available</h2>
        <Link to="/invoices">Go back to invoices</Link>
      </div>
    );
  }

  return (
    <div
      style={{ background: "#F8F8FB", minHeight: "100vh" }}
      className="main-content"
    >
      <div className="page-content">
        <div className="container-fluid">
          {/* <!-- start page title --> */}
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">Detail</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/invoices">Invoices</Link>
                    </li>
                    <li className="breadcrumb-item active">Detail</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- end page title --> */}

          <div className="row">
            <div className="col-lg-12">
              <div className="card p-5">
                <div className="card-body">
                  <div className="invoice-title d-flex justify-content-between">
                    <div className="auth-logo mb-4">
                      <img
                        src="/assets/Dags.jpg"
                        alt="logo"
                        className="auth-logo-dark"
                        height="20"
                      />
                    </div>
                    <h4 className="float-end font-size-16">
                      Order # {order && order.orderId}
                    </h4>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-6">
                      <address>
                        <strong>Billed To:</strong>
                        <br />
                        {dataOfUser && dataOfUser.name}
                        <br />
                        {order.orderLocation}
                      </address>
                    </div>
                    <div className="col-sm-6 text-sm-end">
                      <address className="mt-2 mt-sm-0">
                        <strong>Shipped To:</strong>
                        <br />
                        {dataOfUser && dataOfUser.name}
                        <br />
                        {order.orderLocation}
                      </address>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 mt-3">
                      <address>
                        <strong>Payment Method:</strong>
                        <br />
                        Razorpay
                      </address>
                      <address>
                        <strong>Transaction Id:</strong>
                        <br />
                        {order.transactionId ? order.transactionId : "N/A"}
                      </address>
                    </div>
                    <div className="col-sm-6 mt-3 text-sm-end">
                      <address>
                        <strong>Order Date:</strong>
                        <br />
                        {order && Date(order.orderDate).toLocaleString('hi')}
                        <br />
                        <br />
                      </address>
                    </div>
                  </div>
                  <div className="py-2 mt-3">
                    <h3 className="font-size-15 fw-bold">Order summary</h3>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-nowrap">
                      <thead>
                        <tr>
                          <th colSpan="3" style={{ width: "70px" }}>
                            No.
                          </th>
                          <th>Item</th>
                          <th className="text-center">Quantity</th>
                          <th className="text-center">Price</th>
                          <th className="text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order &&
                          order.items.map((item, index) => (
                            <tr key={index}>
                              <td colSpan="3">{item.itemId}</td>
                              {/* <td>Shirt</td> */}
                              <td className="text-center">{item.itemNAME}</td>
                              <td className="text-center">{item.qty}</td>
                              <td className="text-center">₹{item.unitPrice}</td>
                              <td className="text-center">
                                ₹{item.unitPrice * item.qty}
                              </td>
                            </tr>
                          ))}

                        <tr>
                          <td colSpan="8"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="w-100 my-5 d-flex justify-content-end">
                    <div className="d-flex flex-column w-25 mr-5">
                      <div className="mb-2 d-flex flex-row justify-content-between">
                        <strong>Items Total</strong>
                        <span>₹{order.amount.toFixed(2)}</span>
                      </div>
                      <div className="mb-2 d-flex flex-row justify-content-between">
                        <strong>Shipping</strong>
                        <span>+₹{order && order.deliveryFee ? order.deliveryFee.toFixed(2) : "N/A"}</span>
                      </div>
                      <div className="mb-2 d-flex flex-row justify-content-between">
                        <strong>Discount</strong>
                        <span>-₹{order && order.discount ? order.discount.toFixed(2) : 0 }</span>
                      </div>
                      <div className="mb-2 d-flex flex-row justify-content-between">
                        <strong>Tax</strong>
                        <span>+₹{order && order.taxes? order.taxes.toFixed(2) : 0}</span>
                      </div>
                      <div className="mb-2 d-flex flex-row justify-content-between">
                        <strong>Total</strong>
                        <span>₹{order && order.finalAmount ? order.finalAmount.toFixed(2) : "N/A"}</span>
                      </div>
                    </div>
                  </div>


                  <div className="d-print-none">
                    <div className="float-right">
                      <Link
                        to="#"
                        onClick={handlePrint}
                        className="btn btn-success waves-effect waves-light mx-3"
                      >
                        <i className="fa fa-print"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
