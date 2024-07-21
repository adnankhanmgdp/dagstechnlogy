import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Order from "./Pages/Order/Orderss";
import Sidebar from "./components/Sidebar";
import TopNavigation from "./components/TopNavigation";
import "./App.css";
import CreateOrder from "./Pages/Order/CreateOrder";
import CancelledOrders from "./Pages/Order/CancelledOrders";
import OrderHistory from "./Pages/Order/OrderHistory";
import AllUsers from "./Pages/User/AllUsers";
import CreateUser from "./Pages/User/CreateUser";
import InvoiceList from "./Pages/Invoice/InvoiceList";
import InvoiceDetails from "./Pages/Invoice/InvoiceDetails";
import Login from "./Pages/Auth/Login";
import OTPVerification from "./Pages/OTPverification/OtpVerification";
import PasscodeVerification from "./Pages/OTPverification/PasscodeVerification";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import Error from "./Pages/Error";
import VendorsList from "./Pages/Vendors/VendorsList";
import VendorDetails from "./Pages/Vendors/VendorDetails";
import VenderCreation from "./Pages/Vendors/VenderCreation";
import Approve from "./Pages/Vendors/Approve";
import PaymentHistory from "./Pages/Payments/PaymentHistory";
import VendorPayments from "./Pages/Payments/VendorPayments";
import LogisticPayments from "./Pages/Payments/LogisticPayments";
import PastPayments from "./Pages/Payments/PastPayments";
import LogPartners from "./Pages/Logistic/LogPartners";
import NewLogPartner from "./Pages/Logistic/NewLogPartner";
import ApprovePartner from "./Pages/Logistic/ApprovePartner";
import PartnerProfile from "./Pages/Logistic/PartnerProfile";
import ApprovePartnerProfile from "./Pages/Logistic/ApprovePartnerProfile";
import AllServices from "./Pages/Categories/AllServices";
import CreateSubServices from "./Pages/Categories/CreateSubServices";
import ManageSubServices from "./Pages/Categories/ManageSubServices";
import ServiceProvidingList from "./Pages/Categories/ServiceProvidingList";
import CategoryServiceTable from "./Pages/Categories/CategoryServiceTable";
import UserProfile from "./Pages/User/UserProfile";
import ForgotPasscode from "./Pages/Auth/ForgotPasscode";
import { useSelector } from "react-redux";
import VendorProfile from "./Pages/Vendors/VendorProfile";
import ApproveVendor from "./Pages/Vendors/ApproveVendor";
import ReturnandCancellationPolicy from "./Pages/miscellaneous/ReturnandCancellationPolicy";
import TermsAndConditions from "./Pages/miscellaneous/TermsAndConditions";
import PrivacyPolicy from "./Pages/miscellaneous/PrivacyPolicy";
import ShippingPolicy from "./Pages/miscellaneous/ShippingPolicy";
import DeliveryCharges from "./Pages/miscellaneous/DeliveryCharges";
import OrderDetails from "./Pages/Order/OrderDetails";
import VendorSettlement from "./settlement/VendorSettlement";
import LogisticSettlementPickup from "./settlement/LogisticSettlementPickup";
import SettlementHistory from "./settlement/SettlementHistory";
import ForgotPasswordOtp from "./Pages/Auth/ForgotPasswordOtp";
import LogisticSettlementDelivery from "./settlement/LogisticSettlementDelivery";
import OTPforPasscode from "./Pages/OTPverification/OTPforPasscode";
import useTokenExpiryChecker from "./utils/useTokenExpiryChecker";
import Faq from "./Pages/miscellaneous/Faq";
import DeactivatedVendors from "./Pages/Vendors/DeactivatedVendors";
import TimeSlot from "./Pages/Categories/TimeSlot";
import Coupon from "./Pages/Coupon/Coupon";
import EditCoupon from "./Pages/Coupon/EditCoupon";
import CreateCoupon from "./Pages/Coupon/CreateCoupon";
import InactiveCoupon from "./Pages/Coupon/InactiveCoupon";

const App = () => {

  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);


  // const currentUser = true;

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleTokenExpired = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useTokenExpiryChecker(handleTokenExpired);

  return (
    <>
      <Router>
        {currentUser ? (
          <>
            <TopNavigation onToggleSidebar={toggleSidebar} />
            <div>
              <div className={`sidebar ${sidebarVisible ? "active" : ""}`}>
                <Sidebar />
              </div>
              <div>
                <Routes>
                  <Route path="/" element={<Home />} />

                  {/* users routes */}

                  <Route path="/users/allUsers" element={<AllUsers />} />
                  <Route path="/users/createUser" element={<CreateUser />} />
                  <Route path="/users/UserProfile" element={<UserProfile />} />

                  {/* orders routes */}

                  <Route path="/orders/allOrders" element={<Order />} />
                  <Route path="/users/createOrder" element={<CreateOrder />} />
                  <Route
                    path="/orders/orderHistory"
                    element={<OrderHistory />}
                  />
                  <Route
                    path="/orders/cancelledOrders"
                    element={<CancelledOrders />}
                  />

                  <Route path="/orders/orderDetails" element={<OrderDetails />} />

                  {/* invoice routes */}

                  <Route
                    path="/invoice/invoiceList"
                    element={<InvoiceList />}
                  />

                  <Route path="/invoice/invoiceDetail" element={<InvoiceDetails />} />

                  {/* vendors Routes*/}

                  <Route path="/vendors/allVendors" element={<VendorsList />} />
                  <Route
                    path="/vendors/vendorDetails"
                    element={<VendorDetails />}
                  />
                  <Route
                    path="/vendors/createVendors"
                    element={<VenderCreation />}
                  />
                  <Route path="/vendors/ApproveVendors" element={<Approve />} />
                  <Route path="/vendors/vendorProfile" element={<VendorProfile />} />
                  <Route path="/vendors/approveVendorProfile" element={<ApproveVendor />} />
                  <Route path="/vendors/deactivatedVendors" element={<DeactivatedVendors />} />

                  {/* Payments Routes */}

                  <Route
                    path="/payment/paymentHistory"
                    element={<PaymentHistory />}
                  />
                  <Route
                    path="/payment/paymentVendors"
                    element={<VendorPayments />}
                  />
                  <Route
                    path="/payment/paymentLogistic"
                    element={<LogisticPayments />}
                  />
                  <Route
                    path="/payment/paymentPast"
                    element={<PastPayments />}
                  />

                  {/* Settlement Routes */}

                  <Route path="/settlement/VendorSettlement" element={<VendorSettlement />} />
                  <Route path="/settlement/LogisticSettlementPickup" element={<LogisticSettlementPickup />} />
                  <Route path="/settlement/LogisticSettlementDelivery" element={<LogisticSettlementDelivery />} />
                  <Route path="/settlement/SettlementHistory" element={<SettlementHistory />} />

                  {/* Logistic Partners routes */}

                  <Route
                    path="/logistic/allPartners"
                    element={<LogPartners />}
                  />
                  <Route
                    path="/logistic/newPartner"
                    element={<NewLogPartner />}
                  />
                  <Route
                    path="/logistic/approvePartner"
                    element={<ApprovePartner />}
                  />
                  <Route
                    path="/logistic/partnerProfile"
                    element={<PartnerProfile />}
                  />
                  <Route
                    path="/logistic/approvePartnerProfile"
                    element={<ApprovePartnerProfile />}
                  />

                  {/* categories */}

                  <Route
                    path="/categories/allServices"
                    element={<AllServices />}
                  />
                  <Route
                    path="/categories/createSubServices"
                    element={<CreateSubServices />}
                  />
                  <Route
                    path="/categories/ManageSubServices"
                    element={<ManageSubServices />}
                  />
                  <Route path="/categories/CategoryServiceTable/:item" element={<CategoryServiceTable />}>

                  </Route>
                  <Route
                    path="/categories/ServiceProvidingList/:serviceId"
                    element={<ServiceProvidingList />}
                  />
                  <Route path="/categories/timeSlot" element={<TimeSlot />} />

                  {/* miscellaneous routes */}

                  <Route path="/miscellaneous/returnPolicy" element={<ReturnandCancellationPolicy />} />
                  <Route path="/miscellaneous/tandc" element={<TermsAndConditions />} />
                  <Route path="/miscellaneous/privacyPolicy" element={<PrivacyPolicy />} />
                  <Route path="/miscellaneous/shippingPolicy" element={<ShippingPolicy />} />
                  <Route path="/miscellaneous/deliveryCharges" element={<DeliveryCharges />} />
                  <Route path="/miscellaneous/faq" element={<Faq />} />
                  <Route path="*" element={<Error />} />

                  {/* Coupon */}

                  <Route path="/coupon/allCoupons" element={<Coupon />} />
                  <Route path="/coupon/editCoupon/:id" element={<EditCoupon />} />
                  <Route path="/coupon/createCoupon" element={<CreateCoupon />} />
                  <Route path="/coupon/inactiveCoupons" element={<InactiveCoupon />} />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/verify/passcode" element={<PasscodeVerification />} />
            <Route path="/verify/otp" element={<OTPVerification />} />
            <Route path="/verify/ForgotPasswordOtp" element={<ForgotPasswordOtp />} />
            <Route path="/verify/forgotPassword" element={<ForgotPassword />} />
            <Route path="/verify/forgotPasscode" element={<ForgotPasscode />} />
            <Route path="/verify/passcodeOTPVerification" element={<OTPforPasscode />} />
            <Route path="*" element={<Error />} />
          </Routes>
        )}
      </Router>
    </>
  );
};

export default App;
