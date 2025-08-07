import React, { useState, useEffect } from "react";

export default function LawyerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

 // Fetch all complaints from the backend
useEffect(() => {
  const fetchComplaints = async () => {
    try {
      const response = await fetch("https://legal-assistant-et41.onrender.com/complaint/all");
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  fetchComplaints();
}, []);

const acceptComplaint = async (complaintId) => {
  const lawyerId = localStorage.getItem("Id"); // Assumes user ID is stored in localStorage

  try {
    // POST request to accept complaint
    const acceptResponse = await fetch(`https://legal-assistant-et41.onrender.com/complaint/accept/${complaintId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lawyer_id: lawyerId }),
    });

    if (!acceptResponse.ok) {
      throw new Error("Failed to accept complaint");
    }

    // Refresh the complaints list after accepting
    const refreshedResponse = await fetch("https://legal-assistant-et41.onrender.com/complaint/all");
    const updatedData = await refreshedResponse.json();
    setComplaints(updatedData);
  } catch (error) {
    console.error("Error accepting complaint:", error);
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⚖️ Lawyer Dashboard</h1>

      <div className="grid gap-4">
        {complaints.map((complaint) => (
          <div
            key={complaint._id}
            className="border p-4 rounded shadow bg-white"
          >
            <p><strong>Complaint:</strong> {complaint.details}</p>
            <p><strong>Status:</strong> {complaint.status}</p>
            <button
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => {
                setSelectedComplaint(complaint);
                acceptComplaint(complaint._id);
              }}
            >
              Take the Case
            </button>
          </div>
        ))}
      </div>

      {/* Show user details for selected complaint */}
      {selectedComplaint && selectedComplaint.user && (
        <div className="mt-8 p-6 border bg-blue-50 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">👤 User Contact Details</h2>
          <p><strong>Name:</strong> {selectedComplaint.user.name}</p>
          <p><strong>Email:</strong> {selectedComplaint.user.email}</p>
          <p><strong>Mobile:</strong> {selectedComplaint.user.mobile}</p>
          <p><strong>Address:</strong> {selectedComplaint.user.address}</p>
          <p><strong>District:</strong> {selectedComplaint.user.district}</p>
          <p><strong>State:</strong> {selectedComplaint.user.state}</p>
          <button
            onClick={() => setSelectedComplaint(null)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
