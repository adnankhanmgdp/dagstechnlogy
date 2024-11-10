import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TimePickerDropdown = ({ times, onChange, value, placeholder }) => (
  <select
    className="form-control mr-3"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{ width: "28vw" }}
  >
    <option value="" disabled>
      {placeholder}
    </option>
    {times.map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ))}
  </select>
);

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 6; hour < 24; hour++) {
    times.push(`${hour < 10 ? "0" : ""}${hour}:00`);
  }
  return times;
};

const TimeSlotManager = () => {
  const [fetchedSlots, setFetchedSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const timeOptions = generateTimeOptions();

  const addTimeSlot = async() => {

      const res = await fetch(`${process.env.REACT_APP_API_URL}/createTimeSlot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body:JSON.stringify({startTime: startTime, endTime: endTime})
      })
    
    const data = await res.json();
    if (res.ok) {
      toast.success("Time slot added successfully")
      setFetchedSlots([...fetchedSlots, data.timeSlot].sort((a, b) => (a.startTime > b.startTime ? 1 : -1)));
      
      // Clear the input fields
      setStartTime("");
      setEndTime("");
    }else {
      toast.error("Failed to add time slot");
    }
      
    if (startTime && endTime) {
      const newSlot = `${startTime} - ${endTime}`;
      if (!timeSlots.includes(newSlot)) {
        setTimeSlots([...timeSlots, newSlot].sort());
      }
      setStartTime("");
      setEndTime("");
    }
  };

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/getTimeSlots`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await res.json();
        if (res.ok) {
          setFetchedSlots(data.timeSlots);
        }
      } catch (error) {}
    }
    fetchSlots();
  },[])

  const delectTimeslot = async (_id) => {
    // console.log("id",_id)
    const res = await fetch(`${process.env.REACT_APP_API_URL}/deleteTimeSlot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: _id }),
    });
    const data = await res.json();
    setFetchedSlots(fetchedSlots.filter((timeSlot) => timeSlot._id !== data.time._id));
    if (res.ok) {
      toast.success("Time slot deleted successfully")
    }
  }

  return (
    <div
      className="main-content"
      style={{ backgroundColor: "#F6F6F9", minHeight: "100vh" }}
    >
      <div className="page-content">
        <div className="container-fluid">
          <div className="list-group mt-3">
            {fetchedSlots.map((slot) => (
              <div
                key={slot._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  {slot.startTime} - {slot.endTime}
                </div>
                <button
                  onClick={()=>delectTimeslot(slot._id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="d-flex align-items-center mt-3">
            <TimePickerDropdown
              times={timeOptions}
              onChange={setStartTime}
              value={startTime}
              placeholder="Start Time"
            />
            <TimePickerDropdown
              times={timeOptions}
              onChange={setEndTime}
              value={endTime}
              placeholder="End Time"
            />
            <button onClick={addTimeSlot} className="btn btn-primary">
              Add Time Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotManager;
