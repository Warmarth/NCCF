import { FiX } from "react-icons/fi";
import type { ProfileFormData } from "../../types/profile";

interface IProps {
  isEdit: boolean;
  handleCancel: () => void;
  formData: ProfileFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export const IsEditing = ({
  isEdit,
  handleCancel,
  formData,
  handleInputChange,
  handleSubmit,
  handleAvatarChange,
  isLoading,
}: IProps) => {
  return (
    <div>
      {isEdit && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div
            className="modal-content-premium"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Update Information</h2>
              <button className="modal-close" onClick={handleCancel}>
                <FiX size={20} className=" text-red-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="premium-form">
              <div className="form-row-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Legal Name"
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="unique_handle"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="premium-file-input"
                />
              </div>

              <div className="form-group">
                <label>Biography</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Share a short bio..."
                  rows={4}
                />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Batch</label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    placeholder="e.g. A25"
                  />
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                  />
                </div>
                <div className="form-group">
                  <label>State Code</label>
                  <input
                    type="text"
                    name="state_code"
                    value={formData.state_code}
                    onChange={handleInputChange}
                    placeholder="EK/24B/..."
                  />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-ghost"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="btn-premium-save"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
