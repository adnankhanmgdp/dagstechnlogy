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
  },[])

  const navigate = useNavigate();

  const handleSubmitData = (logistic) => {
    navigate("/logistic/partnerProfile", {
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

          <div class="row" id="partner-list">
            
            {logistics.map((logistic) => (
              <div class="col-xl-4 mt-4 col-md-6">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex align-start mb-3"></div>
                    <div class="text-center mb-3">
                      <img
                        src="https://tse2.mm.bing.net/th?id=OIP.6UhgwprABi3-dz8Qs85FvwHaHa&pid=Api&P=0&h=180"a
                        alt=""
                        class="avatar-sm rounded-circle"
                      />
                      <h6 class="font-size-15 mt-3 mb-1">{logistic.name}</h6>
                      <p class="mb-0 text-muted font-size-13 badge">
                        Location: {logistic.address}
                      </p>
                    </div>
                    <div className="mb-2">
                      <div className="d-flex justify-content-center align-items-center">
                        <i class="bx bx-envelope"></i>
                        <Link className="pl-2">{logistic.email}</Link>
                      </div>
                      <div className="d-flex justify-content-center align-items-center">
                        <i class="bx bx-phone"></i>
                        <Link className="pl-2">{logistic.phone}</Link>
                      </div>
                    </div>

                    <div class="mt-4 btnBack pt-1 pb-1">
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
            ))}
          </div>

          {/* <!-- end row --> */}
        </div>
      </div>
    </div>
  );
};

export default LogPartners;
