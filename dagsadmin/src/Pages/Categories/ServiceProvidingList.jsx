import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const ServiceProvidingList = () => {
  const { serviceId } = useParams();

  useEffect(() => {
      console.log(serviceId);
  },[])

  const navigate = useNavigate();

  const [newItem, setNewItem] = useState({
    itemName: "",
    unitPrice: "",
    imgData: "",
  });
  const [formData, setFormData] = useState({ serviceId: serviceId });
  const [decodedUser, setDecodedUser] = useState([]);
  const [servicee, setServiceDetails] = useState({});

  // console.log("decoded",decodedUser)
  const lastInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
   const [showOtherModal, setOtherModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    serviceName: "",
    vendorCommission: "",
    imgData: "",
  });

  // console.log("editFormData",editFormData)

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleFetchService = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/getServiceDetails`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ serviceId: serviceId }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          setServiceDetails(data[0]);
          setDecodedUser(data[0].items);
        }
      } catch (error) {
        // console.log(error);
      }
    };
    handleFetchService();
  }, [serviceId, token]);

  const handleAddItemToService = async () => {
  //  console.log("newItem",newItem);
   // Update formData synchronously
   const updatedFormData = {
     ...formData,
     itemName: newItem.itemName,
     unitPrice: newItem.unitPrice,
     imgData: newItem.imgData,
   };

   // Make the API call
   try {
     const res = await fetch(`${process.env.REACT_APP_API_URL}/addItem`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
       },
       body: JSON.stringify(updatedFormData),
     });

     const data = await res.json();

    //  console.log("data",data)
     // Update decodedUser and reset newItem if the API call is successful
     if (res.ok) {
       setDecodedUser(data.items);
       setNewItem({ itemName: "", unitPrice: "", imgData: "" });
       toast.success(`Item successfully added`);
     } else {
       toast.error(`Failed to add item: ${data.message}`);
     }
   } catch (error) {
    //  console.error(error);
     toast.error(`An error occurred: ${error.message}`);
   }
 };


  const handleDeleteService = async (e) => {
    e.preventDefault();
    console.log("delete service",servicee.serviceId)
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/deleteService`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ serviceId: servicee.serviceId }),
        },
      );

      const data = await res.json();
      if (res.ok) {
        // console.log(data);
        navigate("/categories/ManageSubServices");
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const handleDeleteItem = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/deleteItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceId, itemId: itemIdToDelete }),
      });
      if (res.ok) {
        setDecodedUser((prevItems) =>
          prevItems.filter((item) => item.itemId !== itemIdToDelete),
        );
        toast.warning("Item deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
    setShowModal(false);
  };

  const openModal = (itemId) => {
    setItemIdToDelete(itemId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

    const openOtherModal = () => {
      setOtherModal(true);
    };

    const closeOtherModal = () => {
      setOtherModal(false);
    };

  const handleUploadItemIcon = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    } else {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setNewItem({
          ...newItem,
          imgData: base64String,
        });
      };
      

      reader.readAsDataURL(file);
    }
  };

  const handleEditService = () => {
    setEditFormData({
      serviceName: servicee.serviceName,
      vendorCommission: servicee.vendorCommission,
      imgData: servicee.imgData || "",
    });
    setShowEditModal(true);
  };

  const handleEditServiceChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleUploadServiceIcon = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      setEditFormData({
        ...editFormData,
        imgData: base64String,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSaveEditService = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/updateService`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        serviceId: serviceId,
        ...editFormData,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setServiceDetails((prevService) => ({
        ...prevService,
        ...editFormData,
      }));
      setShowEditModal(false);
      toast.success("Service updated successfully");
    } else {
      toast.error("Failed to update service");
    }
  };

  return (
    <div
      className="main-content"
      style={{ background: "#F8F8FB", minHeight: "100vh" }}
    >
      <ToastContainer />
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18"> Categories</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/tables">Categories</Link>
                    </li>
                    <li className="breadcrumb-item active">Service Table</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="p-2 d-flex align-items-center justify-content-between">
                    <span className="card-title serviceTitle">
                      {servicee.serviceName}
                    </span>
                    <span>
                      Vendor commission : {servicee.vendorCommission}%
                    </span>

                    <div>
                      <button
                        onClick={handleEditService}
                        style={{ borderRadius: "7px" }}
                        className="bg-primary border-0 mr-3 text-white pt-1 pb-1 pl-4 pr-4"
                      >
                        Edit Service
                      </button>

                      <button
                        onClick={() => openOtherModal()}
                        style={{ borderRadius: "7px" }}
                        className="bg-danger border-0 text-white pt-1 pb-1 pl-4 pr-4"
                      >
                        Delete Service
                      </button>
                    </div>
                  </div>
                  <p className="card-title-desc">
                    Transform your laundry routine with our advanced washing
                    technology.
                  </p>

                  <div className="table-responsive">
                    <table className="table table-editable table-nowrap align-middle table-edits">
                      <thead>
                        <tr className="text-center align-middle">
                          <th className="text-white">Icon</th>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {decodedUser?.length > 0
                          ? decodedUser.map((item) => (
                              <tr
                                className="text-center"
                                key={item.itemId}
                                data-id={item.itemId}
                              >
                                <td data-field="image text-center">
                                  <div
                                    className="border mx-auto newImageBorder overflow-hidden"
                                    style={{ width: "50px", height: "50px" }}
                                  >
                                    <img
                                      src={item.itemIcon}
                                      width="60"
                                      height="60"
                                      className=" p-2"
                                      alt="icon"
                                    />
                                  </div>
                                </td>

                                <td data-field="id">{item.itemId}</td>
                                <td data-field="name">{item.name}</td>
                                <td data-field="price">₹ {item.unitPrice}</td>
                                <td className="text-center">
                                  <Link
                                    to="#"
                                    className="btn btn-outline-secondary btn-sm delete"
                                    title="delete"
                                    onClick={() => openModal(item.itemId)}
                                  >
                                    <i className="fa fa-trash"></i>
                                  </Link>
                                </td>
                              </tr>
                            ))
                          : "No item in the service"}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="table-responsive mt-3">
                <table className="table table-editable bg-white p-3 table-nowrap align-middle table-edits">
                  <thead>
                    <tr>
                      <th>Enter Name</th>
                      <th>Enter Price</th>
                      <th>Enter Icon</th>
                      <th className="text-white">Actiion</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          className="border"
                          value={newItem.itemName}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              itemName: e.target.value,
                            })
                          }
                          placeholder="Enter name"
                          style={{ width: "100%", boxSizing: "border-box" }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="border"
                          value={newItem.unitPrice}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              unitPrice: e.target.value,
                            })
                          }
                          placeholder="Enter price"
                          style={{ width: "100%", boxSizing: "border-box" }}
                          ref={lastInputRef}
                        />
                      </td>
                      <td>
                        <input
                          type="file"
                          className="border"
                          onChange={handleUploadItemIcon}
                          style={{ width: "100%", boxSizing: "border-box" }}
                        />
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={handleAddItemToService}
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
      </div>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to delete the item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleDeleteItem}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showOtherModal} onHide={closeOtherModal}>
        <Modal.Header>
          <Modal.Title>Delete Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to delete the Service?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeOtherModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleDeleteService}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Service Name</label>
            <input
              type="text"
              className="form-control"
              name="serviceName"
              value={editFormData.serviceName}
              onChange={handleEditServiceChange}
            />
          </div>
          <div className="form-group">
            <label>Vendor Commission (%)</label>
            <input
              type="number"
              className="form-control"
              name="vendorCommission"
              value={editFormData.vendorCommission}
              onChange={handleEditServiceChange}
            />
          </div>
          <div className="form-group">
            <label>Service Icon</label>
            <input
              type="file"
              className="form-control"
              onChange={handleUploadServiceIcon}
            />
            {editFormData.imgData && (
              <div className="mt-2">
                <img
                  src={`data:image/png;base64,${editFormData.imgData}`}
                  alt="Service Icon"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEditService}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServiceProvidingList;
