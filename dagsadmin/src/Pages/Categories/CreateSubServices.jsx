import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceProvidingList = () => {
  const [initialData, setInitialData] = useState([
  ]);
  const [editableRowId, setEditableRowId] = useState(null);
  const [editedRows, setEditedRows] = useState({});
  const lastInputRef = useRef(null);
  const [newItem, setNewItem] = useState({});
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  // console.log("binary data: " + binaryData);

  // console.log("options: " + options);
  const [formData, setFormData] = useState({});

  const [serviceForm, setServiceForm] = useState({});
  // console.log(serviceForm,"serviceForm");

  const handleEdit = (id) => {
    setEditableRowId(id);
    setEditedRows((prev) => ({
      ...prev,
      [id]: { ...initialData.find((item) => item.id === id) },
    }));
  };

  const token = localStorage.getItem("token");

  const handleSave = (id) => {
    setEditableRowId(null);
    setInitialData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, ...editedRows[id] } : item,
      ),
    );
    // Remove the edited row from the editedRows state
    setEditedRows((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleDelete = (id) => {
    setInitialData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    const id = initialData.length + 1;
    setInitialData([
      ...initialData,
      { id, name: newItem.name, price: newItem.price },
    ]);

    const handleAddItem = async () => {
      try {
        const { itemName, unitPrice } = formData; // Destructure only the required properties
        // console.log("datatatta",itemName,unitPrice);
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/addItem`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          },
        );

        const data = await res.json();
        if (res.ok) {
          // console.log("item", data);
          // Clear the form data after successful submission
        }
      } catch (error) {
        // console.log(error);
      }
    };
    handleAddItem();


    setNewItem({});
    setEditedRows((prev) => {
      delete prev[id];
      return { ...prev };
    });
    if (lastInputRef.current) {
      lastInputRef.current.focus();
    }
  };
  ;

  const handleChange = (e, id, field) => {
    const { value } = e.target;
    setEditedRows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // console.log("serviceForm",serviceForm)

  useEffect(() => {
    const getServices = async () => {

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/getService`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          // console.log("dtadd",data)
          setOptions(data.service);
          setLoading(false);
        }
      } catch (error) {
        // console.log(error);
      }
    };

    getServices();

  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/addService`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceForm), // Use FormData object as the body
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`${data.serviceName} added successfully to the service`);
        navigate('/categories/ManageSubServices')
      } else {
        toast.error("Error adding service");
        //  console.log(data);
      }
    } catch (error) {
      toast.warning(error.message);
      //  console.log(error);
    }
  };


  const handleServiceSelect = (e) => {
    // console.log(e.target.value);
    setFormData({ ...formData, serviceId: e.target.value });
  }

  const updateServiceData = (e) => {
    setServiceForm({ ...serviceForm, [e.target.id]: e.target.value })
  }

  const serviceImageUpdation = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    } else {

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setServiceForm((prevData) => ({ ...prevData, imgData: base64String }));
      };

      reader.readAsDataURL(file);
    }

  };


  return (
    <div
      className="main-content"
      style={{ background: "#F8F8FB", minHeight: "100vh" }}
    >
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">Categories</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/tables">Categories</Link>
                    </li>
                    <li className="breadcrumb-item active">Create Services</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <form className="card-body">
                  <div className="form-group mb-3">
                    <label style={{ fontWeight: 600 }} className="form-label">
                      Enter Service Name:
                    </label>
                    <input
                      type="text"
                      onChange={updateServiceData}
                      className="form-control"
                      id="serviceName"
                      placeholder="Service Name"
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label style={{ fontWeight: 600 }} className="form-label">
                      Enter Vendor Commission (%):
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={updateServiceData}
                      id="vendorCommission"
                      placeholder="vendor Commission"
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label style={{ fontWeight: 600 }} className="form-label">
                      Add a service icon:
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={serviceImageUpdation}
                      id="imgData"
                      required
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="border-0 pt-1 pb-1 pl-3 pr-3 rounded-sm bg-primary text-white"
                  >
                    create service
                  </button>
                  <br />
                </form>
              </div>
            </div>
          </div>

          {/* <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div>
                    <select
                      onChange={handleServiceSelect}
                      className="selectCustom"
                    >
                      <option value="">Select the Service</option>
                      {loading ? (
                        <option value="">Loading....</option>
                      ) : (
                        options.map((option) => (
                          <option value={option.serviceId}>
                            {option.serviceName}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <p className="card-title-desc">
                    Transform your laundry routine with our advanced washing
                    technology.
                  </p>

                  <div className="table-responsive">
                    <table className="table table-editable table-nowrap align-middle table-edits">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {initialData.map((item) => (
                          <tr key={item.id} data-id={item.id}>
                            <td data-field="id">{item.id}</td>
                            <td data-field="name">
                              {editableRowId === item.id ? (
                                <input
                                  className="border"
                                  type="text"
                                  value={editedRows[item.id]?.name || ""}
                                  onChange={(e) =>
                                    handleChange(e, item.id, "name")
                                  }
                                  style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                  }}
                                />
                              ) : (
                                item.name
                              )}
                            </td>
                            <td data-field="price">
                              {editableRowId === item.id ? (
                                <input
                                  className="border"
                                  type="number"
                                  value={editedRows[item.id]?.price || ""}
                                  onChange={(e) =>
                                    handleChange(e, item.id, "price")
                                  }
                                  style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                  }}
                                  ref={lastInputRef}
                                />
                              ) : (
                                item.price
                              )}
                            </td>
                            <td>
                              {editableRowId === item.id ? (
                                <>
                                  <Link
                                    to="#"
                                    className="btn btn-outline-secondary btn-sm save"
                                    title="save"
                                    onClick={() => handleSave(item.id)}
                                  >
                                    <i
                                      className="fa fa-book"
                                      aria-hidden="true"
                                    ></i>
                                  </Link>
                                </>
                              ) : (
                                <>
                                  <Link
                                    to="#"
                                    className="btn btn-outline-secondary btn-sm edit"
                                    title="Edit"
                                    onClick={() => handleEdit(item.id)}
                                  >
                                    <i className="fas fa-pencil-alt"></i>
                                  </Link>
                                  <Link
                                    to="#"
                                    className="btn btn-outline-secondary btn-sm delete"
                                    title="delete"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    <i className="fa fa-trash"></i>
                                  </Link>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td>{initialData.length + 1}</td>
                          <td>
                            <input
                              type="text"
                              className="border"
                              value={newItem.name || ""}
                              onChange={(e) => {
                                setNewItem({
                                  ...newItem,
                                  name: e.target.value,
                                });
                                setFormData({
                                  ...formData,
                                  itemName: e.target.value,
                                });
                              }}
                              placeholder="Enter name"
                              style={{ width: "100%", boxSizing: "border-box" }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="border"
                              value={newItem.price || ""}
                              onChange={(e) => {
                                setNewItem({
                                  ...newItem,
                                  price: e.target.value,
                                });
                                setFormData({
                                  ...formData,
                                  unitPrice: e.target.value,
                                });
                              }}
                              placeholder="Enter price"
                              style={{ width: "100%", boxSizing: "border-box" }}
                              ref={lastInputRef}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={handleAddItem}
                            >
                              Add Item
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ServiceProvidingList;
