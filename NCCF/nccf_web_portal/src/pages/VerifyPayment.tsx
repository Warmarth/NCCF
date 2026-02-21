import React, { useContext, useState, useEffect } from "react";
import { FiUpload, FiInfo, FiCamera, FiCheck } from "react-icons/fi";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../hook/AuthContext";
import { Link } from "react-router-dom";

const VerifyPayment: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    paymentType: "download",
    transactionId: "",
    note: "",
  });

  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [id, setId] = useState<{ room_id: string; profile_id: string } | null>(
    null,
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    if (!isPdf && !isImage) {
      alert("Please upload a valid file");
      return;
    }
    if (isPdf || isImage) {
      setReceiptFile(file);
      if (receiptPreview) {
        URL.revokeObjectURL(receiptPreview);
      }
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const uploadReceipt = async (file: File): Promise<string> => {
    const filePath = `receipts/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from("imageBucket")
      .upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage
      .from("imageBucket")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const fetchUserRoomInfo = async (userId: string) => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from("room_members")
      .select("room_id, profile_id")
      .eq("profile_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching room info:", error);
      return null;
    }
    return data;
  };

  useEffect(() => {
    const initializeData = async () => {
      if (user?.id) {
        const data = await fetchUserRoomInfo(user.id);
        if (data) {
          setId(data);
        }
      }
    };
    const runInit = async () => {
      await initializeData();
    };
    runInit();

    return () => {
      if (receiptPreview) {
        URL.revokeObjectURL(receiptPreview);
      }
    };
  }, [user?.id, receiptPreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit a payment verification.");
      return;
    }

    if (!receiptFile) {
      alert("Please upload a proof of payment (receipt).");
      return;
    }

    setIsUploading(true);

    try {
      const receiptUrl = await uploadReceipt(receiptFile);
      const { error: insertError } = await supabase
        .from("payment_verification")
        .insert([
          {
            profile_id: id?.profile_id,
            room_id: id?.room_id,
            amount: parseFloat(formData.amount),
            payment_type: formData.paymentType,
            transaction_number: formData.transactionId,
            note: formData.note,
            receipt_url: receiptUrl,
            status: "pending",
          },
        ]);

      if (insertError) throw insertError;

      setIsSuccess(true);

      if (receiptPreview) {
        URL.revokeObjectURL(receiptPreview);
        setReceiptPreview(null);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert(
        "Error verifying payment: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="verify-payment-dashboard">
        <div className="success-card-premium">
          <div className="success-icon-large">
            <FiCheck />
          </div>
          <h1>Deposit Recorded!</h1>
          <p>
            Your payment verification has been successfully transmitted. Our
            treasury team will validate the transaction ID and update your
            status shortly.
          </p>
          <div
            style={{
              marginTop: "2.5rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <Link
              to="/dashboard"
              className="btn-premium-save"
              style={{ textDecoration: "none" }}
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-payment-dashboard">
      <header
        className="rooms-header-premium"
        style={{ marginBottom: "3rem", padding: "3rem" }}
      >
        <h1>Financial Verification</h1>
        <p>
          Document your contributions and ensure your financial status is up to
          date within the NCCF ecosystem.
        </p>
      </header>

      <div className="verify-layout-grid">
        <div className="verify-card-premium">
          <h2>Verification Form</h2>
          <form onSubmit={handleSubmit} className="premium-payment-form">
            <div className="form-row-grid">
              <div className="info-tile">
                <label>Transaction Amount (₦)</label>
                <input
                  className="admin-header-search input"
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    color: "var(--text-primary)",
                  }}
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="info-tile">
                <label>Category</label>
                <select
                  aria-label="Category"
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    background: "#1a1a1a",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                >
                  <option value="download">Download</option>
                  <option value="skill_acquisition">Skill Acquisition</option>
                  <option value="project_contribution">
                    Project Contribution
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="info-tile">
              <label>Electronic Reference / Transaction ID</label>
              <input
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  color: "var(--text-primary)",
                }}
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleInputChange}
                placeholder="Unique identifier from your receipt"
                required
              />
            </div>
            <div className="info-tile">
              <label>description</label>
              <input
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  color: "var(--text-primary)",
                }}
                type="text"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Description of the payment"
                required
              />
            </div>

            <div className="info-tile">
              <label>Proof of Deposit (Receipt Image/PDF)</label>
              <label className="payment-upload-zone">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  hidden
                />
                {receiptPreview ? (
                  <div className="preview-receipt-wrapper">
                    <img src={receiptPreview} alt="Receipt preview" />
                    <div className="change-receipt-btn">
                      <FiCamera /> Change Document
                    </div>
                  </div>
                ) : (
                  <div className="upload-prompt">
                    <FiUpload
                      style={{
                        fontSize: "2.5rem",
                        marginBottom: "1rem",
                        color: "var(--text-primary)",
                      }}
                    />
                    <p style={{ fontWeight: "700", marginBottom: "0.25rem" }}>
                      Click to Select Document
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Supports JPG, PNG or PDF (Max 10MB)
                    </p>
                  </div>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="btn-premium-save"
              style={{ width: "100%" }}
            >
              {isUploading
                ? "Synchronizing with Ledger..."
                : "Submit Verification Request"}
            </button>
          </form>
        </div>

        <aside className="verify-guidelines">
          <div className="guideline-card-small">
            <h3>
              <FiInfo /> Why document payments?
            </h3>
            <p>
              Precise financial tracking allows the NCCF to maintain
              transparency and ensure your specific contributions are recognized
              for housing and activity allocations.
            </p>
          </div>

          <div className="guideline-card-small">
            <h3>
              <FiCheck /> Submission Checklist
            </h3>
            <ul className="guideline-list-premium">
              <li>
                <FiCheck />
                <span>Legible transaction date and amount.</span>
              </li>
              <li>
                <FiCheck />
                <span>Reference number matches banking record.</span>
              </li>
              <li>
                <FiCheck />
                <span>Document is not truncated or blurry.</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VerifyPayment;
