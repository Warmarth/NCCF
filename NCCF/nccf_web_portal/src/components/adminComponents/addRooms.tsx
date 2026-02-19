import React from "react";
import type { Room } from "../../pages/Rooms";

interface AddRoomsProps {
  handleAddRoom: (e: React.FormEvent) => Promise<void>;
  newRoom: { name: string };
  rooms: Room[];
  setNewRoom: React.Dispatch<React.SetStateAction<{ name: string }>>;
}

function AddRooms({
  handleAddRoom,
  newRoom,
  rooms,
  setNewRoom,
}: AddRoomsProps) {
  return (
    <div className="tab-pane">
      <div className="admin-form-card">
        <h3>Create New Room</h3>
        <form onSubmit={handleAddRoom} className="premium-admin-form">
          <div className="form-group">
            <label>Room Identifier/Name</label>
            <input
              type="text"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ name: e.target.value })}
              placeholder="e.g. Zion Gate"
              required
            />
          </div>
          <button type="submit" className="btn-premium-action">
            Initialize Room
          </button>
        </form>
      </div>
      <div className="room-status-list">
        <h3>Existing Allocations</h3>
        <div className="room-pill-grid">
          {rooms.map((r) => (
            <div key={r.id} className="room-pill">
              {r.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddRooms;
