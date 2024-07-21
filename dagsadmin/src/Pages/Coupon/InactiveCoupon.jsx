import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const InactiveCoupon = () => {
    const [coupon, setCoupon] = useState([]);
    // console.log("services", services);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const handleFetch = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/coupon`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    // console.log(data.service);
                    setCoupon(data.inactiveCoupons);
                }
            } catch (error) {
                toast.error("Something went wrong")
                // console.log(error);
            }
        };

        handleFetch();
    }, []);

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Inactive Coupon</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <span>Categories</span>
                                        </li>
                                        <li className="breadcrumb-item active">Inactive Coupon</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        {
                            coupon.length > 0 ? (<table className="table table-bordered table-hover table-centered mb-0">
                                <thead>
                                    <tr className="text-center">
                                        <th>Coupon Code</th>
                                        <th>Coupon Discount</th>
                                        <th>Description</th>
                                        <th>No. of times used</th>
                                        <th>Expiry At</th>
                                        <th>Max Discount</th>
                                        <th>Min Amount for Cart</th>
                                        {/* <th>Status</th> */}
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(coupon) &&
                                        coupon.map((item) => (
                                            <tr key={item._id} data-id="1" className="text-center">
                                                <td data-field="id">{item.couponName}</td>
                                                <td data-field="name">{item.couponDiscount}</td>
                                                <td data-field="name">{item.description}</td>
                                                <td data-field="name">{item.usedTimes}</td>
                                                <td data-field="name">
                                                    {new Date(item.expiryAt).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td data-field="name">{item.maxDiscount}</td>
                                                <td data-field="name">{item.minAmount}</td>
                                                {/* <td data-field="name">{item.status}</td> */}
                                                <td data-field="price">
                                                    <Link
                                                        to={`/coupon/editCoupon/${item._id}`}
                                                    >
                                                        <button className="border-0 pl-3 pr-3 pt-1 pb-1 bg-primary text-white">
                                                            Edit
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>) : (<span className="text-center fs-15">No Coupon available</span>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InactiveCoupon;
