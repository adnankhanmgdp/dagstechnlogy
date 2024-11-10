import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "datatables.net-bs4"; // Import the Bootstrap 4 DataTables extension
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const UserProfile = () => {
  const location = useLocation();
  const { phone } = useParams()
  const [decodedUser, setDecodedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const token = localStorage.getItem("token");

  // console.log("decodeUSer",decodedUser)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // useEffect(() => {
  //   if (location.state && location.state.user) {
  //     setDecodedUser(location.state.user);
  //   }
  // }, [location.state]);


  useEffect(() => {
    const fetchUserData = async () => {
      console.log(phone)
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/getUser`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ phone: phone }),
          }
        );
        const data = await res.json();
        console.log(data.user[0])
        if (res.ok) {
          setDecodedUser(data.user[0]);
        } else {
          toast.error("User not found");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchUserData();
  }, [phone, token]);

  const navigate = useNavigate();
  const tableRef = useRef();


  useEffect(() => {
    const fetchUserOrders = async () => {
      if (decodedUser) {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/UserOrders`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ phone: phone }),
            },
          );
          const data = await res.json();
          if (res.ok) {
            setUserOrders(data.orders);
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    };
    fetchUserOrders();
  }, [decodedUser]);

  useEffect(() => {
    if (userOrders.length > 0) {
      // Destroy previous instance of DataTable if exists
      if ($.fn.dataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      // Initialize DataTable
      $(tableRef.current).DataTable();
    }
  }, [userOrders]);

  const toggleEditProfileModal = () => {
    setShowEditProfileModal(!showEditProfileModal);
  };

  const [editableProfile, setEditableProfile] = useState({});

  const handleChangetheprofile = (e) => {
    setEditableProfile({ ...editableProfile, [e.target.id]: e.target.value });
  };

  const updateProfile = async () => {
    setEditableProfile({ ...editableProfile, userId: decodedUser.phone });
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/editUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableProfile),
      });
      if (res.ok) {
        toast.success("User updated successfully");
        navigate("/users/allUsers");
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleActivateUser = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/editUser`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: decodedUser.userId,
          status: "active",
        }),
      });
      if (res.ok) {
        toast.success("User activated successfully");
        navigate("/users/allUsers");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userOrderInvoice = (order) => {
    navigate(`/orders/orderDetails/${order.orderId}`, {
      state: {
        order,
      },
    });
  };

  const userCreateOrder = () => {
    navigate("/users/createOrder", {
      state: {
        decodedUser,
      },
    });
  };

  if (!decodedUser) {
    return <div>Loading...</div>; // Render loading state or redirect if user is not available
  }

  return (
    <div className="main-content" style={{ backgroundColor: "#F6F6F9" }}>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="d-flex flex-column m-3 flex-xl-row">
              <div className="card d-flex justify-content-center xl-mb-0 mr-xl-4 col-xl-4">
                <div className="bg-primary-subtle p-2">
                  <div className="row">
                    <div className="mx-auto mt-3">
                      <img
                        src={
                          decodedUser?.profilePic
                            ? decodedUser?.profilePic
                            : "https://tse3.mm.bing.net/th?id=OIP.K4jXSK4XQahOLPEliCtvlwHaHa&pid=Api&P=0&h=180"
                        } className="avatarCustom"
                        alt="user's img"
                      />
                    </div>
                    <div className="col-12">
                      <div className="p-3">
                        <h5 className="text-center">
                          {decodedUser.name}'s Profile
                        </h5>
                        <p className="text-center m-3">
                          " It will seem like simplified "
                        </p>
                      </div>
                    </div>

                    {/* <div className="d-flex flex-column mx-auto">
                      <span
                        className="mx-auto text-primary editProfileButton"
                        onClick={toggleEditProfileModal}
                      >
                        + edit profile
                      </span>
                    </div> */}

                  </div>
                </div>
              </div>
              {/* <!-- end card --> */}

              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-row justify-content-between">
                    <h4 className="card-title mb-4 font-size-20">
                      Personal Information
                    </h4>
                  </div>

                  <p className="text-muted mb-4 font-size-14">
                    Hi I'm {decodedUser.name}, has been the industry's standard
                    dummy text To an English person, it will seem like
                    simplified English, as a skeptical Cambridge.
                  </p>
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Full Name :
                          </th>
                          <td>{decodedUser.name}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Mobile :
                          </th>
                          <td>{decodedUser.phone}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            E-mail :
                          </th>
                          <td>{decodedUser.email}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Address :
                          </th>
                          <td>
                            <ul className="address-list">
                              {decodedUser.address.map((address, index) => (
                                <li key={index} className="address-item">
                                  {index + 1} - {address}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
                        <tr className="text-center">
                          <th className="headingCustom">Order ID</th>
                          <th className="headingCustom">Vendor approved</th>
                          <th className="headingCustom">Order Date</th>
                          <th className="headingCustom">Order Status</th>
                          <th className="headingCustom">View Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOrders.length > 0 ? (
                          userOrders.map((order) => (
                            <tr className="text-center" key={order.orderId}>
                              <td>{order.orderId}</td>
                              <td>({order.vendorId})</td>
                              <td>{moment(order.orderDate).format('DD MMMM YYYY')}</td>
                              <td>
                                <div>
                                  <span
                                    className="p-2 text-center rounded-pill"
                                    style={{
                                      backgroundColor:
                                        order.orderStatus[
                                          order.orderStatus.length - 1
                                        ].status === "Delivered"
                                          ? "#a7ebc0"
                                          : order.orderStatus[
                                            order.orderStatus.length - 1
                                          ].status === "Pending"
                                            ? "#ffa8a8"
                                            : order.orderStatus[
                                              order.orderStatus.length - 1
                                            ].status === "Processing"
                                              ? "#ffe38b"
                                              : order.orderStatus[
                                                order.orderStatus.length - 1
                                              ].status === "Shipped"
                                                ? "#c9ecc3"
                                                : "",
                                      width: "100px",
                                    }}
                                  >
                                    {
                                      order.orderStatus[
                                        order.orderStatus.length - 1
                                      ].status
                                    }
                                  </span>
                                </div>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <button
                                  onClick={() => userOrderInvoice(order)}
                                  className="btn btn-outline-secondary"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              Currently no orders
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showEditProfileModal && (
            <div
              className="modal"
              tabIndex="-1"
              role="dialog"
              style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Profile</h5>
                    <button
                      type="button"
                      className="close"
                      onClick={() => setShowEditProfileModal(false)}
                    >
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          id="name"
                          type="text"
                          className="form-control"
                          onChange={handleChangetheprofile}
                          defaultValue={decodedUser.name}
                        />
                      </div>
                      <div className="form-group">
                        <label>Mobile</label>
                        <input
                          id="phone"
                          type="text"
                          className="form-control"
                          disabled
                          defaultValue={decodedUser.phone}
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          id="email"
                          type="email"
                          className="form-control"
                          onChange={handleChangetheprofile}
                          defaultValue={decodedUser.email}
                        />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input
                          id="address"
                          type="text"
                          className="form-control"
                          onChange={handleChangetheprofile}
                          defaultValue={decodedUser.address}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowEditProfileModal(false)}
                    >
                      Close
                    </button>
                    <button
                      onClick={updateProfile}
                      type="button"
                      className="btn btn-primary"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

