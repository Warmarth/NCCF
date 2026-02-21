import { FiTrash2 } from "react-icons/fi";
import type { User } from "../../pages/Admin";

interface UserListProps {
  filteredUsers: User[];
}

function UserList({ filteredUsers }: UserListProps) {
  return (
    <div className="tab-pane">
      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Batch</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td className="u-name-cell">{u.name}</td>
                <td>@{u.username}</td>
                <td>{u.batch || "N/A"}</td>
                <td>
                  <button className="btn-table-danger">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
