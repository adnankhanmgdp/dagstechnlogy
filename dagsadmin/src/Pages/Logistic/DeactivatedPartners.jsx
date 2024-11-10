import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import { Link, useNavigate } from "react-router-dom";
import "datatables.net-bs4";

const DeactivatedLogistic = () => {
    const tableRef = useRef();

    const [logistic, setLogistic] = useState([]);
    // console.log(logistic);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (logistic.length > 0) {
            // Destroy previous instance of DataTable if exists
            if ($.fn.dataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }

            // Initialize DataTable
            $(tableRef.current).DataTable();
        }
    }, [logistic]);

    useEffect(() => {
        const fetchlogistic = async () => {
            try {
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
                console.log(data)
                const inactivelogistic = data.logistics.filter(
                    (logistic) => logistic.verificationStatus === "inactive",
                );
                console.log(inactivelogistic)

                setLogistic(inactivelogistic);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchlogistic();
    }, []);

    const handleViewProfile = (logistic) => {
        navigate(`/logistic/partnerProfile/${logistic.logisticId}`, {
            state: logistic,
        });
    };

    return (
        <>
            <div style={{ background: "#F8F8FB" }} className="main-content">
                <div className="page-content">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 class="mb-sm-0 font-size-18">Logistic List</h4>

                                <div class="page-title-right">
                                    <ol class="breadcrumb m-0">
                                        <li class="breadcrumb-item">
                                            <Link>Logistic</Link>
                                        </li>
                                        <li class="breadcrumb-item active">All Logistic</li>
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
                                        <th className="text-center">Logistic Id</th>
                                        <th className="text-center">Logistic Name</th>
                                        <th className="text-center">Address</th>
                                        <th className="text-center">Total orders</th>
                                        <th className="text-center">View Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logistic.length > 0 ? (
                                        logistic.map((logistic) => (
                                            <tr key={logistic.logisticId}>
                                                <td className="text-center">
                                                    {logistic.logisticId ? logistic.logisticId : "---"}
                                                </td>
                                                <td className="text-center">
                                                    {logistic.name ? logistic.name : "---"}
                                                </td>
                                                <td className="text-center">
                                                    {logistic.address ? logistic.address : "---"}
                                                </td>
                                                <td className="text-center">
                                                    {logistic.orders.length ? logistic.orders.length : "----"}
                                                </td>
                                                <td style={{ textAlign: "center", marginTop: "12px" }}>
                                                    <button
                                                        onClick={() => handleViewProfile(logistic)}
                                                        className="btn btn-outline-secondary"
                                                    >
                                                        View profile
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                No data found
                                            </td>
                                        </tr>
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

export default DeactivatedLogistic;
