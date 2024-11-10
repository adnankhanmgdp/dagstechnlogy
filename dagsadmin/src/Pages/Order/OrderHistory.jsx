import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import { Link, useNavigate } from "react-router-dom";
import "datatables.net-bs4";

const Order = () => {
  const tableRef = useRef();

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/fetchOrders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        // console.log("this is dataaaaaaaa", data)

        if (res.ok) {
          const deliveredOrders = data.populatedOrders.filter(
            (order) =>
              order.orderStatus[order.orderStatus.length - 1].status === "delivered"
          );
          setOrders(deliveredOrders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    getOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      // Destroy previous instance of DataTable if exists
      if ($.fn.dataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      // Initialize DataTable
      $(tableRef.current).DataTable({
        order: [[1, "desc"]]
      });
    }
  }, [orders]);

  const handleNavigation = (order) => {
    navigate(`/orders/orderDetails/${order.orderId}`, { state: { order } });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <>
      <div style={{ background: "#F8F8FB" }} className="main-content">
        <div className="page-content">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">Orders List</h4>

                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="#">Orders</Link>
                    </li>
                    <li className="breadcrumb-item active"> Order history</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid tableBg p-3">
            <div className="table-responsive">
              <table
                ref={tableRef}
                className="table table-striped table-bordered"
              >
                <thead>
                  <tr>
                    <th className="text-center">User Name</th>
                    <th className="text-center">Order ID</th>
                    <th className="text-center">Vendor approved</th>
                    <th className="text-center">Order Date</th>
                    <th className="text-center">Order Status</th>
                    <th className="text-center">Total Price</th>
                    <th className="text-center">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.orderId}>
                        <td className="text-center">
                          <span className="text-[12px]">({order.userId})</span>
                        </td>
                        <td className="text-center">{order.orderId}</td>
                        <td className="text-center">
                          {" "}
                          {order.vendorId ? order.vendorId : "---"}
                        </td>
                        <td className="text-center">
                          {formatDate(order.orderDate)}
                        </td>
                        <td className="text-center">
                          <div>
                            <span
                              className="p-2 rounded-pill"
                              style={{
                                backgroundColor:
                                  order.orderStatus[0].status === "Cancelled"
                                    ? "#a7ebc0"
                                    : order.orderStatus[0].status ===
                                      "Delivered"
                                      ? "#ffa8a8"
                                      : "",
                                width: "100px",
                              }}
                            >
                              {order.orderStatus[order.orderStatus.length - 1].status}
                            </span>
                          </div>
                        </td>

                        <td className="text-center">
                          {order.amount ? order.amount : "---"}
                        </td>
                        <td
                          className="text-center"
                          style={{ textAlign: "center" }}
                        >
                          <button
                            style={{ fontSize: "13px" }}
                            onClick={() => handleNavigation(order)}
                            className="btn btn-outline-secondary text-white bg-success"
                          >
                            Order Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <span> No history Orders </span>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
