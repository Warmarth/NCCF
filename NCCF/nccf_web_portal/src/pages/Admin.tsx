import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FiPlus,
  FiUsers,
  FiFileText,
  FiSettings,
  FiUserPlus,
  FiSearch,
  FiHome,
  FiPieChart,
} from "react-icons/fi";
import { supabase } from "../lib/supabase";
import type { Room } from "./Rooms";
import AddRooms from "../components/adminComponents/addRooms";
import UserList from "../components/adminComponents/userList";
import MakerAdmin from "../components/adminComponents/makerAdmin";
import AssignRoom from "../components/adminComponents/assignRoom";
import IsLoading from "../components/isLoading";
import { ReceiptUpload } from "../components/adminComponents/receiptUpload";

export interface User {
  id: string;
  name: string;
  username: string;
  batch: string;
  room_id?: string;
  payment_status?: string;
  role?: string;
}

export interface Receipt {
  id: string;
  amount: number;
  payment_type: string;
  transaction_id: string;
  status: "pending" | "verified" | "rejected";
  receipt_url: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<
    | "rooms"
    | "receipts"
    | "users"
    | "assign"
    | "analytics"
    | "settings"
    | "makeAdmin"
  >("analytics");
  const [users, setUsers] = useState<User[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [newRoom, setNewRoom] = useState({ name: "" });
  const [assignment, setAssignment] = useState({ userId: "", roomId: "" });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // fetch users completed
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, username, batch");
      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      setUsers(data ?? []);
    } catch (err) {
      console.error("Unexpected error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchReceipts = useCallback(async (isMounted = true) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("payment_verification")
      .select("*")
      .order("created_at", { ascending: false });
    if (isMounted) {
      if (error) {
        console.error("Error fetching receipts:", error);
      } else {
        setReceipts(data || []);
      }
      setIsLoading(false);
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    const { data, error } = await supabase.from("rooms").select("*");
    if (error) console.error("Error fetching rooms:", error);
    else setRooms(data as Room[]);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (
        activeTab === "users" ||
        activeTab === "assign" ||
        activeTab === "makeAdmin"
      )
        await fetchUsers();
      if (activeTab === "receipts") await fetchReceipts();
      if (activeTab === "rooms" || activeTab === "assign") await fetchRooms();
    };
    loadData();
  }, [activeTab, fetchUsers, fetchReceipts, fetchRooms]);

  const promoteToAdmin = async (userId: string) => {
    const { error } = await supabase
      .from("admins")
      .insert([{ id: userId, role: "admin" }]);
    if (error) alert("Error promoting user: " + error.message);
    else {
      alert("User promoted successfully!");
      fetchUsers();
    }
  };

  // add room completed
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("rooms")
      .insert([{ name: newRoom.name }]);
    if (error) {
      alert("Error adding room: " + error.message);
      return;
    }
    alert(`Room ${newRoom.name} added successfully.`);
    setNewRoom({ name: "" });
    fetchRooms();
  };

  // assign user completed
  const handleAssignUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check user exists
    const { data: userExists, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", assignment.userId)
      .single();

    if (userError || !userExists) {
      console.error("User does not exist:", assignment.userId);
      return;
    }

    // Check if user already has room
    const { data } = await supabase
      .from("room_members")
      .select("profile_id")
      .eq("profile_id", assignment.userId)
      .single();

    if (data?.profile_id) {
      // Update existing
      await supabase
        .from("room_members")
        .update({ room_id: assignment.roomId })
        .eq("profile_id", assignment.userId);
    } else {
      // Insert new
      await supabase.from("room_members").insert({
        profile_id: assignment.userId,
        room_id: assignment.roomId,
      });
    }

    alert(
      `User successfully assigned to room ${rooms.find((r) => r.id === assignment.roomId)?.name || "Unknown"}.`,
    );
    setAssignment({ userId: "", roomId: "" });
  };

  // verify receipt pending
  const handleVerifyReceipt = async (receiptId: string) => {
    const { error } = await supabase
      .from("payment_verification")
      .update({ status: "verified" })
      .eq("id", receiptId);
    if (error) {
      alert(error.message);
      return;
    }
    alert("Receipt verified successfully");
    fetchReceipts();
  };

  // reject receipt pending
  const handleRejectReceipt = async (receiptId: string) => {
    const { error } = await supabase
      .from("payment_verification")
      .update({ status: "rejected" })
      .eq("id", receiptId);
    if (error) {
      alert(error.message);
      return;
    }
    alert("Receipt rejected successfully");
    fetchReceipts();
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u?.username?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  return (
    <div className="admin-dashboard">
      <div className="admin-layout-grid">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-card admin-summary-card">
            <div className="admin-badge">ADMIN PANEL</div>
            <h2 className="admin-name">Management</h2>
            <p className="admin-role">System Administrator</p>

            <nav className="admin-nav-vertical">
              <button
                className={`a-nav-item ${activeTab === "analytics" ? "active" : ""}`}
                onClick={() => setActiveTab("analytics")}
              >
                <FiPieChart /> Overview
              </button>
              <button
                className={`a-nav-item ${activeTab === "receipts" ? "active" : ""}`}
                onClick={() => setActiveTab("receipts")}
              >
                <FiFileText /> Receipts
              </button>
              <button
                className={`a-nav-item ${activeTab === "rooms" ? "active" : ""}`}
                onClick={() => setActiveTab("rooms")}
              >
                <FiHome /> Rooms
              </button>
              <button
                className={`a-nav-item ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                <FiUsers /> Directory
              </button>
              <button
                className={`a-nav-item ${activeTab === "assign" ? "active" : ""}`}
                onClick={() => setActiveTab("assign")}
              >
                <FiPlus /> Assignment
              </button>
              <button
                className={`a-nav-item ${activeTab === "makeAdmin" ? "active" : ""}`}
                onClick={() => setActiveTab("makeAdmin")}
              >
                <FiUserPlus /> Authority
              </button>
              <button
                className={`a-nav-item ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <FiSettings /> Configuration
              </button>
            </nav>
          </div>

          <div className="sidebar-card quick-status-card">
            <h3>Platform Status</h3>
            <div className="status-indicator">
              <div className="status-dot online"></div>
              <span>Systems Operational</span>
            </div>
            <div className="sidebar-stat-mini">
              <span>Verified Users</span>
              <strong>{users.length}</strong>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main-content">
          <header className="content-header-premium">
            <div className="header-labels">
              <h1>Admin Control Center</h1>
              <p>Platform management and resource oversight.</p>
            </div>
            <div className="admin-header-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          <div className="content-card-body">
            {isLoading ? (
              <IsLoading isLoading={isLoading} />
            ) : (
              <>
                {activeTab === "analytics" && (
                  <div className="tab-pane">
                    <div className="analytics-grid">
                      <div className="analytics-card">
                        <label>Revenue</label>
                        <p className="big-value">₦4.2M</p>
                        <span className="trend positive">↑ 12% growth</span>
                      </div>
                      <div className="analytics-card">
                        <label>Occupancy</label>
                        <p className="big-value">84%</p>
                        <span className="trend warning">14 spots left</span>
                      </div>
                      <div className="analytics-card">
                        <label>New Users</label>
                        <p className="big-value">28</p>
                        <span className="trend positive">24h activity</span>
                      </div>
                    </div>
                    <section className="admin-section-premium">
                      <h3>Recent Activity</h3>
                      <div className="activity-placeholder">
                        Activity logs will appear here as you manage the portal.
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === "receipts" && (
                  <ReceiptUpload
                    receipts={receipts}
                    handleVerifyReceipt={handleVerifyReceipt}
                    handleRejectReceipt={handleRejectReceipt}
                  />
                )}

                {activeTab === "users" && (
                  <UserList filteredUsers={filteredUsers} />
                )}

                {activeTab === "rooms" && (
                  <AddRooms
                    handleAddRoom={handleAddRoom}
                    newRoom={newRoom}
                    rooms={rooms}
                    setNewRoom={setNewRoom}
                  />
                )}

                {activeTab === "assign" && (
                  <AssignRoom
                    handleAssignUser={handleAssignUser}
                    assignment={assignment}
                    setAssignment={setAssignment}
                    users={users}
                    rooms={rooms}
                  />
                )}

                {activeTab === "makeAdmin" && (
                  <MakerAdmin
                    filteredUsers={filteredUsers}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    promoteToAdmin={promoteToAdmin}
                  />
                )}

                {activeTab === "settings" && (
                  <div className="tab-pane">
                    <div className="settings-stack-premium">
                      <div className="setting-box">
                        <div className="s-text">
                          <h4>Global Registration</h4>
                          <p>Allow new members to join the portal.</p>
                        </div>
                        <div className="toggle-switch active"></div>
                      </div>
                      <div className="setting-box">
                        <div className="s-text">
                          <h4>Maintenance Shield</h4>
                          <p>Lock the public portal for system updates.</p>
                        </div>
                        <div className="toggle-switch"></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
