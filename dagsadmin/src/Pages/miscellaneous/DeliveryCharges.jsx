import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeliveryCharges = () => {
  const [charges, setCharges] = useState({});
  const [editing, setEditing] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [error, setError] = useState(null);
  const [minAmount, setMinAmount] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [newMinAmount, setNewMinAmount] = useState(minAmount);
  //added by A1
  const [minPlatform, setMinPlatform] = useState();
  const [IsEditingForPlatform, setIsEditingForPlatform] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDeliveryCharges = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fetchMisc`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setCharges(data.charges.dist);
        setMinAmount(data.charges.minOrderAmount);
        setMinPlatform(data.charges.platformFee);
      } catch (error) {
        console.error("Error fetching delivery charges:", error);
        setError("Failed to fetch delivery charges. Please try again later.");
      }
    };
    fetchDeliveryCharges();
  }, []);

  const handleEditClick = (key) => {
    setEditing(key);
    setEditedValues({ ...editedValues, [key]: charges[key] });
  };

  const handleChange = (e, key) => {
    setEditedValues({ ...editedValues, [key]: e.target.value });
  };

  const handleSaveClick = async (key) => {
    // console.log(key)
    console.log(editedValues[key])
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/DeliveryCharge`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [key]: editedValues[key] }),
        },
      );

      if (res.ok) {
        setCharges({ ...charges, [key]: editedValues[key] });
        setEditing(null);
        toast.success("delivery charges updated successfully")
      }


    } catch (error) {
      console.error("Error saving delivery charge:", error);
      setError("Failed to save delivery charge. Please try again later.");
    }
  };

  // console.log(newMinAmount,"newAmount")

  const handleAmountEditClick = () => {
    setIsEditing(true);
  };

  const handleAmountSaveClick = () => {

    const updateMinAmount = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/minAmount`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ minAmount: newMinAmount }),
      })
      const data = await res.json();
      if (res.ok) {
        toast.success("Minimum amount updated successfully");
        setMinAmount(data.updatedMisc.minOrderAmount);
        setIsEditing(false);
      }

    }
    updateMinAmount();
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setNewMinAmount(minAmount);
    setIsEditing(false);
  };

  const handleCancelClickForPlatform = () => {
    setMinPlatform(minPlatform);
    setIsEditingForPlatform(false);
  };

  //added by A1
  const handlePlatformEditClick = () => {
    setIsEditingForPlatform(true);
  };

  //added by A1
  const handlePlatformSaveClick = () => {

    const updatePlatformAmount = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/platform`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fee: minPlatform }),
      })
      const data = await res.json();
      if (res.ok) {
        toast.success("Plaform fee updated successfully");
        setMinPlatform(data.updatedMisc.platformFee);
        setIsEditingForPlatform(false);
      }

    }
    updatePlatformAmount();
    setIsEditingForPlatform(false);
  };

  return (
    <div className="main-content" style={{ backgroundColor: "#F6F6F9" }}>
      <div className="page-content">
        <ToastContainer />
        <div>
          <div className="container-fluid p-5 bg-white">
            <h5 className="text-center">Delivery Charges</h5>
            {error && <p className="text-danger">{error}</p>}
            <div className="table-responsive mt-5">
              <table className="table table-bordered table-hover table-centered mb-0">
                <thead>
                  <tr className="text-center">
                    <th>Distance Cover</th>
                    <th>Charges</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(charges).map((key) => (
                    <tr key={key} className="text-center">
                      <td>{key} Kms</td>
                      <td>
                        {editing === key ? (
                          <input
                            type="text"
                            value={editedValues[key]}
                            onChange={(e) => handleChange(e, key)}
                          />
                        ) : (
                          `₹ ${charges[key]}`
                        )}
                      </td>
                      <td>
                        {editing === key ? (
                          <button
                            onClick={() => handleSaveClick(key)}
                            className="bg-success text-white pl-5 pr-5 border-0"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(key)}
                            className="bg-primary text-white pl-5 pr-5 border-0"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* <!-- min amount for the order --> */}
          <div className="container-fluid mt-4 p-5 bg-white rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Min Amount for the Orders</h5>
              {!isEditing ? (
                <button
                  onClick={handleAmountEditClick}
                  className="btn btn-primary"
                >
                  Edit
                </button>
              ) : (
                <div>
                  <button
                    onClick={handleAmountSaveClick}
                    className="btn btn-success mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="btn btn-danger"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <hr />
            <div className="mt-3">
              {!isEditing ? (
                <h4 className="text-center">Min Amount: ₹{minAmount}</h4>
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <input
                    type="number"
                    value={newMinAmount}
                    onChange={(e) => setNewMinAmount(Number(e.target.value))}
                    className="form-control w-25 mr-2"
                  />
                  <span>₹</span>
                </div>
              )}
            </div>
          </div>

          {/* <!--platform fee--> */}
          <div className="container-fluid mt-4 p-5 bg-white rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Platform Fee</h5>
              {!IsEditingForPlatform ? (
                <button
                  onClick={handlePlatformEditClick}
                  className="btn btn-primary"
                >
                  Edit
                </button>
              ) : (
                <div>
                  <button
                    onClick={handlePlatformSaveClick}
                    className="btn btn-success mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelClickForPlatform}
                    className="btn btn-danger"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <hr />
            <div className="mt-3">
              {!IsEditingForPlatform ? (
                <h4 className="text-center">Amount: ₹{minPlatform}</h4>
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <input
                    type="number"
                    value={minPlatform}
                    onChange={(e) => setMinPlatform(Number(e.target.value))}
                    className="form-control w-25 mr-2"
                  />
                  <span>₹</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCharges;
