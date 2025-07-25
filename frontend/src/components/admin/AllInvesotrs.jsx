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
import { Modal, Button, Form } from 'react-bootstrap';

const columns = [
  { id: 'sr', label: 'Sr. No.', minWidth: 50 },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 150 },
  { id: 'categories', label: 'Industry', minWidth: 100 },
   { id: 'status', label: 'Status', minWidth: 100},
  { id: 'action', label: 'Action', minWidth: 60 },
];

export default function AllInvestors() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch investors from API
  useEffect(() => {
    const fetchInvestors = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token not found.");
        return;
      }
      try {
        const res = await axios.get('/api/admin/all-investors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRows(res.data.investors || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch Investors.');
      }
    };
    fetchInvestors();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleView = (investor) => {
    setSelectedInvestor(investor);
    setShowViewModal(true);
  };

  const handleDelete = (investor) => {
    setSelectedInvestor(investor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedInvestor || !selectedInvestor._id) {
      toast.error("Investor ID not found.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`/api/admin/delete-investor/${selectedInvestor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Investor deleted successfully.");
      setRows(rows.filter(i => i._id !== selectedInvestor._id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete investor.");
    }
  };

  const handleDisapprove = () => {
    setShowViewModal(false);
    setShowRejectModal(true);
  };

  const submitDisapprove = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/admin/verify-investor/${selectedInvestor._id}`,
        { status: "Rejected", rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Investor disapproved successfully");
      setRows(rows.filter(i => i._id !== selectedInvestor._id));
      setRejectionReason("");
      setShowRejectModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to disapprove investor");
    }
  };

  return (
    <div className="container mt-5">
      <h4 className="p-3 mb-1">Approved Investors List</h4>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeButton />

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 550 }}>
          <Table stickyHeader aria-label="Investors table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    style={{
                      minWidth: column.minWidth,
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(184, 176, 176, 0.8)',
                      fontSize: '0.9rem'
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow hover key={row._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.categories}</TableCell>
                   <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleView(row)}
                      style={buttonStyle("#1c5b17", "#1bc30c")}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      style={buttonStyle("#b41815", "#ee390b")}
                    >
                      Delete
                    </button>
                  </TableCell>
                 
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

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered scrollable>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Investor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInvestor ? (
            <Form>
              {[
                ["Name", "name"],
                ["Email", "email"],
                ["Contact No", "contactno"],
                ["Max Investment", "maxInvestment"],
                ["Min Investment", "minInvestment"],
                ["Categories", "categories"],
                ["Status", "status"],
              ].map(([label, field]) => (
                <Form.Group className="mb-3" key={field}>
                  <Form.Label className="fw-bold">{label}:</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={selectedInvestor[field] || "N/A"}
                    className="bg-light"
                  />
                </Form.Group>
              ))}
            </Form>
          ) : (
            <p>Loading details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDisapprove}>Disapprove</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Investor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this investor?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Disapprove Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Disapprove Investor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label className="fw-bold">Reason for Rejection:</Form.Label>
            <Form.Control
              type="text"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={submitDisapprove}>Disapprove</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const buttonStyle = (color1, color2) => ({
  background: `linear-gradient(45deg, ${color1}, ${color2})`,
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  marginRight: "10px"
});
