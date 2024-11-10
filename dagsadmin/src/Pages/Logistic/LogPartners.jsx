import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LogPartners = () => {

  const [logistics, setLogistics] = useState([]);

  // this is all partnersPage

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
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
        const logisticsare = data.logistics.filter(
          (logistic) =>
            logistic.verificationStatus === "active"
        );
        setLogistics(logisticsare);
      }
    }
    fetchData()
  }, [])

  const navigate = useNavigate();

  const handleSubmitData = (logistic) => {
    navigate(`/logistic/partnerProfile/${logistic.logisticId}`, {
      state:
        logistic
    })
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
            {logistics.length > 0 ? (
              logistics.map((logistic) => (
                <div className="col-xl-4 mt-4 col-md-6" key={logistic.logisticId}>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-start mb-3"></div>
                      <div className="text-center mb-3">
                        <img
                          src="https://tse2.mm.bing.net/th?id=OIP.6UhgwprABi3-dz8Qs85FvwHaHa&pid=Api&P=0&h=180"
                          alt=""
                          className="avatar-sm rounded-circle"
                        />
                        <h6 className="font-size-15 mt-3 mb-1">{logistic.name}</h6>
                        <p className="mb-0 text-muted font-size-13 badge">
                          Location: {logistic.address ? logistic.address : "N/A"}
                        </p>
                      </div>
                      <div className="mb-2">
                        <div className="d-flex justify-content-center align-items-center">
                          <i className="bx bx-envelope"></i>
                          <Link className="pl-2">{logistic.email}</Link>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                          <i className="bx bx-phone"></i>
                          <Link className="pl-2">{logistic.phone}</Link>
                        </div>
                      </div>
                      <div className="mt-4 btnBack pt-1 pb-1">
                        <button
                          className="btnBack border-0"
                          onClick={() => handleSubmitData(logistic)}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No data found</p>
              </div>
            )}
          </div>

          {/* <!-- end row --> */}
        </div>
      </div>
    </div>
  );
};

export default LogPartners;
