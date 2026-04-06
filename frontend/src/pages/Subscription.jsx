import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function Subscription() {

  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {

    setLoading(true);

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/subscription/upgrade`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Payment Successful! You are now a Pro user.");

      window.location.href = "/dashboard";

    } catch (error) {

      console.error(error);

      alert("Upgrade failed");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="grid grid-cols-2 gap-8">

        {/* FREE PLAN */}

        <div className="border p-8 bg-white">

          <h2 className="text-xl font-bold mb-4">
            Free Plan
          </h2>

          <p className="text-3xl mb-6">
            ₹0
          </p>

          <ul className="text-sm space-y-2">

            <li>✔ 1 Resume Builder</li>
            <li>✔ Basic Templates</li>
            <li>✔ Limited ATS Checks</li>

          </ul>

        </div>

        {/* PRO PLAN */}

        <div className="border p-8 bg-white shadow-lg">

          <h2 className="text-xl font-bold mb-4">
            Pro Plan
          </h2>

          <p className="text-3xl mb-6">
            ₹199
          </p>

          <ul className="text-sm space-y-2 mb-6">

            <li>✔ Unlimited Resumes</li>
            <li>✔ Premium Templates</li>
            <li>✔ Unlimited ATS Checks</li>
            <li>✔ AI Resume Optimization</li>

          </ul>

          <button
            onClick={handleUpgrade}
            className="bg-blue-600 text-white px-6 py-3"
          >
            {loading ? "Processing..." : "Upgrade to Pro"}
          </button>

        </div>

      </div>

    </div>

  );

}