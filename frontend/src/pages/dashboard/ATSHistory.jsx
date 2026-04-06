import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const ATSHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await axios.get(
        `${API}/ats/history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setHistory(res.data);
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">ATS History</h1>

        {history.map((item) => (
          <div
            key={item._id}
            className="border-b py-3 flex justify-between"
          >
            <div>
              <p className="font-medium">
                Score: {item.overallScore}%
              </p>
              <p className="text-sm text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ATSHistory;