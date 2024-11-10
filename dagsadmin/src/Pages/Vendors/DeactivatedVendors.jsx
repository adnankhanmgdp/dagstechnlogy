import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import { Link, useNavigate } from "react-router-dom";
import "datatables.net-bs4";

const DeactivatedVendors = () => {
  const tableRef = useRef();

  const [vendors, setVendors] = useState([]);
  // console.log(vendors);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    const fetchVendors = async () => {
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
        const inactiveVendors = data.vendors.filter(
          (vendor) => vendor.verificationStatus === "inactive",
        );

        setVendors(inactiveVendors);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchVendors();
  }, []);

  const handleViewProfile = (vendor) => {
    navigate(`/vendors/vendorProfile/${vendor.vendorId}`, {
      state: vendor,
    });
  };

  return (
    <>
      <div style={{ background: "#F8F8FB" }} className="main-content">
        <div className="page-content">
          <div class="row">
            <div class="col-12">
              <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 class="mb-sm-0 font-size-18">Vendors List</h4>

                <div class="page-title-right">
                  <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item">
                      <Link>Vendors</Link>
                    </li>
                    <li class="breadcrumb-item active">All Vendors</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="table-responsive">
              <table
                ref={tableRef}
                className="table table-striped table-bordered"
              >
                <thead>
                  <tr>
                    <th className="text-center">Vendor Id</th>
                    <th className="text-center">Vendor Name</th>
                    <th className="text-center">Address</th>
                    <th className="text-center">Total orders</th>
                    <th className="text-center">View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.length === 0 ? (
                    <tr className="text-center">
                      <td colSpan="5">
                        <h5>No vendors found</h5>
                      </td>
                    </tr>
                  ) : (

                    vendors.map((vendor) => (
                      <tr key={vendor.vendorId}>
                        <td className="text-center">
                          {vendor.vendorId ? vendor.vendorId : "---"}
                        </td>
                        <td className="text-center">
                          {vendor.name ? vendor.name : "---"}
                        </td>
                        <td className="text-center">
                          {vendor.address ? vendor.address : "---"}
                        </td>
                        <td className="text-center">
                          {vendor.orders.length ? vendor.orders.length : "----"}{" "}
                        </td>
                        {/* <td className="mt-4 text-center">
                        <div>
                          <span
                            className="pl-3 pr-3 pb-2 pt-2 rounded-pill"
                            style={{
                              backgroundColor:
                                vendor.status === false
                                  ? "#a7ebc0"
                                  : vendor.status === true
                                    ? "#c9ecc3"
                                    : "",
                              width: "100px",
                            }}
                          >
                          </span>
                        </div>
                      </td> */}

                        <td style={{ textAlign: "center", marginTop: "12px" }}>
                          <button
                            onClick={() => handleViewProfile(vendor)}
                            className="btn btn-outline-secondary"
                          >
                            View profile
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

export default DeactivatedVendors;
