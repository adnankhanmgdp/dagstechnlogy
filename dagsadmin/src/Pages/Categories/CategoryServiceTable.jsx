import React from 'react'
import { useParams } from 'react-router-dom';

const CategoryServiceTable = () => {

  const { item } = useParams();
  const decodedUser = JSON.parse(decodeURIComponent(item));
  // console.log("decoded",decodedUser);
  // console.log("item", item);

  const data = decodedUser.items;


  return (
    <div class="main-content">
      <div class="page-content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 class="mb-sm-0 font-size-18">Service Cost</h4>

                <div class="page-title-right">
                  <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item">
                      <span>Categories</span>
                    </li>
                    <li class="breadcrumb-item active">Service Cost</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title mt-2 mb-2">
                    {decodedUser.serviceName}
                  </h4>
                  <p class="card-title-desc mb-4 mt-4">
                    We use different type of gel with which your clothes get
                    extra whitening
                  </p>

                  <div class="table-responsive">
                    <table class="table table-editable table-nowrap align-middle table-edits">
                      <thead>
                        <tr className="text-center">
                          <th>Item Icon</th>
                          <th>Item ID</th>
                          <th>Item Name</th>
                          <th>Item Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(data) &&
                          data.map((item) => (
                            <tr data-id="1" className="text-center">
                              <td data-field="image">
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
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryServiceTable