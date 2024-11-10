import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from "react-bootstrap";


const Carousel = () => {
    const [carousel, setCarousel] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [carouselToDelete, setCarouselToDelete] = useState(null);
    // console.log("services", services);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const handleFetch = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/carousel`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setCarousel(data.carousel);
                }
            } catch (error) {
                toast.error("Some error occured 😥")
            }
        };

        handleFetch();
    }, []);

    const handleDeleteCarousel = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/carousel/${carouselToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Corrected Bearer token format
                },
            });

            if (res.ok) {
                toast.warning("Carousel deleted successfully");
                // Fetch updated list of carousel
                const updatedRes = await fetch(`${process.env.REACT_APP_API_URL}/carousel`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (updatedRes.ok) {
                    const data = await updatedRes.json();
                    setCarousel(data.carousel);
                     // Update state with the latest carousel
                } else {
                    throw new Error("Failed to fetch updated carousel");
                }
            } else {
                throw new Error("Failed to delete carousel");
            }
        } catch (error) {
            console.error(error);
        }
        setShowModal(false);
    };

    const openModal = (itemId) => {
        setCarouselToDelete(itemId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Carousel</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <span>Carousel</span>
                                        </li>
                                        <li className="breadcrumb-item active">View Carousel</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        {
                            carousel.length > 0 ? (<table className="table table-bordered table-hover table-centered mb-0">
                                <thead>
                                    <tr className="text-center">
                                        <th>Id</th>
                                        <th>Description</th>
                                        <th>Img</th>
                                        <th>Route</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(carousel) &&
                                        carousel.map((item) => (
                                            <tr key={item._id} data-id="1" className="text-center">
                                                <td data-field="id">{item.serviceId}</td>
                                                <td data-field="name">{item.description}</td>
                                                <td data-field="image">
                                                    <div
                                                        className="border mx-auto newImageBorder overflow-hidden"
                                                        style={{ width: "50px", height: "50px" }}
                                                    >
                                                        <img
                                                            src={item.img}
                                                            width="60"
                                                            height="60"
                                                            className=" p-2"
                                                            alt="icon"
                                                        />
                                                    </div>
                                                </td>
                                                <td data-field="name">{item.route}</td>
                                                <td className="text-center">
                                                    <Link
                                                        to="#"
                                                        className="btn btn-outline-secondary btn-sm delete"
                                                        title="delete"
                                                        onClick={() => openModal(item._id)}
                                                    >
                                                        <i className="fa fa-trash"></i>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>) : (<span className="text-center fs-15">No Carousel available</span>)
                        }
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Carousel</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to delete the Carousel?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleDeleteCarousel}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Carousel;
