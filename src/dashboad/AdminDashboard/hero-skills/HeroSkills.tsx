import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  listHeroSkills,
  createHeroSkill,
  updateHeroSkill,
  deleteHeroSkill,
} from "../../../Features/hero-skills/heroSkills";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  Sparkles,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "./HeroSkills.css";

type HeroSkill = {
  id: number;
  title: string;
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

const HeroSkills = () => {
  const [skills, setSkills] = useState<HeroSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editOrder, setEditOrder] = useState<number>(0);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<HeroSkill | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listHeroSkills();
      if (response?.success && response.data) {
        setSkills(response.data);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to load skills"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return toast.error("Enter a skill name");
    if (title.length < 2) return toast.error("Skill name is too short");

    setCreating(true);
    try {
      const response = await createHeroSkill({
        title,
        displayOrder: skills.length,
        isActive: true,
      });
      toast.success(response?.message || "Skill added");
      setNewTitle("");
      setAdding(false);
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to create skill"));
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (skill: HeroSkill) => {
    setEditingId(skill.id);
    setEditTitle(skill.title);
    setEditOrder(skill.displayOrder);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditOrder(0);
  };

  const handleSaveEdit = async (skill: HeroSkill) => {
    const title = editTitle.trim();
    if (!title) return toast.error("Skill name cannot be empty");
    if (title.length < 2) return toast.error("Skill name is too short");

    setSavingId(skill.id);
    try {
      const response = await updateHeroSkill(skill.id, {
        title,
        displayOrder: editOrder,
      });
      toast.success(response?.message || "Skill updated");
      cancelEdit();
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to update skill"));
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleActive = async (skill: HeroSkill) => {
    setTogglingId(skill.id);
    try {
      const response = await updateHeroSkill(skill.id, {
        isActive: !skill.isActive,
      });
      toast.success(
        response?.message ||
          (skill.isActive ? "Skill hidden" : "Skill visible")
      );
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to update skill"));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const response = await deleteHeroSkill(confirmDelete.id);
      toast.success(response?.message || "Skill deleted");
      setConfirmDelete(null);
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to delete skill"));
    }
  };

  return (
    <div className="skills-page">
      <div className="skills-header">
        <div>
          <h2>Hero Skills</h2>
          <p className="skills-subtitle">
            Skills that appear in your portfolio hero section
          </p>
        </div>
        {!adding && (
          <button
            className="skills-add-btn"
            onClick={() => setAdding(true)}
          >
            <Plus size={15} />
            Add Skill
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={handleCreate} className="skills-add-form">
          <div className="skills-add-input-wrapper">
            <Sparkles className="skills-add-icon" size={15} />
            <input
              type="text"
              placeholder="e.g. React, TypeScript, Node.js"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              disabled={creating}
              maxLength={255}
            />
          </div>
          <button type="submit" className="skills-add-submit" disabled={creating}>
            {creating ? <Loader2 size={14} className="skills-spin" /> : <Save size={14} />}
            {creating ? "Adding..." : "Add"}
          </button>
          <button
            type="button"
            className="skills-add-cancel"
            onClick={() => {
              setAdding(false);
              setNewTitle("");
            }}
            disabled={creating}
          >
            <X size={14} />
          </button>
        </form>
      )}

      {loading ? (
        <div className="skills-loading">
          <Loader2 size={22} className="skills-spin" />
          <span>Loading skills...</span>
        </div>
      ) : skills.length === 0 ? (
        <div className="skills-empty">
          <Sparkles size={26} className="skills-empty-icon" />
          <p>No skills yet. Add your first skill to get started.</p>
        </div>
      ) : (
        <div className="skills-list">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`skills-item ${!skill.isActive ? "skills-item-inactive" : ""}`}
            >
              {editingId === skill.id ? (
                <>
                  <div className="skills-edit-row">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="skills-edit-input"
                      maxLength={255}
                      disabled={savingId === skill.id}
                      autoFocus
                    />
                    <input
                      type="number"
                      value={editOrder}
                      onChange={(e) => setEditOrder(Number(e.target.value))}
                      className="skills-edit-order"
                      min={0}
                      title="Display order"
                      disabled={savingId === skill.id}
                    />
                  </div>
                  <div className="skills-edit-actions">
                    <button
                      className="skills-action-btn skills-action-save"
                      onClick={() => handleSaveEdit(skill)}
                      disabled={savingId === skill.id}
                    >
                      {savingId === skill.id ? (
                        <Loader2 size={14} className="skills-spin" />
                      ) : (
                        <Save size={14} />
                      )}
                    </button>
                    <button
                      className="skills-action-btn"
                      onClick={cancelEdit}
                      disabled={savingId === skill.id}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="skills-item-main">
                    <span className="skills-item-order">{skill.displayOrder + 1}</span>
                    <span className="skills-item-title">{skill.title}</span>
                    <span
                      className={`skills-pill ${
                        skill.isActive ? "skills-pill-active" : "skills-pill-inactive"
                      }`}
                    >
                      {skill.isActive ? <CheckCircle size={11} /> : <XCircle size={11} />}
                      {skill.isActive ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <div className="skills-item-actions">
                    <button
                      className="skills-action-btn"
                      onClick={() => handleToggleActive(skill)}
                      disabled={togglingId === skill.id}
                      title={skill.isActive ? "Hide skill" : "Show skill"}
                    >
                      {togglingId === skill.id ? (
                        <Loader2 size={14} className="skills-spin" />
                      ) : skill.isActive ? (
                        <XCircle size={14} />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                    </button>
                    <button
                      className="skills-action-btn"
                      onClick={() => startEdit(skill)}
                      title="Edit skill"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="skills-action-btn skills-action-danger"
                      onClick={() => setConfirmDelete(skill)}
                      title="Delete skill"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div
          className="skills-confirm-overlay"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="skills-confirm-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>Delete this skill?</h4>
            <p>
              <strong>{confirmDelete.title}</strong> will be permanently removed
              from your hero skills.
            </p>
            <div className="skills-confirm-actions">
              <button
                className="skills-confirm-cancel"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button className="skills-confirm-delete" onClick={handleDelete}>
                Delete Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSkills;