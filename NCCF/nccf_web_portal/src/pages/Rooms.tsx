import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { BsDoorOpen } from "react-icons/bs";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../hook/AuthContext";

export interface Room {
  id: string;
  name: string;
}

export default function Rooms() {
  const { user } = useContext(AuthContext)!;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [memberRoomIds, setMemberRoomIds] = useState<string[]>([]);
  const [admin, setAdmin] = useState<boolean>(false);
  const [member, setMember] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      const { data, error } = await supabase.from("rooms").select("*");

      if (error) {
        console.error("Error fetching rooms:", error);
      } else {
        setRooms(data as Room[]);
      }
    };
    loadRooms();
  }, []);

useEffect(() => {
  if (!user) {
    setAdmin(false);
    setMember(false);
    setMemberRoomIds([]);
    setLoading(false);
    return;
  }

  const fetchUserData = async () => {
    setLoading(true);

    try {
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      setAdmin(!!adminData && !adminError);

      const { data: memberData, error: memberError } = await supabase
        .from("room_members")
        .select("room_id, profile_id")
        .eq("profile_id", user.id);

      if (memberError) {
        console.error("Member check error:", memberError);
        setMember(false);
        setMemberRoomIds([]);
      } else if (memberData && memberData.length > 0) {
        setMember(true);
        setMemberRoomIds(memberData.map((r) => r.room_id));
      } else {
        setMember(false);
        setMemberRoomIds([]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAdmin(false);
      setMember(false);
      setMemberRoomIds([]);
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, [user]);

  const visibleRooms = admin
    ? rooms
    : rooms.filter((room) => memberRoomIds.includes(room.id));

  return (
    <div className="rooms-dashboard">
      <header className="rooms-header-premium">
        <h1>Portal Discovery</h1>
        <p>
          Select a digital space to join specialized discussions and stay
          synchronized with your batch and state units.
        </p>
      </header>

      {loading ? (
        <div className="room-empty-state">
          <p>Scanning for active portals...</p>
        </div>
      ) : (
        <>
          <div className="rooms-grid-premium">
            {visibleRooms.length ? (
              visibleRooms.map((room) => (
                <div key={room.id} className="room-card-premium">
                  <div className="room-icon-wrapper">
                    <BsDoorOpen />
                  </div>

                  <div className="room-info">
                    <h3>{room.name}</h3>
                    <p>
                      Digital corridor for batch updates, housing coordination,
                      and fellowship announcements.
                    </p>
                  </div>

                  <Link to={`/rooms/${room.id}`} className="btn-join-premium">
                    Enter Portal <FiArrowRight />
                  </Link>
                </div>
              ))
            ) : (
              <div className="room-empty-state">
                <p>No accessible portals available.</p>
              </div>
            )}
          </div>

          {!admin && !member && (
            <div className="info-card" style={{ marginTop: "3rem" }}>
              <p>
                You haven't been assigned to a specific room portal yet. Please
                contact an administrator for allocation.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
