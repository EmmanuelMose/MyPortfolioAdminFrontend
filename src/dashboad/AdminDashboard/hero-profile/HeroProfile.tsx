import { useState, useEffect } from "react";
import { getHeroProfile, updateHeroProfile, createHeroProfile } from "../../../../src/Features/hero-profile/heroProfile";
import "./HeroProfile.css";

const HeroProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    greeting: "",
    bio: "",
    cvUploadUrl: "",
    profileImageUrl: "",
  });
  
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  
  const [isExisting, setIsExisting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getHeroProfile();
        if (response.success && response.data) {
          setFormData({
            fullName: response.data.fullName || "",
            greeting: response.data.greeting || "",
            bio: response.data.bio || "",
            cvUploadUrl: response.data.cvUploadUrl || "",
            profileImageUrl: response.data.profileImageUrl || "",
          });
          setIsExisting(true);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setIsExisting(false);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("greeting", formData.greeting);
    data.append("bio", formData.bio);
    
    if (formData.cvUploadUrl) data.append("cvUploadUrl", formData.cvUploadUrl);
    if (formData.profileImageUrl) data.append("profileImageUrl", formData.profileImageUrl);
    if (cvFile) data.append("cvFile", cvFile);
    if (profileImageFile) data.append("profileImageFile", profileImageFile);

    try {
      if (isExisting) {
        await updateHeroProfile(data);
        setMessage({ type: "success", text: "Hero profile updated successfully!" });
      } else {
        await createHeroProfile(data);
        setIsExisting(true);
        setMessage({ type: "success", text: "Hero profile created successfully!" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to save profile" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="hero-loading">Loading profile...</div>;

  return (
    <div className="hero-profile-container">
      <div className="hero-profile-header">
        <h2>{isExisting ? "Edit Hero Profile" : "Create Hero Profile"}</h2>
      </div>

      {message.text && (
        <div className={`hero-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="hero-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Greeting</label>
          <input type="text" name="greeting" value={formData.greeting} onChange={handleChange} placeholder="e.g., Hi, It's" required />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows={5} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Upload CV (PDF)</label>
            <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)} />
          </div>
          <div className="form-group">
            <label>Or Paste CV URL</label>
            <input type="text" name="cvUploadUrl" value={formData.cvUploadUrl} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Upload Profile Image</label>
            <input type="file" accept="image/*" onChange={(e) => setProfileImageFile(e.target.files ? e.target.files[0] : null)} />
          </div>
          <div className="form-group">
            <label>Or Paste Image URL</label>
            <input type="text" name="profileImageUrl" value={formData.profileImageUrl} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>

        <button type="submit" className="hero-submit-btn" disabled={saving}>
          {saving ? "Saving..." : isExisting ? "Update Profile" : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default HeroProfile;