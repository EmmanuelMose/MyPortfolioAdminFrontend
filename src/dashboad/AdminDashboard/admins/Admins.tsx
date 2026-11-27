import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  listAdmins,
  inviteAdmin,
  updateAdmin,
  toggleAdminPermission,
  toggleAdminActive,
  deleteAdmin,
  deleteInvite,
  resendVerification,
} from "../../../Features/admins/admins";
import {
  UserPlus,
  Mail,
  ShieldCheck,
  ShieldOff,
  Power,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Loader2,
  Pencil,
  Send,
  Save,
} from "lucide-react";
import "./Admins.css";

type RegisteredAdmin = {
  id: number;
  email: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phoneNumber: string;
  role: "super_admin" | "admin";
  canApproveDownloads: boolean;
  isActive: boolean;
  isCodeVerified: boolean;
  lastLogin?: string | null;
  createdAt?: string;
};

type PendingInvite = {
  id: number;
  email: string;
  createdAt?: string;
};

type AdminsPayload = {
  registered: RegisteredAdmin[];
  pendingInvites: PendingInvite[];
  totalRegistered: number;
  totalPending: number;
};

const extractMessage = (err: any, fallback: string) => {
  const status = err?.response?.status;
  const serverMessage = err?.response?.data?.message;
  if (serverMessage) return serverMessage;
  if (status === 401 || status === 403) return "You do not have permission to do that";
  if (status) return `${fallback} (${status})`;
  return fallback;
};

const Admins = () => {
  const [data, setData] = useState<AdminsPayload>({
    registered: [],
    pendingInvites: [],
    totalRegistered: 0,
    totalPending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "admin" | "invite";
    id: number;
    email: string;
  } | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<RegisteredAdmin | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listAdmins();
      if (response?.success && response.data) setData(response.data);
      else toast.error("Unexpected response from server");
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to load admins"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return toast.error("Enter an email address");

    setInviting(true);
    try {
      const response = await inviteAdmin(trimmed);
      toast.success(response?.message || `Invitation sent to ${trimmed}`);
      setEmail("");
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to send invitation"));
    } finally {
      setInviting(false);
    }
  };

  const openEdit = (admin: RegisteredAdmin) => {
    setEditTarget(admin);
    setEditForm({
      firstName: admin.firstName || "",
      middleName: admin.middleName || "",
      lastName: admin.lastName || "",
      phoneNumber: admin.phoneNumber || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    setSavingEdit(true);
    try {
      await updateAdmin(editTarget.id, {
        firstName: editForm.firstName.trim(),
        middleName: editForm.middleName.trim() || null,
        lastName: editForm.lastName.trim(),
        phoneNumber: editForm.phoneNumber.trim(),
      });
      toast.success("Admin updated successfully");
      setEditTarget(null);
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to update admin"));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleTogglePermission = async (admin: RegisteredAdmin) => {
    setBusyId(admin.id);
    try {
      const response = await toggleAdminPermission(admin.id, !admin.canApproveDownloads);
      toast.success(response?.message || "Permission updated");
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to update permission"));
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleActive = async (admin: RegisteredAdmin) => {
    setBusyId(admin.id);
    try {
      const response = await toggleAdminActive(admin.id, !admin.isActive);
      toast.success(response?.message || "Status updated");
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to update status"));
    } finally {
      setBusyId(null);
    }
  };

  const handleResend = async (admin: RegisteredAdmin) => {
    setBusyId(admin.id);
    try {
      const response = await resendVerification(admin.email);
      toast.success(response?.message || "Verification code resent");
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to resend code"));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    try {
      const response =
        type === "admin" ? await deleteAdmin(id) : await deleteInvite(id);
      toast.success(response?.message || "Deleted successfully");
      setConfirmDelete(null);
      await load();
    } catch (err: any) {
      toast.error(extractMessage(err, "Failed to delete"));
    }
  };

  const fullName = (a: RegisteredAdmin) =>
    [a.firstName, a.middleName, a.lastName].filter(Boolean).join(" ");

  return (
    <div className="admins-page">
      <div className="admins-header">
        <div>
          <h2>Manage Admins</h2>
          <p className="admins-subtitle">
            Invite, edit, activate, or revoke access for portfolio administrators
          </p>
        </div>
        <div className="admins-stats">
          <span className="admins-stat">
            <strong>{data.totalRegistered}</strong> Registered
          </span>
          <span className="admins-stat">
            <strong>{data.totalPending}</strong> Pending
          </span>
        </div>
      </div>

      <form onSubmit={handleInvite} className="admins-invite-form">
        <div className="admins-invite-wrapper">
          <Mail className="admins-invite-icon" size={16} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="new-admin@example.com"
            disabled={inviting}
            required
          />
        </div>
        <button type="submit" className="admins-invite-btn" disabled={inviting}>
          {inviting ? <Loader2 size={15} className="admins-spin" /> : <UserPlus size={15} />}
          {inviting ? "Sending..." : "Invite Admin"}
        </button>
      </form>

      {loading ? (
        <div className="admins-loading">
          <Loader2 size={22} className="admins-spin" />
          <span>Loading admins...</span>
        </div>
      ) : (
        <>
          <section className="admins-section">
            <h3 className="admins-section-title">
              Registered Admins <span>{data.registered.length}</span>
            </h3>

            {data.registered.length === 0 ? (
              <div className="admins-empty">No registered admins yet. Invite one above.</div>
            ) : (
              <div className="admins-table">
                <div className="admins-table-head">
                  <span>Admin</span>
                  <span>Contact</span>
                  <span>Status</span>
                  <span>Permissions</span>
                  <span>Actions</span>
                </div>

                {data.registered.map((a) => (
                  <div className="admins-row" key={a.id}>
                    <div className="admins-cell">
                      <div className="admins-avatar">
                        {(a.firstName?.[0] || a.email[0]).toUpperCase()}
                        {(a.lastName?.[0] || "").toUpperCase()}
                      </div>
                      <div className="admins-name-block">
                        <span className="admins-name">{fullName(a)}</span>
                        <span className="admins-email">{a.email}</span>
                        {!a.isCodeVerified && (
                          <span className="admins-unverified">Email not verified</span>
                        )}
                      </div>
                    </div>

                    <div className="admins-cell admins-cell-contact">
                      <span className="admins-phone">{a.phoneNumber}</span>
                      <span className="admins-role">
                        {a.role === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                    </div>

                    <div className="admins-cell">
                      <span
                        className={`admins-pill ${
                          a.isActive ? "admins-pill-active" : "admins-pill-inactive"
                        }`}
                      >
                        {a.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {a.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="admins-cell">
                      <span
                        className={`admins-pill ${
                          a.canApproveDownloads
                            ? "admins-pill-granted"
                            : "admins-pill-denied"
                        }`}
                      >
                        {a.canApproveDownloads ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
                        {a.canApproveDownloads ? "Can approve" : "No approval"}
                      </span>
                    </div>

                    <div className="admins-cell admins-cell-actions">
                      <button
                        className="admins-action-btn"
                        onClick={() => openEdit(a)}
                        disabled={busyId === a.id || a.role === "super_admin"}
                        title="Edit admin"
                      >
                        <Pencil size={14} />
                      </button>
                      {!a.isCodeVerified && (
                        <button
                          className="admins-action-btn"
                          onClick={() => handleResend(a)}
                          disabled={busyId === a.id}
                          title="Resend verification code"
                        >
                          <Send size={14} />
                        </button>
                      )}
                      <button
                        className="admins-action-btn"
                        onClick={() => handleTogglePermission(a)}
                        disabled={busyId === a.id || a.role === "super_admin"}
                        title="Toggle download approval"
                      >
                        {a.canApproveDownloads ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                      </button>
                      <button
                        className="admins-action-btn"
                        onClick={() => handleToggleActive(a)}
                        disabled={busyId === a.id || a.role === "super_admin"}
                        title={a.isActive ? "Deactivate" : "Activate"}
                      >
                        <Power size={14} />
                      </button>
                      <button
                        className="admins-action-btn admins-action-danger"
                        onClick={() =>
                          setConfirmDelete({ type: "admin", id: a.id, email: a.email })
                        }
                        disabled={busyId === a.id || a.role === "super_admin"}
                        title="Delete admin"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="admins-section">
            <h3 className="admins-section-title">
              Pending Invitations <span>{data.pendingInvites.length}</span>
            </h3>

            {data.pendingInvites.length === 0 ? (
              <div className="admins-empty">No pending invitations.</div>
            ) : (
              <div className="admins-invites-list">
                {data.pendingInvites.map((inv) => (
                  <div className="admins-invite-item" key={inv.id}>
                    <div className="admins-invite-left">
                      <Clock size={14} className="admins-invite-clock" />
                      <span className="admins-invite-email">{inv.email}</span>
                    </div>
                    <button
                      className="admins-invite-delete"
                      onClick={() =>
                        setConfirmDelete({ type: "invite", id: inv.id, email: inv.email })
                      }
                      title="Cancel invite"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {editTarget && (
        <div className="admins-confirm-overlay" onClick={() => setEditTarget(null)}>
          <div className="admins-confirm-card" onClick={(e) => e.stopPropagation()}>
            <h4>Edit Admin</h4>
            <p className="admins-edit-subtitle">
              Editing <strong>{editTarget.email}</strong>
            </p>

            <div className="admins-edit-fields">
              <div className="admins-edit-field">
                <label>First Name</label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                />
              </div>
              <div className="admins-edit-field">
                <label>Middle Name</label>
                <input
                  type="text"
                  value={editForm.middleName}
                  onChange={(e) => setEditForm({ ...editForm, middleName: e.target.value })}
                />
              </div>
              <div className="admins-edit-field">
                <label>Last Name</label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                />
              </div>
              <div className="admins-edit-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="admins-confirm-actions">
              <button className="admins-confirm-cancel" onClick={() => setEditTarget(null)}>
                Cancel
              </button>
              <button
                className="admins-confirm-save"
                onClick={handleSaveEdit}
                disabled={savingEdit}
              >
                {savingEdit ? <Loader2 size={14} className="admins-spin" /> : <Save size={14} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="admins-confirm-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admins-confirm-card" onClick={(e) => e.stopPropagation()}>
            <h4>
              {confirmDelete.type === "admin" ? "Delete this admin?" : "Cancel this invite?"}
            </h4>
            <p>
              <strong>{confirmDelete.email}</strong>{" "}
              {confirmDelete.type === "admin"
                ? "will be permanently removed. An email will be sent to confirm the deletion."
                : "will no longer be able to register as an admin."}
            </p>
            <div className="admins-confirm-actions">
              <button className="admins-confirm-cancel" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className="admins-confirm-delete" onClick={handleDelete}>
                {confirmDelete.type === "admin" ? "Delete Admin" : "Cancel Invite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;