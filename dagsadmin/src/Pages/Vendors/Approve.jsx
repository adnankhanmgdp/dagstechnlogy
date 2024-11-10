import React, { useRef, useEffect, useState } from "react";
import $ from "jquery";
import { Link, useNavigate } from "react-router-dom";
import "datatables.net-bs4";

const Approve = () => {
  const tableRef = useRef();
  const [vendors, setVendors] = useState([]);
  // console.log("inactive", vendors)
  const navigate = useNavigate()

  useEffect(() => {
    if (vendors.length > 0) {
      // Destroy previous instance of DataTable if exists
      if ($.fn.dataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      // Initialize DataTable
      $(tableRef.current).DataTable();
    }
  }, [vendors]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/fetchVendors`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();

        if (res.ok) {
          // Filter orders to only include those with status "Delivered"
          // console.log("approve", data)
          const inactiveVendors = data.vendors.filter(
            (vendor) => vendor.verificationStatus === "pending",
          );

          setVendors(inactiveVendors);
        }
      } catch (error) { }
    };
    getOrders();
  }, []);

  const handleSendPartnerProfile = (vendors) => {
    navigate(`/vendors/approveVendorProfile/${vendors.vendorId}`, {
      state: {
        vendors
      }
    });
  }

  return (
    <>
      <div style={{ background: "#F8F8FB" }} className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div class="row">
              <div class="col-12">
                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 class="mb-sm-0 font-size-18">Approve Vendors</h4>

                  <div class="page-title-right">
                    <ol class="breadcrumb m-0">
                      <li class="breadcrumb-item">
                        <Link>Vendors</Link>
                      </li>
                      <li class="breadcrumb-item active">Approve Vendors</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table
                ref={tableRef}
                className="table table-striped table-bordered"
              >
                <thead>
                  <tr className="text-center">
                    <th>VendorName</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>View Details</th>
                  </tr>
                </thead>

                <tbody>
                  {vendors.length === 0 ? (
                    <tr className="text-center">
                      <td colSpan="6">
                        <h5>No vendors found</h5>
                      </td>
                    </tr>
                  ) : (
                    vendors.map((vendor) => (
                      <tr className="text-center" key={vendor.vendorId}>
                        <td>{vendor.name ? vendor.name : "---"}</td>
                        <td>{vendor.phone ? vendor.phone : "---"}</td>
                        <td>{vendor.email ? vendor.email : "---"}</td>
                        <td>{vendor.address ? vendor.address : "---"}</td>
                        <td>{vendor.verificationStatus ? vendor.verificationStatus : "---"}</td>
                        <td>
                          <button
                            onClick={() => handleSendPartnerProfile(vendor)}
                            className="btn bg-success text-white"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
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

export default Approve;
