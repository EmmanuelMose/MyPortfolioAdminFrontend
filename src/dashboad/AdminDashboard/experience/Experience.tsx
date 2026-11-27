import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  listExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../../Features/experience/experience";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  Briefcase,
  Calendar,
  Building2,
} from "lucide-react";
import "./Experience.css";

type ExperienceItem = {
  id: number;
  companyName: string;
  roleTitle: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

const emptyForm = {
  companyName: "",
  roleTitle: "",
  description: "",
  startDate: "",
  endDate: "",
  displayOrder: 0,
};

const extractMessage = (err: any, fallback: string) => {
  const status = err?.response?.status;
  const serverMessage = err?.response?.data?.message;
  if (serverMessage) return serverMessage;
  if (status === 401 || status === 403) return "You do not have permission to do that";
  if (status) return `${fallback} (${status})`;
  return fallback;
};

const formatPeriod = (start?: string | null, end?: string | null) => {
  if (!start && !end) return "—";
  if (start && !end) return `${start} — Present`;
  if (!start && end) return `— ${end}`;
  return `${start} — ${end}`;
};

const Experience = () => {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ExperienceItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listExperience();
      if (response?.success && response.data) {
        setItems(response.data);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to load experience"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openAdd = () => {
    setForm({ ...emptyForm, displayOrder: items.length });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: ExperienceItem) => {
    setForm({
      companyName: item.companyName,
      roleTitle: item.roleTitle,
      description: item.description || "",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
      displayOrder: item.displayOrder,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const companyName = form.companyName.trim();
    const roleTitle = form.roleTitle.trim();

    if (!companyName) return toast.error("Company name is required");
    if (!roleTitle) return toast.error("Role title is required");
    if (form.startDate && !/^\d{4}(-\d{2})?$/.test(form.startDate.trim())) {
      return toast.error("Start date must be YYYY-MM or YYYY");
    }
    if (form.endDate && !/^\d{4}(-\d{2})?$/.test(form.endDate.trim())) {
      return toast.error("End date must be YYYY-MM or YYYY");
    }

    setSaving(true);
    try {
      const payload = {
        companyName,
        roleTitle,
        description: form.description.trim() || null,
        startDate: form.startDate.trim() || null,
        endDate: form.endDate.trim() || null,
        displayOrder: form.displayOrder,
      };

      if (editingId !== null) {
        const response = await updateExperience(editingId, payload);
        toast.success(response?.message || "Experience updated");
      } else {
        const response = await createExperience(payload);
        toast.success(response?.message || "Experience added");
      }
      resetForm();
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to save experience"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const response = await deleteExperience(confirmDelete.id);
      toast.success(response?.message || "Experience deleted");
      setConfirmDelete(null);
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to delete experience"));
    }
  };

  return (
    <div className="exp-page">
      <div className="exp-header">
        <div>
          <h2>Work Experience</h2>
          <p className="exp-subtitle">
            Your professional journey — companies, roles, and what you did there
          </p>
        </div>
        {!showForm && (
          <button className="exp-add-btn" onClick={openAdd}>
            <Plus size={15} />
            Add Experience
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="exp-form">
          <div className="exp-form-header">
            <h3>{editingId ? "Edit Experience" : "New Experience"}</h3>
            <button
              type="button"
              className="exp-form-close"
              onClick={resetForm}
              disabled={saving}
            >
              <X size={15} />
            </button>
          </div>

          <div className="exp-form-grid">
            <div className="exp-field">
              <label>Company Name *</label>
              <div className="exp-input-wrapper">
                <Building2 size={14} className="exp-input-icon" />
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="e.g. Google, Freelance"
                  maxLength={255}
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className="exp-field">
              <label>Role Title *</label>
              <div className="exp-input-wrapper">
                <Briefcase size={14} className="exp-input-icon" />
                <input
                  type="text"
                  value={form.roleTitle}
                  onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                  placeholder="e.g. Frontend Developer"
                  maxLength={255}
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className="exp-field">
              <label>Start Date</label>
              <div className="exp-input-wrapper">
                <Calendar size={14} className="exp-input-icon" />
                <input
                  type="text"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  placeholder="YYYY-MM (e.g. 2022-03)"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="exp-field">
              <label>End Date</label>
              <div className="exp-input-wrapper">
                <Calendar size={14} className="exp-input-icon" />
                <input
                  type="text"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  placeholder="YYYY-MM or leave empty for Present"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="exp-field">
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
          </div>

          <div className="exp-field">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Describe your responsibilities and achievements..."
              disabled={saving}
            />
          </div>

          <div className="exp-form-actions">
            <button type="button" className="exp-cancel-btn" onClick={resetForm} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="exp-submit-btn" disabled={saving}>
              {saving ? <Loader2 size={14} className="exp-spin" /> : <Save size={14} />}
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Experience"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="exp-loading">
          <Loader2 size={22} className="exp-spin" />
          <span>Loading experience...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="exp-empty">
          <Briefcase size={26} className="exp-empty-icon" />
          <p>No experience entries yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="exp-list">
          {items.map((item) => (
            <div className="exp-card" key={item.id}>
              <div className="exp-card-icon">
                <Building2 size={18} />
              </div>

              <div className="exp-card-main">
                <div className="exp-card-head">
                  <h4>{item.roleTitle}</h4>
                  <span className="exp-card-company">{item.companyName}</span>
                </div>
                <div className="exp-card-period">
                  <Calendar size={12} />
                  {formatPeriod(item.startDate, item.endDate)}
                </div>
                {item.description && (
                  <p className="exp-card-desc">{item.description}</p>
                )}
              </div>

              <div className="exp-card-actions">
                <button
                  className="exp-action-btn"
                  onClick={() => openEdit(item)}
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="exp-action-btn exp-action-danger"
                  onClick={() => setConfirmDelete(item)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="exp-confirm-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="exp-confirm-card" onClick={(e) => e.stopPropagation()}>
            <h4>Delete this experience?</h4>
            <p>
              <strong>
                {confirmDelete.roleTitle} @ {confirmDelete.companyName}
              </strong>{" "}
              will be permanently removed from your portfolio.
            </p>
            <div className="exp-confirm-actions">
              <button className="exp-confirm-cancel" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className="exp-confirm-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;