import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";

const AllUsers = () => {
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  // console.log(users);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fetchUsers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setMessage(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const handleClick = (row) => {
    navigate(`/users/UserProfile/${row.phone}`, {
      state: {
        user: row,
      },
    });
  };

  const columns = [
    {
      name: "User Name",
      selector: (row) => row.name,
      sortable: true,
      center: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone,
      sortable: true,
      center: true,
    },
    {
      name: "Email",
      selector: (row) => row.email ? row.email : "---",
      sortable: true,
      center: true,
    },
    {
      name: "Orders",
      selector: (row) => row._id,
      center: true,
      cell: (row) => (
        <button
          onClick={() => handleClick(row)}
          className="btn btn-outline-secondary bg-primary text-white"
        >
          View Profile
        </button>
      ),
    },
  ];

  return (
    <>
      <div style={{ background: "#F8F8FB" }} className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 className="mb-sm-0 font-size-18">Users List</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <span>User</span>
                      </li>
                      <li className="breadcrumb-item active">All Users</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <DataTable
                columns={columns}
                data={users}
                pagination
                highlightOnHover
                pointerOnHover
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllUsers;
