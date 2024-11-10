import React, { useEffect, useState, useRef } from "react";
import "datatables.net-bs4";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";

const Orderss = () => {
  const [orders, setOrders] = useState([]);
  const tableRef = useRef();
  const navigate = useNavigate();

  // console.log("orders", orders)

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
        // console.log("order User",data.orders)
        if (res.ok) {
          setOrders(data.populatedOrders);
        }
      } catch (error) {
        console.error(error);
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
        order: [[3, "desc"]]
      });
    }
  }, [orders]);

  const handleNavigation = (order) => {
    navigate(`/orders/orderDetails/${order.orderId}`, { state: { order } });
  };

  return (
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
                  <li className="breadcrumb-item active">All orders</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid tableBg p-3">
          <table ref={tableRef} className="table">
            <thead>
              <tr className="text-center">
                <th>Order Date</th>
                <th>User Name</th>
                <th>User Phone</th>
                <th>Order Id</th>
                <th>Order Status</th>
                <th>Vendor Approved</th>
                <th>Pickip Logistic</th>
                <th>Delivery Logistic</th>
                <th>Order Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr className="text-center">
                  <td colSpan="9">
                    <h5>No orders found</h5>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  const lastStatus = order.orderStatus[order.orderStatus.length - 1].status;
                  if (lastStatus !== 'delivered' && lastStatus !== 'cancelled' && lastStatus !== 'refunded') {
                    return (
                      <tr className="text-center" key={index}>
                        <td>{moment(order.orderDate).format('DD MMMM YYYY')}</td>
                        <td>{order.user?.name}</td>
                        <td>{order.user?.phone}</td>
                        <td>{order.orderId}</td>
                        <td>{order.orderStatus[order.orderStatus.length - 1].status}</td>
                        <td>
                          {order.vendor?.name ? order.vendor.name : "---"} (
                          {order.vendor?.phone ? order.vendor.phone : "---"})
                        </td>
                        <td>
                          {order?.logistics[0]?.name ? order?.logistics[0]?.name : "---"}
                          {order.logistics[0]?.phone ? ` (${order.logistics[0]?.phone})` : ""}
                        </td>
                        <td>
                          {order.logistics[1]?.name ? order.logistics[1]?.name : "---"}
                          {order.logistics[1]?.phone ? ` (${order.logistics[1]?.phone})` : ""}
                        </td>
                        <td>
                          <button
                            style={{ fontSize: "13px" }}
                            onClick={() => handleNavigation(order)}
                            className="btn btn-outline-secondary text-white bg-success"
                          >
                            Order Details
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Orderss;
