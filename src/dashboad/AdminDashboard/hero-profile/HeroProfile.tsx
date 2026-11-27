import { useState, useEffect } from "react";
import { getHeroProfile, updateHeroProfile, createHeroProfile } from "../../../../src/Features/hero-profile/heroProfile";
import { User, FileText, Image as ImageIcon, Eye, X } from "lucide-react";
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
  const [existing, setExisting] = useState<any>(null);
  const [isExisting, setIsExisting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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
          setExisting(response.data);
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

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPreview(false);
    };
    if (showPreview) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [showPreview]);

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
        const response = await updateHeroProfile(data);
        setExisting(response.data);
        setMessage({ type: "success", text: "Hero profile updated successfully" });
      } else {
        const response = await createHeroProfile(data);
        setExisting(response.data);
        setIsExisting(true);
        setMessage({ type: "success", text: "Hero profile created successfully" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to save profile" });
    } finally {
      setSaving(false);
    }
  };

  const currentImageSrc = profileImageFile
    ? URL.createObjectURL(profileImageFile)
    : existing?.profileImageCloudinaryUrl || formData.profileImageUrl;

  const previewData = {
    fullName: formData.fullName || "Your Name",
    greeting: formData.greeting || "Hello, I'm",
    bio: formData.bio || "Your bio will appear here.",
    profileImage: currentImageSrc,
    cv: cvFile ? "#" : existing?.cvCloudinaryUrl || formData.cvUploadUrl,
  };

  if (loading) {
    return (
      <div className="hero-loading-state">
        <div className="hero-loading-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="hero-profile-container">
      <div className="hero-profile-header">
        <div>
          <h2>{isExisting ? "Edit Hero Profile" : "Create Hero Profile"}</h2>
          <p className="hero-profile-subtitle">Manage your public hero section content</p>
        </div>
        <button
          type="button"
          className="hero-preview-btn"
          onClick={() => setShowPreview(true)}
          disabled={!formData.fullName}
        >
          <Eye size={15} />
          Preview
        </button>
      </div>

      {message.text && <div className={`hero-message ${message.type}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} className="hero-form">
        <section className="hero-form-section">
          <div className="hero-section-head">
            <div className="hero-section-icon">
              <User size={16} />
            </div>
            <div>
              <h3>Basic Information</h3>
              <p>This is what visitors see first on your portfolio.</p>
            </div>
          </div>

          <div className="hero-form-fields">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g., Emmanuel Mose"
                required
              />
            </div>

            <div className="form-group">
              <label>Greeting</label>
              <input
                type="text"
                name="greeting"
                value={formData.greeting}
                onChange={handleChange}
                placeholder="e.g., Hi, It's"
                required
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={5}
                placeholder="Tell visitors about yourself..."
                required
              />
            </div>
          </div>
        </section>

        <section className="hero-form-section">
          <div className="hero-section-head">
            <div className="hero-section-icon">
              <FileText size={16} />
            </div>
            <div>
              <h3>Curriculum Vitae</h3>
              <p>Upload a PDF file or paste a direct link to your CV.</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Upload CV (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)}
              />
              {cvFile && <span className="file-name">{cvFile.name}</span>}
            </div>
            <div className="form-group">
              <label>Or Paste CV URL</label>
              <input
                type="text"
                name="cvUploadUrl"
                value={formData.cvUploadUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        <section className="hero-form-section">
          <div className="hero-section-head">
            <div className="hero-section-icon">
              <ImageIcon size={16} />
            </div>
            <div>
              <h3>Profile Image</h3>
              <p>Square images look best. Recommended 800×800 or larger.</p>
            </div>
          </div>

          {currentImageSrc && (
            <div className="hero-image-preview">
              <img src={currentImageSrc} alt="Current profile" />
              <div className="hero-image-preview-text">
                <span className="hero-image-preview-label">Current image</span>
                <span className="hero-image-preview-hint">Upload a new one to replace it</span>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Upload Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImageFile(e.target.files ? e.target.files[0] : null)}
              />
              {profileImageFile && <span className="file-name">{profileImageFile.name}</span>}
            </div>
            <div className="form-group">
              <label>Or Paste Image URL</label>
              <input
                type="text"
                name="profileImageUrl"
                value={formData.profileImageUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        <div className="hero-form-actions">
          <button type="submit" className="hero-submit-btn" disabled={saving}>
            {saving ? "Saving..." : isExisting ? "Update Profile" : "Create Profile"}
          </button>
        </div>
      </form>

      {showPreview && (
        <div className="hero-preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="hero-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hero-preview-modal-header">
              <div>
                <span className="hero-preview-label">Live Preview</span>
                <h3>How visitors see your hero section</h3>
              </div>
              <button className="hero-preview-close" onClick={() => setShowPreview(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="hero-preview-body">
              <div className="hero-preview-content">
                <div className="hero-preview-text">
                  <span className="hero-preview-greeting">{previewData.greeting}</span>
                  <h1 className="hero-preview-name">{previewData.fullName}</h1>
                  <p className="hero-preview-bio">{previewData.bio}</p>
                  {previewData.cv && (
                    <a href={previewData.cv} className="hero-preview-cv" target="_blank" rel="noreferrer">
                      Download CV
                    </a>
                  )}
                </div>
                <div className="hero-preview-image-wrapper">
                  {previewData.profileImage ? (
                    <img src={previewData.profileImage} alt={previewData.fullName} className="hero-preview-image" />
                  ) : (
                    <div className="hero-preview-image-placeholder">No image</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroProfile;