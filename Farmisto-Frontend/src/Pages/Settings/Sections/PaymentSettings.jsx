import React, { useState, useEffect } from "react";
import { FaUser, FaCreditCard, FaBuilding, FaMoneyCheckAlt, FaEdit, FaWallet, FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";

const inputBase = "w-full px-4 py-3 rounded-xl border text-sm text-dark focus:outline-none transition-colors";
const inputEnabled = "border-cream-dark bg-white focus:border-orange";
const inputDisabled = "border-cream-dark bg-cream cursor-not-allowed text-muted";

const EditField = ({ label, icon: Icon, name, value, onChange, enabled, onToggle, placeholder, type = "text" }) => (
  <div>
    <label className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-wider mb-2">
      <Icon size={12} className="text-orange" /> {label}
    </label>
    <div className="flex items-center gap-2">
      <input type={type} name={name} value={value} onChange={onChange} disabled={!enabled} placeholder={placeholder}
        className={`${inputBase} ${enabled ? inputEnabled : inputDisabled}`} />
      <button type="button" onClick={onToggle}
        className={`w-9 h-9 flex items-center justify-center rounded-xl border shrink-0 transition-colors ${enabled ? "bg-orange border-orange text-white" : "bg-white border-cream-dark text-muted hover:border-orange hover:text-orange"}`}>
        <FaEdit size={13} />
      </button>
    </div>
  </div>
);

const Section = ({ title, icon: Icon, isOpen, onToggle, children }) => (
  <div className="bg-white rounded-2xl border border-cream-dark/50 overflow-hidden">
    <button type="button" onClick={onToggle} className="w-full flex items-center justify-between px-6 py-4 hover:bg-cream transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center">
          <Icon size={14} className="text-orange" />
        </div>
        <span className="font-semibold text-dark text-sm">{title}</span>
      </div>
      {isOpen ? <FaChevronUp size={12} className="text-muted" /> : <FaChevronDown size={12} className="text-muted" />}
    </button>
    {isOpen && <div className="px-6 pb-5 pt-1 space-y-4 border-t border-cream-dark">{children}</div>}
  </div>
);

const PaymentSettings = () => {
  const [formData, setFormData] = useState({ accountHolderName: "", accountNumber: "", bankName: "", ifscCode: "", upiId: "", paymentGateway: "" });
  const [editFields, setEditFields] = useState({ accountHolderName: false, accountNumber: false, bankName: false, ifscCode: false, upiId: false, paymentGateway: false });
  const [sections, setSections] = useState({ bankDetails: true, upiIntegration: false, paymentGatewaySettings: false });
  const [success, setSuccess] = useState(false);

  const fetchDefaultData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/farmer/settings/payment-data", { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      setFormData(response.data.payment || {});
    } catch (error) { console.error("Error fetching payment data:", error); }
  };

  useEffect(() => { fetchDefaultData(); }, []);

  const handleChange = (e) => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })); };
  const toggleEdit = (field) => setEditFields(p => ({ ...p, [field]: !p[field] }));
  const toggleSection = (s) => setSections(p => ({ ...p, [s]: !p[s] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldsToUpdate = Object.keys(formData).filter(f => editFields[f]);
    if (fieldsToUpdate.length === 0) { alert("No fields selected for update."); return; }
    const fd = new FormData();
    fieldsToUpdate.forEach(f => fd.append(f, formData[f]));
    try {
      const response = await axios.patch("http://localhost:4000/farmer/settings/update-payment", fd, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) { setSuccess(true); setTimeout(() => setSuccess(false), 3000); await fetchDefaultData(); }
    } catch (error) { console.error("Error updating payment settings:", error); }
    setEditFields({ accountHolderName: false, accountNumber: false, bankName: false, ifscCode: false, upiId: false, paymentGateway: false });
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl font-bold text-dark">Payment Settings</h2>
          <p className="text-sm text-muted mt-1">Manage your bank, UPI, and gateway details</p>
        </div>
        {success && <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-xl">✓ Saved!</span>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Section title="Bank Details" icon={FaBuilding} isOpen={sections.bankDetails} onToggle={() => toggleSection("bankDetails")}>
          <EditField label="Account Holder Name" icon={FaUser} name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} enabled={editFields.accountHolderName} onToggle={() => toggleEdit("accountHolderName")} placeholder="Account holder name" />
          <EditField label="Account Number" icon={FaCreditCard} name="accountNumber" value={formData.accountNumber} onChange={handleChange} enabled={editFields.accountNumber} onToggle={() => toggleEdit("accountNumber")} placeholder="Bank account number" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EditField label="Bank Name" icon={FaBuilding} name="bankName" value={formData.bankName} onChange={handleChange} enabled={editFields.bankName} onToggle={() => toggleEdit("bankName")} placeholder="Bank name" />
            <EditField label="IFSC Code" icon={FaMoneyCheckAlt} name="ifscCode" value={formData.ifscCode} onChange={handleChange} enabled={editFields.ifscCode} onToggle={() => toggleEdit("ifscCode")} placeholder="IFSC code" />
          </div>
        </Section>

        <Section title="UPI Integration" icon={FaWallet} isOpen={sections.upiIntegration} onToggle={() => toggleSection("upiIntegration")}>
          <EditField label="UPI ID" icon={FaCreditCard} name="upiId" value={formData.upiId} onChange={handleChange} enabled={editFields.upiId} onToggle={() => toggleEdit("upiId")} placeholder="name@bank" />
        </Section>

        <Section title="Payment Gateway" icon={FaWallet} isOpen={sections.paymentGatewaySettings} onToggle={() => toggleSection("paymentGatewaySettings")}>
          <EditField label="Payment Gateway" icon={FaWallet} name="paymentGateway" value={formData.paymentGateway} onChange={handleChange} enabled={editFields.paymentGateway} onToggle={() => toggleEdit("paymentGateway")} placeholder="e.g., Razorpay, Stripe" />
        </Section>

        <button type="submit" className="w-full py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-hover transition-colors shadow-md">
          Save Payment Settings
        </button>
      </form>
    </div>
  );
};

export default PaymentSettings;