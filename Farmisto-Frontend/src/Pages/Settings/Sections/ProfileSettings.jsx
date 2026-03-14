import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaLock, FaHome, FaCity, FaMapPin, FaGlobe, FaCamera, FaEdit } from "react-icons/fa";
import axios from "../../../utils/axios";

const inputBase = "w-full px-4 py-3 rounded-xl border text-sm text-dark focus:outline-none transition-colors";
const inputEnabled = "border-cream-dark bg-white focus:border-orange";
const inputDisabled = "border-cream-dark bg-cream cursor-not-allowed text-muted";

const FieldRow = ({ label, icon: Icon, name, type = "text", value, onChange, enabled, onToggle, placeholder }) => (
  <div>
    <label className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-wider mb-2">
      <Icon size={12} className="text-orange" /> {label}
    </label>
    <div className="flex items-center gap-2">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={!enabled}
        placeholder={placeholder}
        className={`${inputBase} ${enabled ? inputEnabled : inputDisabled}`}
      />
      <button
        type="button"
        onClick={onToggle}
        className={`w-9 h-9 flex items-center justify-center rounded-xl border shrink-0 transition-colors ${enabled ? "bg-orange border-orange text-white" : "bg-white border-cream-dark text-muted hover:border-orange hover:text-orange"}`}
      >
        <FaEdit size={13} />
      </button>
    </div>
  </div>
);

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    farmerName: "", farmerProfilePhoto: null, farmerMobile: "", farmerPassword: "",
    farmerAddress: "", farmerCity: "", farmerStateZip: "", farmerCountry: "",
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [editFields, setEditFields] = useState({
    farmerName: false, farmerMobile: false, farmerPassword: false,
    farmerAddress: false, farmerCity: false, farmerStateZip: false,
    farmerCountry: false, farmerProfilePhoto: false,
  });
  const [success, setSuccess] = useState(false);

  const fetchDefaultData = async () => {
    try {
      const response = await axios.get("/farmer/settings/profile-data", { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      setFormData(response.data.farmer);
      setPhotoPreview(response.data.farmer.farmerProfilePhoto);
    } catch (error) { console.error("Error fetching profile data:", error); }
  };

  useEffect(() => { fetchDefaultData(); }, []);

  const handleChange = (e) => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })); };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(p => ({ ...p, farmerProfilePhoto: file }));
      setPhotoPreview(URL.createObjectURL(file));
      setEditFields(p => ({ ...p, farmerProfilePhoto: true }));
    }
  };
  const toggleEdit = (field) => setEditFields(p => ({ ...p, [field]: !p[field] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldsToUpdate = Object.keys(formData).filter(f => editFields[f]);
    if (fieldsToUpdate.length === 0) { alert("No fields selected for update."); return; }
    const fd = new FormData();
    fieldsToUpdate.forEach(f => {
      if (f === "farmerProfilePhoto" && formData[f] instanceof File) fd.append("profilePhoto", formData[f]);
      else fd.append(f, formData[f]);
    });
    try {
      const response = await axios.patch("/farmer/settings/update-profile", fd, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        setSuccess(true); setTimeout(() => setSuccess(false), 3000);
        await fetchDefaultData();
      }
    } catch (error) { console.error("Error updating profile:", error); }
    setEditFields({ farmerName: false, farmerMobile: false, farmerPassword: false, farmerAddress: false, farmerCity: false, farmerStateZip: false, farmerCountry: false, farmerProfilePhoto: false });
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl font-bold text-dark">Profile Settings</h2>
          <p className="text-sm text-muted mt-1">Click the ✏️ icon next to a field to edit it</p>
        </div>
        {success && <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-xl">✓ Profile updated!</span>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo */}
        <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-cream-dark/50">
          <div className="relative shrink-0">
            <img
              src={photoPreview || formData.farmerProfilePhoto || "https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg"}
              alt="Profile"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cream-dark"
            />
            <label htmlFor="farmerProfilePhoto" onClick={() => toggleEdit("farmerProfilePhoto")}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-orange-hover transition-colors">
              <FaCamera size={12} className="text-white" />
            </label>
            <input id="farmerProfilePhoto" type="file" accept="image/*" onChange={handleFileChange} disabled={!editFields.farmerProfilePhoto} className="hidden" />
          </div>
          <div>
            <p className="font-semibold text-dark">{formData.farmerName || "Your Name"}</p>
            <p className="text-sm text-muted">{formData.farmerCity || "Your City"}, {formData.farmerCountry || "Country"}</p>
            <p className="text-xs text-orange mt-1 font-medium">Click camera icon to change photo</p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-2xl p-6 border border-cream-dark/50 space-y-4">
          <h3 className="font-serif text-base font-bold text-dark mb-4">Personal Information</h3>
          <FieldRow label="Full Name" icon={FaUser} name="farmerName" value={formData.farmerName} onChange={handleChange} enabled={editFields.farmerName} onToggle={() => toggleEdit("farmerName")} placeholder="Your full name" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow label="Mobile" icon={FaPhone} name="farmerMobile" value={formData.farmerMobile} onChange={handleChange} enabled={editFields.farmerMobile} onToggle={() => toggleEdit("farmerMobile")} placeholder="10-digit mobile" />
            <FieldRow label="Password" icon={FaLock} type="password" name="farmerPassword" value={formData.farmerPassword} onChange={handleChange} enabled={editFields.farmerPassword} onToggle={() => toggleEdit("farmerPassword")} placeholder="New password" />
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-6 border border-cream-dark/50 space-y-4">
          <h3 className="font-serif text-base font-bold text-dark mb-4">Address</h3>
          <FieldRow label="Street Address" icon={FaHome} name="farmerAddress" value={formData.farmerAddress} onChange={handleChange} enabled={editFields.farmerAddress} onToggle={() => toggleEdit("farmerAddress")} placeholder="Street address" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow label="City" icon={FaCity} name="farmerCity" value={formData.farmerCity} onChange={handleChange} enabled={editFields.farmerCity} onToggle={() => toggleEdit("farmerCity")} placeholder="City name" />
            <FieldRow label="State & ZIP" icon={FaMapPin} name="farmerStateZip" value={formData.farmerStateZip} onChange={handleChange} enabled={editFields.farmerStateZip} onToggle={() => toggleEdit("farmerStateZip")} placeholder="State, ZIP" />
          </div>
          <FieldRow label="Country" icon={FaGlobe} name="farmerCountry" value={formData.farmerCountry} onChange={handleChange} enabled={editFields.farmerCountry} onToggle={() => toggleEdit("farmerCountry")} placeholder="Country" />
        </div>

        <button type="submit" className="w-full py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-hover transition-colors shadow-md">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
