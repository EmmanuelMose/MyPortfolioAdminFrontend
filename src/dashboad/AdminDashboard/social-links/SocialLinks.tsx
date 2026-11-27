import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  listSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from "../../../Features/social-links/socialLinks";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  Link as LinkIcon,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "./SocialLinks.css";

type SocialLink = {
  id: number;
  platformName: string;
  url: string;
  platformIconCloudinaryUrl?: string | null;
  platformIconUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const extractMessage = (err: any, fallback: string) => {
  const status = err?.response?.status;
  const serverMessage = err?.response?.data?.message;
  if (serverMessage) return serverMessage;
  if (status === 401 || status === 403) return "You do not have permission to do that";
  if (status) return `${fallback} (${status})`;
  return fallback;
};

const emptyForm = {
  platformName: "",
  url: "",
  platformIconUrl: "",
  displayOrder: 0,
  isActive: true,
};

const SocialLinks = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SocialLink | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listSocialLinks();
      if (response?.success && response.data) {
        setLinks(response.data);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to load social links"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm);
    setIconFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const openAdd = () => {
    setForm({ ...emptyForm, displayOrder: links.length });
    setIconFile(null);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (link: SocialLink) => {
    setForm({
      platformName: link.platformName,
      url: link.url,
      platformIconUrl: link.platformIconUrl || "",
      displayOrder: link.displayOrder,
      isActive: link.isActive,
    });
    setIconFile(null);
    setEditingId(link.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const platformName = form.platformName.trim();
    const url = form.url.trim();
    const platformIconUrl = form.platformIconUrl.trim();

    if (!platformName) return toast.error("Platform name is required");
    if (!url) return toast.error("URL is required");
    if (!/^https?:\/\/.+\..+/i.test(url) && !url.includes("@")) {
      return toast.error("Enter a valid URL (https://...)");
    }
    if (platformIconUrl && !/^https?:\/\/.+\..+/i.test(platformIconUrl)) {
      return toast.error("Icon URL is invalid");
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append("platformName", platformName);
      data.append("url", url);
      if (platformIconUrl) data.append("platformIconUrl", platformIconUrl);
      data.append("displayOrder", String(form.displayOrder));
      data.append("isActive", String(form.isActive));
      if (iconFile) data.append("platformIconFile", iconFile);

      if (editingId !== null) {
        const response = await updateSocialLink(editingId, data);
        toast.success(response?.message || "Social link updated");
      } else {
        const response = await createSocialLink(data);
        toast.success(response?.message || "Social link created");
      }
      resetForm();
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to save social link"));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (link: SocialLink) => {
    setBusyId(link.id);
    try {
      const data = new FormData();
      data.append("isActive", String(!link.isActive));
      const response = await updateSocialLink(link.id, data);
      toast.success(response?.message || "Status updated");
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to update status"));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const response = await deleteSocialLink(confirmDelete.id);
      toast.success(response?.message || "Social link deleted");
      setConfirmDelete(null);
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to delete social link"));
    }
  };

  const getIconSrc = (link: SocialLink) =>
    link.platformIconCloudinaryUrl || link.platformIconUrl || null;

  return (
    <div className="social-page">
      <div className="social-header">
        <div>
          <h2>Social Links</h2>
          <p className="social-subtitle">
            Manage the social media links that appear on your portfolio
          </p>
        </div>
        {!showForm && (
          <button className="social-add-btn" onClick={openAdd}>
            <Plus size={15} />
            Add Link
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="social-form">
          <div className="social-form-header">
            <h3>{editingId ? "Edit Social Link" : "New Social Link"}</h3>
            <button
              type="button"
              className="social-form-close"
              onClick={resetForm}
              disabled={saving}
            >
              <X size={15} />
            </button>
          </div>

          <div className="social-form-grid">
            <div className="social-field">
              <label>Platform Name *</label>
              <input
                type="text"
                value={form.platformName}
                onChange={(e) => setForm({ ...form, platformName: e.target.value })}
                placeholder="e.g. GitHub, LinkedIn, Twitter"
                maxLength={100}
                required
                disabled={saving}
              />
            </div>

            <div className="social-field">
              <label>URL *</label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://github.com/username"
                required
                disabled={saving}
              />
            </div>

            <div className="social-field">
              <label>Display Order</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) =>
                  setForm({ ...form, displayOrder: Math.max(0, Number(e.target.value)) })
                }
                min={0}
                disabled={saving}
              />
            </div>

            <div className="social-field social-field-toggle">
              <label>Visibility</label>
              <button
                type="button"
                className={`social-toggle ${form.isActive ? "social-toggle-on" : ""}`}
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                disabled={saving}
              >
                <span className="social-toggle-thumb" />
                <span className="social-toggle-label">
                  {form.isActive ? "Visible" : "Hidden"}
                </span>
              </button>
            </div>
          </div>

          <div className="social-form-grid">
            <div className="social-field">
              <label>Icon File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIconFile(e.target.files ? e.target.files[0] : null)}
                disabled={saving}
              />
              {iconFile && <span className="social-file-name">{iconFile.name}</span>}
            </div>

            <div className="social-field">
              <label>Or Paste Icon URL</label>
              <input
                type="text"
                value={form.platformIconUrl}
                onChange={(e) => setForm({ ...form, platformIconUrl: e.target.value })}
                placeholder="https://..."
                disabled={saving}
              />
            </div>
          </div>

          <div className="social-form-actions">
            <button type="button" className="social-cancel-btn" onClick={resetForm} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="social-submit-btn" disabled={saving}>
              {saving ? <Loader2 size={14} className="social-spin" /> : <Save size={14} />}
              {saving ? "Saving..." : editingId ? "Save Changes" : "Create Link"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="social-loading">
          <Loader2 size={22} className="social-spin" />
          <span>Loading social links...</span>
        </div>
      ) : links.length === 0 ? (
        <div className="social-empty">
          <LinkIcon size={26} className="social-empty-icon" />
          <p>No social links yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="social-list">
          {links.map((link) => {
            const icon = getIconSrc(link);
            return (
              <div
                key={link.id}
                className={`social-item ${!link.isActive ? "social-item-inactive" : ""}`}
              >
                <div className="social-item-icon">
                  {icon ? (
                    <img src={icon} alt={link.platformName} />
                  ) : (
                    <ImageIcon size={18} />
                  )}
                </div>

                <div className="social-item-main">
                  <div className="social-item-title-row">
                    <span className="social-item-title">{link.platformName}</span>
                    <span
                      className={`social-pill ${
                        link.isActive ? "social-pill-active" : "social-pill-inactive"
                      }`}
                    >
                      {link.isActive ? <CheckCircle size={11} /> : <XCircle size={11} />}
                      {link.isActive ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="social-item-url"
                  >
                    {link.url}
                    <ExternalLink size={11} />
                  </a>
                </div>

                <div className="social-item-actions">
                  <button
                    className="social-action-btn"
                    onClick={() => handleToggleActive(link)}
                    disabled={busyId === link.id}
                    title={link.isActive ? "Hide" : "Show"}
                  >
                    {busyId === link.id ? (
                      <Loader2 size={14} className="social-spin" />
                    ) : link.isActive ? (
                      <XCircle size={14} />
                    ) : (
                      <CheckCircle size={14} />
                    )}
                  </button>
                  <button
                    className="social-action-btn"
                    onClick={() => openEdit(link)}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="social-action-btn social-action-danger"
                    onClick={() => setConfirmDelete(link)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmDelete && (
        <div className="social-confirm-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="social-confirm-card" onClick={(e) => e.stopPropagation()}>
            <h4>Delete this social link?</h4>
            <p>
              <strong>{confirmDelete.platformName}</strong> will be removed from your portfolio.
            </p>
            <div className="social-confirm-actions">
              <button className="social-confirm-cancel" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className="social-confirm-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLinks;