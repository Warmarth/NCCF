import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiHash } from "react-icons/fi";
import { BsDoorOpen } from "react-icons/bs";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

type Room = {
  id: string;
  name: string;
};

export default function Room() {
  const { id } = useParams();
  const [room_members, setRoomMembers] = useState<any[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoomMembers = async () => {
    const { data: membersData, error: membersError } = await supabase
      .from("room_members")
      .select(
        `profile_id,
        joined_at,
        profiles ( name, batch, state_code )
      `,
      )
      .eq("room_id", id);
    if (membersError) {
      console.error("Error fetching room members:", membersError);
    } else {
      setRoomMembers(membersData || []);
      setIsLoading(false);
    }
  };

  const fetchRoom = async () => {
    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select("id, name")
      .eq("id", id)
      .single();
    if (roomError) {
      console.error("Error fetching room:", roomError);
    } else {
      setRoom(roomData as Room);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomMembers();
    fetchRoom();
  }, [id]);

  return (
    <div className="room-portal-dashboard">
      <div style={{ marginBottom: "2rem" }}>
        <Link
          to="/rooms"
          className="btn-ghost"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <FiArrowLeft /> Back to Discovery
        </Link>
      </div>

      <header className="room-portal-header">
        <div className="room-portal-meta">
          <div className="room-title-area">
            <div className="room-portal-icon">
              <BsDoorOpen />
            </div>
            <div className="room-name-group">
              <div className="room-id-badge-premium">
                <FiHash size={12} /> Unit ID: {id}
              </div>
              <h1>{room?.name || "Initializing Portal..."}</h1>
            </div>
          </div>

          {!isLoading && (
            <div className="room-stats-summary">
              <div className="stat-pills">
                <label>Total Members</label>
                <span>{room_members.length}</span>
              </div>
              <div className="stat-pills">
                <label>Unit Status</label>
                <span style={{ color: "#4caf50" }}>Active</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="room-content-grid">
        <section className="portal-member-section">
          <div className="section-header-premium">
            <h2>Unit Directory</h2>
            <div className="admin-header-search" style={{ width: "250px" }}>
              <FiHash />
              <input type="text" placeholder="Search members..." disabled />
            </div>
          </div>

          {isLoading ? (
            <div className="admin-loading-state">
              <div className="loading-spinner-premium"></div>
              <p>Synchronizing unit data...</p>
            </div>
          ) : (
            <div className="premium-table-container">
              <table className="member-premium-table">
                <thead>
                  <tr>
                    <th>Member Identity</th>
                    <th>Batch</th>
                    <th>State Code</th>
                    <th>Date Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {room_members.map((member) => {
                    const profile = Array.isArray(member.profiles)
                      ? member.profiles[0]
                      : member.profiles;

                    return (
                      <tr key={profile?.state_code}>
                        <td>
                          <div className="member-identity">
                            <div className="member-avatar-mini">
                              {(profile?.name || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="member-name-info">
                              <strong>
                                {profile?.name || "Anonymous Member"}
                              </strong>
                              <span>Active Personnel</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="batch-badge">
                            {profile?.batch || "N/A"}
                          </span>
                        </td>
                        <td>
                          <span className="state-code-badge">
                            {profile?.state_code || "N/A"}
                          </span>
                        </td>
                        <td>
                          <span className="joined-date">
                            {new Date(member.joined_at).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {room_members.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="room-empty-state"
                        style={{ padding: "4rem" }}
                      >
                        Portal currently unoccupied. New assignments will appear
                        here once synchronized.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
