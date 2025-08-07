import React, { useEffect, useState } from "react";

export default function UserComplaintDashboard() {
  const userId =localStorage.getItem("Id"); 
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState("");
  const [againstName, setAgainstName] = useState(""); 
  const [filedFor, setFiledFor] = useState("self");
  const [otherDetails, setOtherDetails] = useState({
    name: "",
    mobile: "",
    address: "",
    district: "",
    state: "",
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch(`https://legal-assistant-et41.onrender.com/complaint/user/${userId}`);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Server error response:", errorText);
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched complaints:", data);
        setComplaints(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    fetchComplaints();
  }, [userId]);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();

    if (!newComplaint.trim() || !againstName.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    let payload = {
      user_id: userId,
      details: newComplaint.trim(),
      against_name: againstName.trim(),
      for_someone_else: filedFor === "other",
    };

    if (filedFor === "other") {
      const { name, mobile, address, district, state } = otherDetails;
      if (!name || !mobile || !address || !district || !state) {
        alert("Please fill all fields for the person you're filing for.");
        return;
      }

      payload.person_name = name;
      payload.person_mobile = mobile;
      payload.person_address = address;
      payload.person_district = district;
      payload.person_state = state;
    }

    try {
      const res = await fetch("https://legal-assistant-et41.onrender.com/complaint/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Complaint submitted successfully.");
        setNewComplaint("");
        setAgainstName(""); 
        setFiledFor("self");
        setOtherDetails({
          name: "",
          mobile: "",
          address: "",
          district: "",
          state: "",
        });
        setComplaints((prev) => [...prev, data]);
      } else {
        alert(data.message || "Submission failed.");
      }
    } catch (err) {
      console.error("Error submitting complaint:", err);
      alert("Failed to submit complaint.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🧾 File a Complaint</h1>

      <form onSubmit={handleSubmitComplaint} className="mb-6 p-4 bg-gray-100 rounded shadow">
        <label className="block mb-2 font-semibold">Who is this complaint for?</label>
        <select
          value={filedFor}
          onChange={(e) => setFiledFor(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        >
          <option value="self">Myself</option>
          <option value="other">Someone Else</option>
        </select>

        {filedFor === "other" && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={otherDetails.name}
              onChange={(e) => setOtherDetails({ ...otherDetails, name: e.target.value })}
              className="mb-2 p-2 border w-full rounded"
              required
            />
            <input
              type="text"
              placeholder="Mobile"
              value={otherDetails.mobile}
              onChange={(e) => setOtherDetails({ ...otherDetails, mobile: e.target.value })}
              className="mb-2 p-2 border w-full rounded"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={otherDetails.address}
              onChange={(e) => setOtherDetails({ ...otherDetails, address: e.target.value })}
              className="mb-2 p-2 border w-full rounded"
              required
            />
            <input
              type="text"
              placeholder="District"
              value={otherDetails.district}
              onChange={(e) => setOtherDetails({ ...otherDetails, district: e.target.value })}
              className="mb-2 p-2 border w-full rounded"
              required
            />
            <input
              type="text"
              placeholder="State"
              value={otherDetails.state}
              onChange={(e) => setOtherDetails({ ...otherDetails, state: e.target.value })}
              className="mb-4 p-2 border w-full rounded"
              required
            />
          </>
        )}

        <label className="block mb-2 font-semibold">Against Whom</label>
        <input
          type="text"
          value={againstName}
          onChange={(e) => setAgainstName(e.target.value)}
          placeholder="Enter name of the person you're complaining against"
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2 font-semibold">Complaint Details</label>
        <textarea
          value={newComplaint}
          onChange={(e) => setNewComplaint(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded mb-4"
          placeholder="Write your complaint here..."
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Complaint
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">📋 Your Previous Complaints</h2>
      {complaints.map((c) => (
  <div key={c._id} className="border p-4 rounded mb-4 bg-white shadow">
    <p><strong>Complaint:</strong> {c.details}</p>
    <p><strong>Against:</strong> {c.against_name}</p>
    <p><strong>Status:</strong> {c.status || "Pending"}</p>

    {c.for_someone_else && (
      <div className="mt-2 text-sm text-gray-600">
        <p><strong>Filed For:</strong> {c.person_name}</p>
        <p><strong>Phone:</strong> {c.person_mobile}</p>
        <p><strong>Address:</strong> {c.person_address}, {c.person_district}, {c.person_state}</p>
      </div>
    )}

    {c.lawyer && (
      <div className="mt-2 text-sm text-green-700">
        <p><strong>Assigned Lawyer:</strong> {c.lawyer.name} - {c.lawyer.email}</p>
      </div>
    )}
  </div>
))}

      </div>
    </div>
  );
}
