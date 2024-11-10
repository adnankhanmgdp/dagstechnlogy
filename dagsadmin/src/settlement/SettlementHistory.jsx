import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "datatables.net-bs4";

const SettlementHistory = () => {
  const tableRef = useRef();
  const token = localStorage.getItem("token");
  const [settlementhistory, setSettlementhistory] = useState({ history: [] });

  useEffect(() => {
    const fetchSettlementHistory = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/history`,
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
          // console.log("Data fetched successfully", data);
          setSettlementhistory(data);
        } else {
          console.log("Error fetching data:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchSettlementHistory();
  }, []);

  const formatDateToUTC = (date) => {
    const options = {
      timeZone: 'UTC',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
  };

  useEffect(() => {
    if (settlementhistory.history.length > 0) {
      const tableElement = tableRef.current;
      
      // Initialize DataTable in the next microtask to ensure table is rendered
      setTimeout(() => {
        if ($.fn.dataTable.isDataTable(tableElement)) {
          $(tableElement).DataTable().destroy();
        }
        $(tableElement).DataTable({
          paging: true,
          searching: true,
          ordering: true,
          info: true,
          pageLength: 10,
          lengthMenu: [10, 25, 50, 100],
        });
      }, 0);
    }
  }, [settlementhistory]);
  

  return (
    <div className="main-content" style={{ backgroundColor: "#F6F6F9" }}>
      <ToastContainer />
      <div className="page-content">
        <div className="container-fluid p-2">
          <h5 className="text-center">Settlement History</h5>
          <div className="table-responsive tableBg p-3">
            <table
              ref={tableRef}
              className="table table-bordered table-hover table-centered mb-0"
            >
              <thead>
                <tr className="text-center">
                  <th>Id</th>
                  <th>Settlement Date</th>
                  <th>Order Completed</th>
                  <th>Amount Settled</th>
                </tr>
              </thead>
              <tbody>
                {settlementhistory.history &&
                  settlementhistory.history.length > 0 ? (
                  settlementhistory.history.map((user) => (
                    <tr className="text-center" key={user._id}>
                      <td>{user.Id}</td>
                      <td>{formatDateToUTC(user.date)}</td>                      <td>{user.orderIds.length}</td>
                      <td>₹{(user.amount).toFixed(2)}</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No settlement history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementHistory;
