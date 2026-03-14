import React, { useState } from "react";
import SideNav from "./SideNav"

const Payments = () => {
  const [payments, setPayments] = useState([
    { id: 1, client: "John Doe", total: 1000, received: 800 },
    { id: 2, client: "Jane Smith", total: 500, received: 500 },
    { id: 3, client: "Michael Brown", total: 2000, received: 1500 },
    { id: 4, client: "Emily White", total: 1200, received: 1000 },
  ]);

  const calculatePending = (total, received) => total - received;

  return (
    <div className="flex h-screen bg-gray-300">
      <SideNav />
      <div className="w-full h-screen bg-gray-300 p-6 overflow-y-auto">
        <h2 className="text-4xl font-serif mb-8">Payments</h2>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-2xl font-semibold mb-4">Payment Details</h3>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left border border-gray-300">Client</th>
                <th className="p-3 text-left border border-gray-300">Total Payment</th>
                <th className="p-3 text-left border border-gray-300">Received Payment</th>
                <th className="p-3 text-left border border-gray-300">Pending Payment</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-100 transition border-t"
                >
                  <td className="p-3 border border-gray-300">{payment.client}</td>
                  <td className="p-3 border border-gray-300">${payment.total}</td>
                  <td className="p-3 border border-gray-300">${payment.received}</td>
                  <td
                    className={`p-3 border border-gray-300 ${
                      calculatePending(payment.total, payment.received) > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    ${calculatePending(payment.total, payment.received)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
