import React, { useRef, useState } from "react";
import "datatables.net-bs4";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApprovePartnerProfile = () => {
  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate()

  const location = useLocation();
  const logistic = location.state?.logistic;
  // console.log(logistic)

  // console.log("vendor",logistic);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleApprove = () => {
    // Show the modal when Approve button is clicked
    // const modal = new Modal(modalRef.current);
    // modal.show();
    handleShow();
  };
  const token = localStorage.getItem("token");

  const handleChangeStatus = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/updateLogistic`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            logisticId: logistic?.logisticId,
            verificationStatus: "active",
          }),
        },
      );

      const data = await res.json();
      if (res.ok) {
        // console.log(data);
        toast.success("Logistic approved");
        navigate("/logistic/approvePartner");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveVendor = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/updateLogistic`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            logisticId: logistic?.logisticId,
            verificationStatus: "inactive",
          }),
        },
      );

      if (res.ok) {
        toast.warning("Logistic Unapproved")
      }

    } catch (error) {
      toast.warning("error deleting the logistic")
    }
  }

  return (
    <div
      className="main-content"
      style={{ backgroundColor: "#F6F6F9", minHeight: "100vh" }}
    >
      <div className="page-content">
        <div className="container-fluid">
          <div className="row ">
            <div className="d-flex flex-column m-3 flex-xl-row">
              <div className="card border-0 xl-mb-0 mr-xl-4 col-xl-4">
                <div className="bg-primary-subtle p-2">
                  <div className="row">
                    <div className="mx-auto mt-3">
                      <img
                        src={
                          logistic?.profilePic
                            ? logistic?.profilePic
                            : "https://tse3.mm.bing.net/th?id=OIP.K4jXSK4XQahOLPEliCtvlwHaHa&pid=Api&P=0&h=180"
                        }
                        className="avatarCustom"
                        alt="user's img"
                      />
                    </div>
                    <div className="col-12">
                      <div className="p-3">
                        <h5 className="text-center">
                          {logistic?.name}'s Profile
                        </h5>
                        <p className="text-center text-primary">
                          " It will seem like simplified "
                        </p>
                      </div>
                      <p className="text-center ProfileService">
                        Services Providing
                      </p>
                    </div>
                    <div
                      className="mx-auto border-0"
                      style={{ backgroundColor: "#F6F6F9" }}
                    >
                      <div className="p-2 text-center mx-auto">
                        <span className="badge badge-soft-secondary">
                          Clothing Distribution /
                        </span>
                        <span className="badge badge-soft-secondary">
                          Apparel Shipping /
                        </span>
                        <span className="badge badge-soft-secondary">
                          Fashion Logistics
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0">
                <div className="card-body">
                  <h4 className="card-title mb-4 font-size-20">
                    Personal Information
                  </h4>

                  <p className="text-muted mb-4 font-size-14">
                    Hi I'm {logistic?.name} Price,has been the industry's
                    standard dummy text To an English person, it will seem like
                    simplified English, as a skeptical Cambridge.
                  </p>
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Full Name :
                          </th>
                          <td>{logistic?.name}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Mobile :
                          </th>
                          <td>{logistic?.phone}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            E-mail :
                          </th>
                          <td>{logistic?.email}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Location :
                          </th>
                          <td>{logistic?.address}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="col-12">
              <div className="card border-0">
                <div className="card-body">
                  <h4 className="card-title text-center mt-2 font-size-20 mb-2">
                    Verify Documents
                  </h4>
                  <div className="mt-4 ml-3 row">

                    <div className="text-center col-6 ">
                      <img
                        className="img-responsive object-contain w-50"
                        src={
                          logistic?.profilePic
                            ? logistic.profilePic
                            : "https://tse3.mm.bing.net/th?id=OIP.K4jXSK4XQahOLPEliCtvlwHaHa&pid=Api&P=0&h=180"
                        }
                        alt="DocumentImage"
                      />
                      <h4>Logistic Profile</h4>
                    </div>

                    <div className="text-center col-6 ">
                      <img
                        className="img-responsive object-contain w-50"
                        src={
                          logistic?.document
                            ? logistic.document
                            : "https://tse3.mm.bing.net/th?id=OIP.K4jXSK4XQahOLPEliCtvlwHaHa&pid=Api&P=0&h=180"
                        }
                        alt="DocumentImage"
                      />
                      <h4>Document: {logistic?.docType}</h4>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className="ml-3 mt-3 text-center mt-5">
              <button
                onClick={handleApprove}
                className="mr-3 w-25 border-0 p-1 bg-success text-white"
              >
                Approve
              </button>
              <button
                onClick={handleRemoveVendor}
                className="w-25 border-0 p-1 bg-danger text-white"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* new modal */}

      {showModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Approval Confirmation</h5>
                <button type="button" className="close" onClick={handleClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to approve this Logistic?</p>
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
                  onClick={handleChangeStatus}
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

export default ApprovePartnerProfile;
