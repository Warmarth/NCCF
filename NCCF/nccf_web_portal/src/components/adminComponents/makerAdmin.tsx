import type { User } from "../../pages/Admin";

interface MakerAdminProps {
  filteredUsers: User[];
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  promoteToAdmin: (userId: string) => void;
}

function MakerAdmin({ filteredUsers, searchTerm, setSearchTerm, promoteToAdmin }: MakerAdminProps) {
  return (
    <div className="tab-pane">
      <div className="admin-form-card">
        <h3>Authority Escalation</h3>
        <p className="tab-desc">
          Promote trusted members to administrative roles.
        </p>
        <div className="form-group">
          <label>Member Username</label>
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="escalation-list">
        {filteredUsers.slice(0, 5).map((u) => (
          <div key={u.id} className="escalation-row">
            <div className="e-info">
              <strong>{u.name}</strong>
              <span>@{u.username}</span>
            </div>
            <button
              className="btn-escalate"
              onClick={() => promoteToAdmin(u.id)}
            >
              Grant Admin Access
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MakerAdmin