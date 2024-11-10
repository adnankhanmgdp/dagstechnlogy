import React from 'react';
import moment from 'moment';

const OrderTimeline = ({ order }) => {
  // Define status mapping excluding 'cancelled' and 'refunded'
  const statusMap = {
    "pending": "Order Placed",
    "initiated": "Payment Confirmed",
    "readyToPickup": "Ready to Pickup",
    "pickedUp": "Picked Up",
    "cleaning": "Cleaning",
    "readyToDelivery": "Ready For Delivery",
    "outOfDelivery": "Out for Delivery",
    "delivered": "Delivered"
  };

  // Sort status by time
  const sortedStatuses = [...order.orderStatus].sort((a, b) => new Date(a.time) - new Date(b.time));

  // Determine the last status
  const lastStatus = sortedStatuses[sortedStatuses.length - 1];

  return (
    <div className="card card-timeline px-2 border-none">
      <ul className="bs4-order-tracking">
        {statusMap && Object.keys(statusMap).map((statusKey) => {
          const statusEntry = sortedStatuses.find(status => status.status === statusKey);
          const isActive = statusEntry;
          const isLatest = statusEntry && statusEntry.status === lastStatus.status;

          // Determine the icon background color based on the status
          const getColor = () => {
            if (isLatest) {
              return '#007bff'; // Blue for the latest status
            } else if (isActive) {
              return '#28a745'; // Green for statuses in the order
            } else {
              return '#6c757d'; // Grey for statuses not in the order
            }
          };

          return (
            <li
              key={statusKey}
              className={`step ${isActive ? 'active' : ''}`}
              style={{ color: '#878788' }}
            >
              <div style={{ background: getColor() }}>
                <i className={`fas ${statusKey === 'pending' ? 'fa-user' :
                  statusKey === 'pickedUp' ? 'fa-truck' :
                    statusKey === 'cleaning' ? 'fa-broom' :
                      statusKey === 'delivered' ? 'fa-gift' :
                        'fa-box'}`}></i>
              </div>
              {statusMap[statusKey]}
            </li>
          );
        })}
      </ul>
      <h5 className="text-center">
        <b>{order.orderStatus[order.orderStatus.length - 1].status || 'Unknown Status'}</b>
        <br />
        {moment(lastStatus.time).format('DD/MM/YYYY')}
      </h5>
    </div>
  );
};

export default OrderTimeline;





// import React from 'react';
// import moment from 'moment';

// const OrderTimeline = ({ order }) => {
//   // Define status mapping
//   const statusMap = {
//     "pending": "Order Placed",
//     "initiated": "Payment Confirmed",
//     "readyToPickup": "Ready to Pickup",
//     "pickedUp": "Picked Up",
//     "cleaning": "Cleaning",
//     "readyToDelivery": "Ready For Delivery",
//     "outOfDelivery": "Out for Delivery",
//     "delivered": "Delivered",
//     "cancelled": "Cancelled",
//     "refunded": "Refunded"
//   };

//   // Sort status by time
//   const sortedStatuses = [...order.orderStatus].sort((a, b) => new Date(a.time) - new Date(b.time));

//   // Determine the last status time
//   const lastStatusTime = sortedStatuses[sortedStatuses.length - 1]?.time;

//   return (
//     <div className="card card-timeline px-2 border-none">
//       <ul className="bs4-order-tracking">
//         {statusMap && Object.keys(statusMap).map((statusKey) => {
//           const statusEntry = sortedStatuses.find(status => status.status === statusKey);
//           const isActive = statusEntry && new Date(statusEntry.time) <= new Date(lastStatusTime);
//           return (
//             <li
//               key={statusKey}
//               className={`step ${isActive ? 'active' : ''}`}
//             >
//               <div>
//                 {/* Replace with appropriate icons for each status */}
//                 <i className={`fas ${statusKey === 'pending' ? 'fa-user' :
//                   statusKey === 'pickedUp' ? 'fa-truck' :
//                     statusKey === 'cleaning' ? 'fa-broom' :
//                       statusKey === 'delivered' ? 'fa-gift' :
//                         'fa-box'}`}></i>
//               </div>
//               {statusMap[statusKey]}
//             </li>
//           );
//         })}
//       </ul>
//       <h5 className="text-center">
//         <b>{statusMap[sortedStatuses[sortedStatuses.length - 1].status] || 'Unknown Status'}</b>
//         <br />
//         {moment(sortedStatuses[sortedStatuses.length - 1].time).format('DD/MM/YYYY')}
//       </h5>
//     </div>
//   );
// };

// export default OrderTimeline;
