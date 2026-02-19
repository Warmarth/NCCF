import { useState, useEffect, useContext, useCallback } from "react";
import {
  FiEdit2,
  FiMapPin,
  FiGlobe,
  FiShare2,
  FiUser,
  FiSettings,
  FiShield,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../hook/AuthContext";
import { IsEditing } from "../components/userComponent/editing";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [avatarPreview, setAvatarPreview] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: "",
    gender: "male",
    batch: "",
    stateCode: "",
    location: "",
    phone: "",
    email: "",
  });

  const auth = useContext(AuthContext);
  const user = auth?.user;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setFormData({
          name: data.name || "",
          username: data.username || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
          gender: data.gender || "male",
          batch: data.batch || "",
          stateCode: data.state_code || "",
          location: data.location || "",
          phone: data.phone || "",
          email: user?.email || "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }, [user?.id, user?.email]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarPreview(e.target.files[0]);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${user?.id}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("imageBucket")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("Avatar upload error:", error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("imageBucket")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload: any = {
      name: formData.name,
      username: formData.username,
      bio: formData.bio,
      gender: formData.gender,
      batch: formData.batch,
      state_code: formData.stateCode,
      location: formData.location,
    };
    if (avatarPreview) {
      const avatarUrl = await uploadAvatar(avatarPreview);
      if (avatarUrl) {
        payload.avatar = avatarUrl;
      }
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", user?.id)
        .select()
        .single();

      if (error) {
        console.error("Error saving profile:", error);
        alert(`Failed to save profile:\n${error.message}`);
        return;
      }

      await fetchProfile();
      alert("Profile saved successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="profile-dashboard">
      <div className="profile-layout-grid">
        <aside className="profile-sidebar">
          <div className="sidebar-card main-profile-card">
            <div className="avatar-section">
              <div className="avatar-large-wrapper">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {formData.name.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <button
                  className="edit-avatar-trigger"
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit2 size={14} />
                </button>
              </div>
              <h2 className="display-name">{formData.name || "Member Name"}</h2>
              <p className="display-handle">
                @{formData.username || "username"}
              </p>
            </div>

            <div className="profile-quick-stats">
              <div className="stat-item">
                <span className="stat-label">Batch</span>
                <span className="stat-value">{formData.batch || "N/A"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Gender</span>
                <span
                  className="stat-value"
                  style={{ textTransform: "capitalize" }}
                >
                  {formData.gender}
                </span>
              </div>
            </div>

            <nav className="profile-nav-vertical">
              <button
                className={`p-nav-item ${activeTab === "personal" ? "active" : ""}`}
                onClick={() => setActiveTab("personal")}
              >
                <FiUser /> Personal Info
              </button>
              <button
                className={`p-nav-item ${activeTab === "registration" ? "active" : ""}`}
                onClick={() => setActiveTab("registration")}
              >
                <FiGlobe /> Registration Details
              </button>
              <button
                className={`p-nav-item ${activeTab === "account" ? "active" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                <FiSettings /> Account Settings
              </button>
            </nav>

            <button
              className="btn-edit-full"
              onClick={() => setIsEditing(true)}
            >
              <FiEdit2 /> Edit Profile
            </button>
          </div>

          <div className="sidebar-card contact-info-card">
            <h3>Contact Details</h3>
            <div className="contact-list">
              <div className="contact-item">
                <FiMail />
                <span>{user?.email}</span>
              </div>
              <div className="contact-item">
                <FiPhone />
                <span>{formData.phone || "No phone added"}</span>
              </div>
              <div className="contact-item">
                <FiMapPin />
                <span>{formData.location || "Earth"}</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="profile-main-content">
          <header className="content-header-premium">
            <div className="header-labels">
              <h1>Profile Management</h1>
              <p>Keep your corporate information secure and up to date.</p>
            </div>
            <button className="btn-premium-share">
              <FiShare2 /> Share
            </button>
          </header>

          <div className="content-card-body">
            {activeTab === "personal" && (
              <div className="tab-pane">
                <section className="info-group">
                  <h3>About You</h3>
                  <div className="bio-box">
                    {formData.bio ||
                      "No biography provided yet. Sharing a little about yourself helps other corpers connect."}
                  </div>
                </section>

                <div className="info-grid">
                  <div className="info-tile">
                    <label>Full Name</label>
                    <p>{formData.name}</p>
                  </div>
                  <div className="info-tile">
                    <label>Username</label>
                    <p>@{formData.username}</p>
                  </div>
                  <div className="info-tile">
                    <label>Gender</label>
                    <p style={{ textTransform: "capitalize" }}>
                      {formData.gender}
                    </p>
                  </div>
                  <div className="info-tile">
                    <label>State of Location</label>
                    <p>{formData.location || "Not Set"}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "registration" && (
              <div className="tab-pane">
                <section className="info-group">
                  <h3>Service Information</h3>
                  <div className="registration-status">
                    <div className="status-badge active">Verified Member</div>
                  </div>
                </section>

                <div className="info-grid">
                  <div className="info-tile">
                    <label>Batch</label>
                    <p>{formData.batch || "Pending"}</p>
                  </div>
                  <div className="info-tile">
                    <label>State Code</label>
                    <p>{formData.stateCode || "Not Assigned"}</p>
                  </div>
                  <div className="info-tile">
                    <label>Registration Date</label>
                    <p>Feb 2026</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="tab-pane">
                <section className="info-group">
                  <h3>Security & Privacy</h3>
                  <p className="tab-desc">
                    Manage your account credentials and system preferences.
                  </p>
                </section>

                <div className="settings-stack">
                  <div className="setting-row">
                    <div className="setting-info">
                      <FiShield />
                      <div>
                        <h4>Two-Factor Authentication</h4>
                        <p>
                          Currently disabled. Add an extra layer of security.
                        </p>
                      </div>
                    </div>
                    <button className="btn-setting-action">Enable</button>
                  </div>
                  <div className="setting-row">
                    <div className="setting-info">
                      <FiMail />
                      <div>
                        <h4>Email Notifications</h4>
                        <p>Receive updates about room allocations and news.</p>
                      </div>
                    </div>
                    <div className="toggle-switch active"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal - Reused from previous version but styled better */}

      {isEditing && (
        <div className="modal-overlay">
          <IsEditing
            isEdit={isEditing}
            handleCancel={handleCancel}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleAvatarChange={handleAvatarChange}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
