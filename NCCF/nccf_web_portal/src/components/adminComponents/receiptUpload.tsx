import { FiCheck, FiX } from "react-icons/fi";
import type { FC } from "react";
interface IProps {
  receipts: any[];
  handleVerifyReceipt: (receiptId: string) => void;
  handleRejectReceipt: (receiptId: string) => void;
}

export const ReceiptUpload: FC<IProps> = ({
  receipts,
  handleVerifyReceipt,
  handleRejectReceipt,
}) => {
  return (
    <div>
      <div className="tab-pane">
        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((r) => (
                <tr key={r.id}>
                  <td className="font-bold text-primary">₦{r.amount}</td>
                  <td>{r.payment_type}</td>
                  <td>
                    <span className={`status-badge-premium ${r.status}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-table-view"
                      onClick={() => window.open(r.receipt_url)}
                    >
                      View
                    </button>
                    {r.status === "pending" && (
                      <div className="action-button-group">
                        <button
                          className="btn-table-success"
                          onClick={() => handleVerifyReceipt(r.id)}
                        >
                          <FiCheck />
                        </button>
                        <button
                          className="btn-table-danger"
                          onClick={() => handleRejectReceipt(r.id)}
                        >
                          <FiX />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
