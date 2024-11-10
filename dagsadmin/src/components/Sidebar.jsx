import React, { useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useTokenExpiryChecker from "../utils/useTokenExpiryChecker";

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

  const [subSubMenu, setSubSubMenu] = useState()

  const handleTokenExpired = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // useTokenExpiryChecker(handleTokenExpired);

  const isTokenExpired = () => {
    try {
    const token = localStorage.getItem('token')
    if (!token) {
      return true;
    }
      const decoded = jwtDecode(token);
      console.log(decoded)
      console.log(decoded.date)
      const now = Date.now()
      return decoded.date < now;
    } catch (error) {
      return true;
    }
  };

  const subsub = (index) => {
    setSubSubMenu((index) => {
      return console.log("Hi")
    })
  }

  const toggleSubMenu = (menu) => {
    setSubMenuStates((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  if(isTokenExpired()){
    handleTokenExpired()
  }

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
                {/* <span
                  className="badge rounded-pill bg-danger float-right"
                  key="t-hot"
                >
                  Hot
                </span> */}
              </Link>
              <ul
                className={
                  subMenuStates.users ? "sub-menu" : "sub-menu collapse"
                }
              >
                <li>
                  <Link to="/users/allUsers" onClick={() => subsub(1)}>All User</Link>
                </li>
                <li>
                  <Link to="/users/createUser" onClick={() => subsub(2)}>Create User</Link>
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
                  <Link to="/orders/allOrders" onClick={() => subsub(3)}>Orders</Link>
                </li>
                <li>
                  <Link to="/orders/orderHistory" onClick={() => subsub(4)}>Order History</Link>
                </li>
                <li>
                  <Link to="/orders/cancelledOrders" onClick={() => subsub(5)}>Cancelled Orders</Link>
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
                  <Link to="/settlement/VendorSettlement" onClick={() => subsub(6)}>
                    Vendor Settlement
                  </Link>
                </li>
                <li>
                  <Link to="/settlement/LogisticSettlementPickup" onClick={() => subsub(7)}>
                    Logistic Pickup Settlement
                  </Link>
                </li>
                <li>
                  <Link to="/settlement/LogisticSettlementDelivery" onClick={() => subsub(8)}>
                    Logistic Delivery Settlement
                  </Link>
                </li>
                <li>
                  <Link to="/settlement/SettlementHistory" onClick={() => subsub(9)}>
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
                  <Link to="/vendors/allVendors" onClick={() => subsub(10)}>All Vendors</Link>
                </li>
                <li>
                  <Link to="/vendors/approveVendors" onClick={() => subsub(11)}>Approve new vendors</Link>
                </li>
                <li>
                  <Link to="/vendors/deactivatedVendors" onClick={() => subsub(12)}>Deactivated vendors</Link>
                </li>
                <li>
                  <Link to="/vendors/createVendors" onClick={() => subsub(13)}>Add new vendor</Link>
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
                  <Link to="/logistic/allPartners" key="t-products" onClick={() => subsub(14)}>
                    All partners
                  </Link>
                </li>
                <li>
                  <Link to="/logistic/approvePartner" key="t-orders" onClick={() => subsub(15)}>
                    Approve new partners
                  </Link>
                </li>
                <li>
                  <Link to="/logistic/deactivatedLogistic" onClick={() => subsub(16)}>Deactivated Logistic</Link>
                </li>
                <li>
                  <Link to="/logistic/newPartner" key="t-product-detail" onClick={() => subsub(17)}>
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
                {/* <li>
                  <Link to="/categories/allServices" key="t-wallet">
                    View Services
                  </Link>
                </li> */}
                <li>
                  <Link to="/categories/createSubServices" key="t-buy" onClick={() => subsub(19)}>
                    Create Service
                  </Link>
                </li>
                <li>
                  <Link to="/categories/ManageSubServices" key="t-exchange" onClick={() => subsub(111)}>
                    Manage Service
                  </Link>
                </li>
                <li>
                  <Link to="/categories/timeSlot" key="t-exchange" onClick={() => subsub(104)}>
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
                  <Link to="/miscellaneous/returnPolicy" key="t-cancel" onClick={() => subsub(116)}>
                    Return and Cancellation Policy
                  </Link>
                </li>
                <li>
                  <Link to="/miscellaneous/tandc" key="t-exchange" onClick={() => subsub(117)}>
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/miscellaneous/privacyPolicy" key="t-exchange" onClick={() => subsub(160)}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/miscellaneous/shippingPolicy" key="t-exchange" onClick={() => subsub(69)}>
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link to="/miscellaneous/deliveryCharges" key="t-exchange" onClick={() => subsub(161)}>
                    Delivery charges
                  </Link>
                </li>
                <li>
                  <Link to="/miscellaneous/faq" key="t-exchange" onClick={() => subsub(165)}>
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
                  className="bx bx-purchase-tag-alt"
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
                  <Link to="/coupon/allCoupons" key="t-coupon" onClick={() => subsub(166)}>
                    View Coupon
                  </Link>
                  <Link to="/coupon/inactiveCoupons" key="t-inactive" onClick={() => subsub(167)}>
                    View Inactive Coupon
                  </Link>
                </li>
                <li>
                  <Link to="/coupon/createCoupon" key="t-exchange" onClick={() => subsub(168)}>
                    Create Coupon
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                className="waves-effect"
                onClick={() => toggleSubMenu("carousel")}
              >
                <i
                  className="bx bx-carousel"
                  style={{ color: "#ffffff !important " }}
                ></i>
                <span key="t-crypto">Carousel</span>
              </Link>
              <ul
                className={
                  subMenuStates.carousel ? "sub-menu" : "sub-menu collapse"
                }
              >
                <li>
                  <Link to="/carousel/allCarousel" key="t-carousel" onClick={() => subsub(1699)}>
                    View Carousel
                  </Link>
                </li>
                <li>
                  <Link to="/carousel/createCarousel" key="t-exchange" onClick={() => subsub(1000)}>
                    Create Carousel
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
