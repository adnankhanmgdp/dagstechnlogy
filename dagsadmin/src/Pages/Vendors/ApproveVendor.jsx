import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApproveVendor = () => {
  const tableRef = useRef();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const { id } = useParams()
  const [vendors, setVendor] = useState()
  const vendor = location?.state?.vendors;
  const token = localStorage.getItem("token");

  // useEffect(() => {
  //   const table = $(tableRef.current).DataTable();
  //   return () => {
  //     table.destroy();
  //   };
  // }, []);


  useEffect(() => {
    const fetchVendorDetails = async () => {
      // console.log("hi")
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/vendor/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(res.vendor)
        const data = await res.json();
        if (res.ok) {
          setVendor(data.vendor);
        } else {
          toast.warning(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchVendorDetails();

    const table = $(tableRef.current).DataTable();
    return () => {
      table.destroy();
    };
  }, []);


  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChangeStatus = async () => {
    handleShow();
  };

  const handleConfirmApprove = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/editVendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vendorId: vendors.vendorId,
          verificationStatus: "active",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/vendors/allVendors");
        toast.success("Vendor approved");
      } else {
        toast.warning(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveVendor = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/editVendor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vendorId: vendors.vendorId,
            verificationStatus: "inactive",
          }),
        },
      );

      const data = await res.json();
      if (res.ok) {
        toast.warning("Vendor rejected 😥");
        navigate("/vendors/deactivatedVendors");
        handleClose();
      } else {
        toast.warning(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className="main-content"
      style={{ backgroundColor: "#F6F6F9", minHeight: "100vh" }}
    >
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="d-flex flex-column m-3 flex-xl-row">
              <div className="card border-0 xl-mb-0 mr-xl-4 col-xl-4">
                <div className="bg-primary-subtle p-2">
                  <div className="row">
                    <div className="mx-auto mt-3">
                      <img
                        src={
                          vendors?.profilePic
                            ? vendors?.profilePic
                            : "https://tse3.mm.bing.net/th?id=OIP.K4jXSK4XQahOLPEliCtvlwHaHa&pid=Api&P=0&h=180"
                        }
                        className="avatarCustom"
                        alt="user's img"
                      />
                    </div>
                    <div className="col-12">
                      <div className="p-3">
                        <h5 className="text-center">
                          {vendors?.name}'s Profile
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
                    Hi I'm {vendors?.name}, has been the industry's standard
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
                          <td>{vendors?.name}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Mobile :
                          </th>
                          <td>{vendors?.phone}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            E-mail :
                          </th>
                          <td>{vendors?.email}</td>
                        </tr>
                        <tr>
                          <th className="headingCustom" scope="row">
                            Location :
                          </th>
                          <td>{vendors?.address}</td>
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
                  <div className="row">
                    <div className="mt-4  col-6 text-center">
                      <img
                        src={
                          vendors?.profilePic
                            ? vendors?.profilePic
                            : "https://tse3.mm.bing.net/th?id=OIP.K4jXSK4XQahOLPEliCtvlwHaHa&pid=Api&P=0&h=180"
                        }
                        alt="DocumentImage"
                        className="w-50"
                      />
                      <h4>Vendor Profile</h4>
                    </div>

                    <div className="mt-4 col-6 text-center">
                      <img
                        src={
                          vendors?.document
                            ? vendors?.document
                            : "https://tse3.mm.bing.net/th?id=OIP.K4jXSK4XQahOLPEliCtvlwHaHa&pid=Api&P=0&h=180"
                        }
                        alt="DocumentImage"
                        className="w-50"
                      />
                      <h4>Document: {vendors?.docType}</h4>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className="ml-3 mt-3 text-center mt-5">
              <button
                onClick={handleChangeStatus}
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
                <p>Are you sure you want to approve this vendor?</p>
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
                  onClick={handleConfirmApprove}
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

export default ApproveVendor;
