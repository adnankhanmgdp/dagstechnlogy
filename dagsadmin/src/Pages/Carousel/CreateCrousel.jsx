import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";

const CreateCarousel = () => {
    const [serviceId, setServiceId] = useState("");
    const [description, setDescription] = useState("");
    const [img, setImg] = useState("");  // Base64 image data
    const [route, setRoute] = useState("");
    const [error, setError] = useState("");
    const [services, setServices] = useState([]);  // List of services for dropdown
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Fetch service IDs for dropdown
    useEffect(() => {
        const fetchServices = async () => {
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
                    setServices(data.service);  // Assuming the API returns an array of services
                } else {
                    throw new Error("Failed to fetch services");
                }
            } catch (error) {
                toast.error("An error occurred while fetching services");
                console.error(error);
            }
        };

        fetchServices();
    }, [token]);

    // Convert image file to Base64 string
    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        } else {
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1];
                setImg(base64String);
            };

            reader.readAsDataURL(file);
        }
    };

    // Change in the `handleSubmit` method
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Convert "none" to a meaningful value for backend or handle it as a special case
        // console.log(serviceId)
        // let finalServiceId = serviceId === "none" ? 0 : 0;
        // if (serviceId == "none") {
        //     console.log("hi")
        //     finalServiceId = 0;
        // }

        if (!description || !img) {
            setError("All fields except Service ID are required.");
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/carousel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    serviceId: serviceId,  // Updated to handle "none"
                    description,
                    img,  // Send Base64 image data
                    route: "/"
                }),
            });

            if (res.ok) {
                toast.success("Carousel created successfully! 😃");
                navigate("/carousel/allCarousel"); // Redirect to carousel page or another page
            } else {
                toast.error("Failed to create carousel");
            }
        } catch (error) {
            toast.error("An error occurred while creating the carousel");
        }
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Create Carousel</h4>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="form-group">
                            <label>Service ID</label>
                            <select
                                value={serviceId}
                                onChange={(e) => setServiceId(e.target.value)}
                                className="form-control"
                            >
                                <option value="">Select a Service</option>
                                <option value="-1">None</option>
                                {services.map((service, index) => (
                                    <option key={service.serviceId} value={index}>
                                        {service.serviceId} - {service.serviceName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-control"
                                placeholder="Enter description"
                            />
                        </div>
                        <div className="form-group">
                            <label>Image Upload</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="form-control"
                            />
                            <small className="form-text text-muted">The carousel size should be 967 x 534 pixels</small>
                        </div>
                        <div className="form-group">
                            <label>Route</label>
                            <input
                                type="text"
                                value={route}
                                onChange={(e) => setRoute(e.target.value)}
                                className="form-control"
                                placeholder="Enter route"
                                disabled
                            />
                        </div>
                        <Button type="submit" className="btn btn-primary mt-3">
                            Create Carousel
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCarousel;
