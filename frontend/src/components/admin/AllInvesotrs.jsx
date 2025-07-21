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
  { id: 'company', label: 'Company Name', minWidth: 150 },
  { id: 'categories', label: 'Industry Type', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 60 },
];

export default function AllInvesotrs() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
   const [showModal2, setShowModal2] = useState(false);
  // const [selectedEntrepreneur, setSelectedEntrepreneur] = useState(null);
  const [selectedInvestors,setSelectedInvestors] = useState(null);

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
    const fetchInvesotrs = async () => {
      try {
        const res = await axios.get('/api/admin/all-investors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(res.data);
        setRows(res.data.investors || []);
      } catch (error) {
        // console.error(error);
        setRows([]);
        toast.error('Failed to fetch Investors.');
      }
    };
    fetchInvesotrs();
  }, []);

  const handleView = (investor) => {
    setSelectedInvestors(investor);
    setShowModal(true);
    // console.log("Selected Entrepreneur:", selectedInvestors);
  };

   const handleView2 = (investor) => {
    setSelectedInvestors(investor);
    setShowModal2(true);
  };

  const handleDelete = async () => {
    if (!selectedInvestors || !selectedInvestors._id) {
      toast.error("Investor ID not found.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token not found.");
        return;
      }
  
      const res = await axios.delete(`/api/admin/delete-investor/${selectedInvestors._id}`, {
        headers: { Authorization: `Bearer ${token}`},
      });
  
      toast.success(res.data.message || "Investor deleted successfully.");
  
      // Update your state to remove the deleted entrepreneur from table immediately
      setRows(rows.filter(e => e._id !== selectedInvestors._id));
  
      // Close modal
      setShowModal2(false);
    } catch (error) {
      // console.error(error);
      toast.error("Failed to delete investor.");
    }
  };



  return (
    <div className="container mt-5">
      <h4 className="p-3 mb-1">All Investors List</h4>
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
                     style={{ minWidth: column.minWidth, fontWeight: 'bold', backgroundColor: 'rgba(184, 176, 176, 0.8)',fontSize: '0.9rem' }}
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
                        <TableCell key="action" align="left" style={{gap: '10px', display: 'flex'}}>
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
<button
  onClick={() => handleView2(row)}
  style={{
    background: "linear-gradient(45deg, #b41815ff, #ee390bff)",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  }}
>
   Delete
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
  <Modal.Title>Investors Details</Modal.Title>
</Modal.Header>

      <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
        {selectedInvestors ? (
          <Form>
            {[
              ["Name", "name"],
              ["Email", "email"],
              ["Contact No", "contactno"],
              ["Company Name", "company"],  
              ["Categories", "categories"],
              ["Min Investment", "minInvestment"],
              ["Max Investment", "maxInvestment"],
              ["Location","location"],
              ["Status", "status"]
            ].map(([label, field]) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label className="fw-bold">{label}:</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value={selectedInvestors[field] || "N/A"}
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
    </Modal>

  

{/* Modal for delete */}
<Modal show={showModal2} onHide={() => setShowModal2(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Delete Investor</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="mb-3">
      <label htmlFor="rejectionReason" className="form-label fw-bold">
       Are you sure you want to delete this investor?
      </label>
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal2(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}
