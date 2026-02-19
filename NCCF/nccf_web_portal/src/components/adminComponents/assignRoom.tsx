interface AssignRoomProps {
  handleAssignUser: (e: React.FormEvent) => void;
  assignment: { userId: string; roomId: string };
  setAssignment: (assignment: { userId: string; roomId: string }) => void;
  users: any[];
  rooms: any[];
}

function AssignRoom({
  handleAssignUser,
  assignment,
  setAssignment,
  users,
  rooms,
}: AssignRoomProps) {
  return (
    <div className="tab-pane">
      <div className="admin-form-card">
        <h3>Resource Assignment</h3>
        <form onSubmit={handleAssignUser} className="premium-admin-form">
          <div className="form-group">
            <label>Target User</label>
            <select
              value={assignment.userId}
              onChange={(e) =>
                setAssignment({
                  ...assignment,
                  userId: e.target.value,
                })
              }
              required
            >
              <option value="">Choose a member...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} (@{u.username})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Target Resource (Room)</label>
            <select
              value={assignment.roomId}
              onChange={(e) =>
                setAssignment({
                  ...assignment,
                  roomId: e.target.value,
                })
              }
              required
            >
              <option value="">Choose a room...</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-premium-action">
            Confirm Allocation
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssignRoom;
