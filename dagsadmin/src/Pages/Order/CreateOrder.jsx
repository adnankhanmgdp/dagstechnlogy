import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateOrder = () => {
  const [services, setServices] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const location = useLocation();
  const token = localStorage.getItem("token");

  const user = location.state.decodedUser;

  useEffect(() => {
    const handleFetchService = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/getService`,
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
          setServices(data.service);
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleFetchService();
  }, []);

  const handleItemCountChange = (serviceName, item, count) => {
    if (count < 0) return; // Prevent negative counts

    const index = selectedItems.findIndex(
      (selectedItem) =>
        selectedItem.serviceName === serviceName &&
        selectedItem.itemName === item.name,
    );

    if (index !== -1) {
      const updatedItems = [...selectedItems];
      updatedItems[index] = {
        ...updatedItems[index],
        count: count,
      };
      setSelectedItems(updatedItems);
    } else if (count !== 0) {
      setSelectedItems([
        ...selectedItems,
        {
          serviceName: serviceName,
          itemId: item.itemId,
          itemName: item.name,
          unitPrice: item.unitPrice,
          count: count,
        },
      ]);
    }
  };

  const formatOrderItems = () => {
    return selectedItems.map((item) => ({
      itemId: item.itemId,
      serviceName: item.serviceName,
      unitPrice: item.unitPrice,
      qty: item.count,
    }));
  };

  // {
  //   items: formatOrderItems();
  // }

  const logOrderItems = async() => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/createOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: user.phone,
          items: formatOrderItems(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Order created successfully")
      }
    } catch (error) {
      
    }
  };

  return (
    <div
      className="main-content"
      style={{ backgroundColor: "#F6F6F9", minHeight: "100vh" }}
    >
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">Order Creation</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link>Orders</Link>
                    </li>
                    <li className="breadcrumb-item active">Order Creation</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div>
            {services.length > 0 ? (
              services.map((service) => (
                <div className="bg-white m-4 p-3" key={service.serviceId}>
                  <h3
                    style={{ fontSize: "19px" }}
                    className="text-center italic p-2"
                  >
                    {service.serviceName}
                  </h3>
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-center">Item ID</th>
                        <th className="text-center">Item Name</th>
                        <th className="text-center">Unit Price</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {service.items.map((item) => (
                        <tr key={`${service.serviceId}-${item.itemId}`}>
                          <td className="text-center">{item.itemId}</td>
                          <td className="text-center">{item.name}</td>
                          <td className="text-center">{item.unitPrice}</td>
                          <td className="text-center">
                            <button
                              className="border-0 bg-primary text-white pl-3 pr-3"
                              onClick={() =>
                                handleItemCountChange(
                                  service.serviceName,
                                  item,
                                  (selectedItems.find(
                                    (selectedItem) =>
                                      selectedItem.serviceName ===
                                        service.serviceName &&
                                      selectedItem.itemName === item.name,
                                  )?.count || 0) + 1,
                                )
                              }
                            >
                              +
                            </button>
                            <span className="p-3">
                              {selectedItems.find(
                                (selectedItem) =>
                                  selectedItem.serviceName ===
                                    service.serviceName &&
                                  selectedItem.itemName === item.name,
                              )?.count || 0}
                            </span>
                            <button
                              className="border-0 bg-primary text-white pl-3 pr-3"
                              onClick={() =>
                                handleItemCountChange(
                                  service.serviceName,
                                  item,
                                  (selectedItems.find(
                                    (selectedItem) =>
                                      selectedItem.serviceName ===
                                        service.serviceName &&
                                      selectedItem.itemName === item.name,
                                  )?.count || 0) - 1,
                                )
                              }
                            >
                              -
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <span className="text-center">
                No services are available right now
              </span>
            )}
          </div>
        </div>
      </div>
      <button className="btn btn-primary m-4" onClick={logOrderItems}>
        Create Order
      </button>
    </div>
  );
};

export default CreateOrder;
