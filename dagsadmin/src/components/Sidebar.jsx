import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [subMenuStates, setSubMenuStates] = useState({
    users: false,
    orders: false,
    vendors: false,
    logisticPartner: false,
    payments: false,
    categories: false,
    invoices: false,
    miscellaneous: false,
    settlement: false,
  });

  const toggleSubMenu = (menu) => {
    setSubMenuStates((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <div className="vertical-menu">
      <div data-simplebar className="h-100">
        <div className="sidebar-menu" id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title" key="t-menu">
              Menu
            </li>

            <li>
              <Link to="/" className="waves-effect">
                <i className="bx bx-home-circle"></i>
                <span style={{ color: "#A2A5AA" }}>Home</span>
              </Link>
            </li>

            <li>
              <Link
                className="waves-effect"
                onClick={() => toggleSubMenu("users")}
              >
                <i className="bx bx-layout"></i>
                <span className="text-decoration-none" key="t-layouts">
                  Users
                </span>
                <span
                  className="badge rounded-pill bg-danger float-right"
                  key="t-hot"
                >
                  Hot
                </span>
              </Link>
              <ul
                className={
                  subMenuStates.users ? "sub-menu" : "sub-menu collapse"
                }
              >
                <li>
                  <Link to="/users/allUsers">All User</Link>
                </li>
                <li>
                  <Link to="/users/createUser">Create User</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                className="waves-effect"
                onClick={() => toggleSubMenu("orders")}
              >
                <i className="bx bx-package"></i>
                <span className="text-decoration-none" key="t-layouts">
                  Orders
                </span>
              </Link>
              <ul
                className={
                  subMenuStates.orders ? "sub-menu" : "sub-menu collapse"
                }
              >
                <li>
                  <Link to="/orders/allOrders">Orders</Link>
                </li>
                <li>
                  <Link to="/orders/orderHistory">Order History</Link>
                </li>
                <li>
                  <Link to="/orders/cancelledOrders">Cancelled Orders</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                className="waves-effect"
                onClick={() => toggleSubMenu("settlement")}
              >
                <i className="bx bx-pie-chart-alt-2"></i>
                <span className="text-decoration-none" key="t-layouts">
                  Settlement
                </span>
              </Link>
              <ul
                className={
                  subMenuStates.settlement ? "sub-menu" : "sub-menu collapse"
                }
              >
                <li>
                  <Link to="/settlement/VendorSettlement">
                    Vendor Settlement
                  </Link>
                </li>
                <li>
                  <Link to="/settlement/LogisticSettlementPickup">
                    Logistic Pickup Settlement
                  </Link>
                </li>
                <li>
                  <Link to="/settlement/LogisticSettlementDelivery">
                    Logistic Delivery Settlement
                  </Link>
                </li>
                <li>
                  <Link to="/settlement/SettlementHistory">
                    Settlement History
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                className="waves-effect"
                onClick={() => toggleSubMenu("vendors")}
              >
                <i className="bx bx-calendar"></i>
                <span key="t-dashboards">Vendors</span>
              </Link>
              <ul
                className={
                  subMenuStates.vendors ? "sub-menu" : "sub-menu collapse"
                }
              >
                <li>
                  <Link to="/vendors/allVendors">All Vendors</Link>
                </li>
                <li>
                  <Link to="/vendors/approveVendors">Approve new vendors</Link>
                </li>
                <li>
                  <Link to="/vendors/deactivatedVendors">Deactivated vendors</Link>
                </li>
                <li>
                  <Link to="/vendors/createVendors">Add new vendor</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                className="waves-effect"
                onClick={() => toggleSubMenu("logisticPartner")}
              >
                <i className="bx bx-store"></i>
                <span key="t-ecommerce">Logistic partner</span>
              </Link>
              <ul
                className={
                  subMenuStates.logisticPartner
                    ? "sub-menu"
                    : "sub-menu collapse"
                }
              >
                <li>
                  <Link to="/logistic/allPartners" key="t-products">
                    All partners
                  </Link>
                </li>
                <li>
                  <Link to="/logistic/approvePartner" key="t-orders">
                    Approve new partners
                  </Link>
                </li>
                <li>
                  <Link to="/logistic/newPartner" key="t-product-detail">
                    Create new Partners
                  </Link>
                </li>
              </ul>
            </li>

            {/* <li>
              <Link
                className="waves-effect"
                onClick={() => toggleSubMenu("payments")}
              >
                <i className="bx bx-bitcoin"></i>
                <span key="t-crypto">Payments</span>
              </Link>
              <ul
                className={
                  subMenuStates.payments ? "sub-menu" : "sub-menu collapse"
                }
              >
                <li>
                  <Link to="/payment/paymentHistory" key="t-wallet">
                    Payments History
                  </Link>
                </li>
                <li>
                  <Link to="/payment/paymentVendors" key="t-buy">
                    Payments to vendors
                  </Link>
                </li>
                <li>
                  <Link to="/payment/paymentLogistic" key="t-exchange">
                    Payments to logistics partner
                  </Link>
                </li>
                <li>
                  <Link to="/payment/paymentPast" key="t-lending">
                    View Past payments
                  </Link>
                </li>
              </ul>
            </li> */}

            <li>
              <Link
                className="waves-effect"
                onClick={() => toggleSubMenu("categories")}
              >
                <i className="bx bx-extension categoryIcon"></i>
                <span key="t-crypto">Categories</span>
              </Link>
              <ul
                className={
                  subMenuStates.categories ? "sub-menu" : "sub-menu collapse"
                }
              >
                <li>
                  <Link to="/categories/allServices" key="t-wallet">
                    View Services
                  </Link>
                </li>
                <li>
                  <Link to="/categories/createSubServices" key="t-buy">
                    Create sub-services
                  </Link>
                </li>
                <li>
                  <Link to="/categories/ManageSubServices" key="t-exchange">
                    Manage sub-services
                  </Link>
                </li>
                <li>
                  <Link to="/categories/timeSlot" key="t-exchange">
                    Time Slots
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                className="waves-effect"
                onClick={() => toggleSubMenu("miscellaneous")}
              >
                <i
                  className="bx bx-link-external"
                  style={{ color: "#ffffff !important " }}
                ></i>
                <span key="t-crypto">Miscellaneous</span>
              </Link>
              <ul
                className={
                  subMenuStates.miscellaneous ? "sub-menu" : "sub-menu collapse"
                }
              >
                <li>
                  <Link to="/miscellaneous/returnPolicy" key="t-buy">
                    Return and Cancellation Policy
                  </Link>
                </li>
                <li>
                  <Link to="/miscellaneous/tandc" key="t-exchange">
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/miscellaneous/privacyPolicy" key="t-exchange">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/miscellaneous/shippingPolicy" key="t-exchange">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link to="/miscellaneous/deliveryCharges" key="t-exchange">
                    Delivery charges
                  </Link>
                </li>
                <li>
                  <Link to="/miscellaneous/faq" key="t-exchange">
                    FAQ
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                className="waves-effect"
                onClick={() => toggleSubMenu("coupon")}
              >
                <i
                  className="bx bx-link-external"
                  style={{ color: "#ffffff !important " }}
                ></i>
                <span key="t-crypto">Coupon</span>
              </Link>
              <ul
                className={
                  subMenuStates.coupon ? "sub-menu" : "sub-menu collapse"
                }
              >
                <li>
                  <Link to="/coupon/allCoupons" key="t-buy">
                    View Coupon
                  </Link>
                  <Link to="/coupon/inactiveCoupons" key="t-buy">
                    View Inactive Coupon
                  </Link>
                </li>
                <li>
                  <Link to="/coupon/createCoupon" key="t-exchange">
                    Create Coupon
                  </Link>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
