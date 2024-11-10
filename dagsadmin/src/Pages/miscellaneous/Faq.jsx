import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState("");
  const [editingAnswer, setEditingAnswer] = useState("");

  useEffect(() => {
    const getFAQS = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/fetchMisc`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        // console.log("all faqs are", data.charges.faq)
        setFaqs(data.charges.faq);
      }
    }
    getFAQS();
  }, []);

  const token = localStorage.getItem("token")

  const handleAddFAQ = () => {
    const newFAQ = { question: newQuestion, answer: newAnswer };
    fetch(`${process.env.REACT_APP_API_URL}/addFAQ`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newFAQ),
    })
      .then((response) => response.json())
      .then((data) => {
        setFaqs(data.faq);
        toast.success(" faq added successfully");
        setNewQuestion("");
        setNewAnswer("");
      })
      .catch((error) => console.error("Error adding FAQ:", error));
  };

  const handleEditFAQ = (index) => {
    setEditingIndex(index);
    setEditingQuestion(faqs[index].question);
    setEditingAnswer(faqs[index].answer);
  };

  const handleSaveEdit = () => {
    const updatedFAQ = { question: editingQuestion, answer: editingAnswer };
    fetch(`${process.env.REACT_APP_API_URL}/updateFAQ`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ faqId: faqs[editingIndex]._id, ...updatedFAQ }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Faq updated successfully")
        setFaqs(data.faq);
        setEditingIndex(null);
        setEditingQuestion("");
        setEditingAnswer("");
      })
      .catch((error) => console.error("Error updating FAQ:", error));
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingQuestion("");
    setEditingAnswer("");
  };

  const handleDeleteFAQ = async (_id) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/deleteFAQ`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ faqId: _id }),
    });
    const data = await res.json();
    if (res.ok) {
      setFaqs(data.faq);
      toast.success("deleted successfully");
    }
  }

  return (
    <div
     style={{ background: "#F8F8FB", minHeight: "100vh", overflowY: "auto" }}
      className="main-content"
    >
      <div className="page-content">
        <div className="container-fluid">
          <div className="container mt-5">
            <h3 className="mb-5 text-center">FAQ's</h3>
            <div className="card mb-4">
              <div className="card-header text-dark">Add New FAQ</div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="newQuestion">Question</label>
                  <input
                    type="text"
                    className="form-control"
                    id="newQuestion"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newAnswer">Answer</label>
                  <textarea
                    className="form-control"
                    id="newAnswer"
                    rows="3"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary" onClick={handleAddFAQ}>
                  Add
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-header text-dark">Existing FAQs</div>
              <div className="card-body" >
                {faqs.map((faq, index) => (
                  <div key={faq._id} className="mb-3">
                    {editingIndex === index ? (
                      <>
                        <div className="form-group">
                          <label htmlFor={`editQuestion${index}`}>
                            Question
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id={`editQuestion${index}`}
                            value={editingQuestion}
                            onChange={(e) => setEditingQuestion(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`editAnswer${index}`}>Answer</label>
                          <textarea
                            className="form-control"
                            id={`editAnswer${index}`}
                            rows="3"
                            value={editingAnswer}
                            onChange={(e) => setEditingAnswer(e.target.value)}
                          />
                        </div>
                        <button
                          className="btn btn-success"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary ml-2"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Question:</strong> {faq.question}
                        </p>
                        <p>
                          <strong>Answer:</strong> {faq.answer}
                        </p>
                        <div>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEditFAQ(index)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn ml-2 btn-danger"
                            onClick={() => handleDeleteFAQ(faq._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
