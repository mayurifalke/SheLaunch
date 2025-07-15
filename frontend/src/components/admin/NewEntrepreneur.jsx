import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { Buffer } from 'buffer';
import Form from 'react-bootstrap/Form';


const columns = [
  { id: 'sr', label: 'Sr. No.', minWidth: 50 },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'startupname', label: 'Startup Name', minWidth: 150 },
  { id: 'industry', label: 'Industry', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 60 },
];

export default function NewEntrepreneur() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState(null);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Fetch entrepreneurs from API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authorization token not found.");
      return;
    }
    const fetchEntrepreneurs = async () => {
      try {
        const res = await axios.get('/api/admin/pending-entrepreneurs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data);
        setRows(res.data.pendingUsers);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch entrepreneurs');
      }
    };
    fetchEntrepreneurs();
  }, []);

  const handleView = (entrepreneur) => {
    setSelectedEntrepreneur(entrepreneur);
    setShowModal(true);
  };
  // State to manage enlarged image
const [showDocModal, setShowDocModal] = useState(false);
const [selectedDoc, setSelectedDoc] = useState(null);

const handleShowDoc = (doc) => {
  setSelectedDoc(doc);
  setShowDocModal(true);
};

const handleCloseDoc = () => {
  setShowDocModal(false);
  setSelectedDoc(null);
};


 const handleApprove = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `/api/admin/verify-entrepreneur/${selectedEntrepreneur._id}`,
      { status: "Approved" }, // ✅ send status explicitly
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("Entrepreneur approved successfully");

    setShowModal(false);
    // Remove approved user from pending list immediately
    setRows(rows.filter(u => u._id !== selectedEntrepreneur._id));
  } catch (err) {
    console.error(err);
    toast.error("Failed to approve entrepreneur");
  }
};


  const [openDocs, setOpenDocs] = useState({});

  const toggleDocView = (key) => {
    setOpenDocs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderDocumentSection = (label, fileObj, key) => (
    <div className="mb-3">
      <Form.Label className="fw-bold">{label}:</Form.Label>
      {fileObj && fileObj.data ? (
        <>
          <Button variant="outline-primary" size="sm" onClick={() => toggleDocView(key)}>
            {openDocs[key] ? "Hide" : "View"} {label}
          </Button>
          {openDocs[key] && (
            <object
              data={`data:${fileObj.contentType};base64,${Buffer.from(fileObj.data).toString("base64")}`}
              type={fileObj.contentType}
              width="100%"
              height="400px"
              className="mt-2"
            >
              <a
                href={`data:${fileObj.contentType};base64,${Buffer.from(fileObj.data).toString("base64")}`}
                download={key}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download {label}
              </a>
            </object>
          )}
        </>
      ) : (
        <p className="text-muted">No {label} uploaded.</p>
      )}
    </div>);

    const [showRejectModal, setShowRejectModal] = useState(false);
const [rejectionReason, setRejectionReason] = useState("");
const handleDisapprove = () => {
  setShowModal(false); // close main modal
  setShowRejectModal(true); // open rejection reason modal
};
const submitDisapprove = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `/api/admin/verify-entrepreneur/${selectedEntrepreneur._id}`,
      { status: "Rejected", rejectionReason }, // ✅ send rejection reason
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("Entrepreneur disapproved successfully");
    setShowRejectModal(false);
    setRows(rows.filter(u => u._id !== selectedEntrepreneur._id));
    setRejectionReason(""); // reset input
  } catch (err) {
    console.error(err);
    toast.error("Failed to disapprove entrepreneur");
  }
};


  return (
    <div className="container mt-5">
      <h4 className="p-3 mb-1">New Entrepreneurs List</h4>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeButton />

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 550 }}>
          <Table stickyHeader aria-label="Entrepreneurs table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow hover key={row._id}>
                  {columns.map((column) => {
                    if (column.id === 'sr') {
                      return (
                        <TableCell key="sr" align="left">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                      );
                    } else if (column.id === 'action') {
                      return (
                        <TableCell key="action" align="left">
                         <button
  onClick={() => handleView(row)}
  style={{
    background: "linear-gradient(45deg, #1c5b17ff, #1bc30cff)",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  }}
>
   View
</button>


                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={column.id} align={column.align || 'left'}>
                          {row[column.id]}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25]}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
          sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 2 }}
        />
      </Paper>

      {/* Modal for viewing entrepreneur details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable>
     <Modal.Header closeButton closeVariant="white" className="bg-dark text-white">
  <Modal.Title>Entrepreneur Details</Modal.Title>
</Modal.Header>

      <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
        {selectedEntrepreneur ? (
          <Form>
            {[
              ["Name", "name"],
              ["Email", "email"],
              ["Contact No", "contactno"],
              ["Education", "education"],
              ["LinkedIn", "linkdinurl"],
              ["Experience", "experience"],
              ["Bio", "bio"],
              ["Startup Name", "startupname"],
              ["Industry", "industry"],
              ["Vision", "vision"],
              ["Description", "description"],
              ["Website", "websiteurl"],
              ["Funding Goal", "fundinggoal"],
              ["Raised Funds", "raisedfunds"],
              ["Use of Funds", "useoffunds"],
              ["Pitch Deck URL", "pitchdeckurl"],
              ["Video URL", "videourl"],
              ["Status", "status"],
            ].map(([label, field]) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label className="fw-bold">{label}:</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value={selectedEntrepreneur[field] || "N/A"}
                  className="bg-light"
                />
              </Form.Group>
            ))}

            <hr />
            <h5 className="mb-3 text-bold fw-bold">Documents</h5>

            {renderDocumentSection("Business License", selectedEntrepreneur.businessLicense, "businessLicense")}
            {renderDocumentSection("Aadhaar/PAN", selectedEntrepreneur.aadhaarPan, "aadhaarPan")}
            {renderDocumentSection("Startup Certificate", selectedEntrepreneur.startupCertificate, "startupCertificate")}
          </Form>
        ) : (
          <p>Loading details...</p>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button variant="success" onClick={handleApprove}>
  Approve
</Button>
<Button variant="danger" onClick={handleDisapprove}>
  Disapprove
</Button>

      </Modal.Footer>
    </Modal>

    {/* Modal for disapprove modal */}
    <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Disapprove Entrepreneur</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="mb-3">
      <label htmlFor="rejectionReason" className="form-label fw-bold">
        Reason for Rejection:
      </label>
      <input
        type="text"
        className="form-control"
        id="rejectionReason"
        value={rejectionReason}
        onChange={(e) => setRejectionReason(e.target.value)}
        placeholder="Enter reason for rejection"
      />
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={submitDisapprove}>
      Disapprove
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}
