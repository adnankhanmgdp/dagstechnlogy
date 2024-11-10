import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ApprovePartner = () => {

  const [logistics, setLogistic] = useState([])
  const navigate = useNavigate();

  // console.log("logistics",logistics)

  const token = localStorage.getItem("token");

  useEffect(() => {
    const approve = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/fetchLogistic`,
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
        const inactivelogistics = data.logistics.filter(
          (logistic) => logistic.verificationStatus === "pending",
        );

        setLogistic(inactivelogistics);
      }
    };
    approve();
  }, [])

  const handleSeeprofile = (logistic) => {
    navigate("/logistic/approvePartnerProfile", {
      state: {
        logistic
      }
    });
  }

  return (
    <div class="main-content">
      <div class="page-content">
        <div class="container-fluid">
          {/* <!-- start page title --> */}
          <div class="row">
            <div class="col-12">
              <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 class="mb-sm-0 font-size-18">Partner's List</h4>

                <div class="page-title-right">
                  <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item">
                      <Link>Logistics</Link>
                    </li>
                    <li class="breadcrumb-item active">Partners List</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- end page title --> */}
          {/* <!--end row--> */}

          <div className="row" id="partner-list">
          {logistics && logistics.length > 0 ? (
            logistics.map((logistic) => (
              <div className="col-xl-4 mt-4 col-md-6" key={logistic.logisticId}>
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-start mb-3"></div>
                    <div className="text-center mb-3">
                      <img
                        src="https://tse2.mm.bing.net/th?id=OIP.6UhgwprABi3-dz8Qs85FvwHaHa&pid=Api&P=0&h=180"
                        className="avatarCustom"
                        alt="user's img"
                      />
                      <h6 className="font-size-15 mt-3 mb-1">{logistic.name || "No Name"}</h6>
                      <p className="mb-0 text-muted font-size-13 badge">
                        Location: {logistic.address || "No Address"}
                      </p>
                    </div>
                    <div className="mb-2">
                      <div className="d-flex justify-content-center align-items-center">
                        <i className="bx bx-envelope"></i>
                        <Link className="pl-2">{logistic.email || "No Email"}</Link>
                      </div>
                      <div className="d-flex justify-content-center align-items-center">
                        <i className="bx bx-phone"></i>
                        <Link className="pl-2">{logistic.phone || "No Phone"}</Link>
                      </div>
                    </div>

                    <div className="mt-4 btnBack pt-1 pb-1">
                      <div
                        onClick={() => handleSeeprofile(logistic)}
                        to="/logistic/approvePartnerProfile"
                        className="d-block customBtn"
                      >
                        <span className=""> See details</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No partners found</p>
            </div>
          )}
        </div>

          {/* <!-- end row --> */}
        </div>
      </div>
    </div>
  );
};

export default ApprovePartner;
