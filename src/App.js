import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Grid, Card } from "@mui/material";
import QRCode from "react-qr-code";

const API_URL = "https://lotterywheel-backend.onrender.com";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SchemeForm />} />
        <Route path="/participation/:schemeId" element={<ParticipationForm />} />
        <Route path="/congratulations" element={<Congratulations />} />
      </Routes>
    </Router>
  );
};

const SchemeForm = () => {
  const [schemeName, setSchemeName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schemeId = new Date().getTime(); // Unique ID
    const url = `${window.location.origin}/participation/${schemeId}`;
    setQrUrl(url); // Set the URL for QR code

    const randomTicket = Math.floor(100000 + Math.random() * 900000); // Generate random ticket number
    setTicketNumber(randomTicket);

    const schemeData = {
      schemeName,
      description,
      startDate,
      endDate,
      ticketNumber: randomTicket,
    };

    try {
      const response = await fetch(`${API_URL}/api/scheme`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schemeData),
      });
      if (!response.ok) throw new Error("Failed to save scheme data");
      console.log("Scheme data saved successfully");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 6,
        p: 2,
        backgroundColor: "#f9f9f9",
        borderRadius: 4,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center" color="primary">
        Create a Scheme
      </Typography>
      <Card variant="outlined" sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Scheme Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={schemeName}
            onChange={(e) => setSchemeName(e.target.value)}
            required
          />
          <TextField
            label="Scheme Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Generate QR Code
          </Button>
        </form>
      </Card>
      {qrUrl && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="secondary" gutterBottom>
            Scan this QR Code to participate:
          </Typography>
          <QRCode value={qrUrl} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Your Ticket Number: <strong>{ticketNumber}</strong>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const ParticipationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    ticketNo: "",
    contactNo: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/participation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save participation data");
      console.log("Participation data saved successfully");
      navigate("/congratulations");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 6,
        p: 2,
        backgroundColor: "#f9f9f9",
        borderRadius: 4,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center" color="primary">
        Participation Form
      </Typography>
      <Card variant="outlined" sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                name="firstName"
                variant="outlined"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                name="lastName"
                variant="outlined"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          <TextField
            label="Ticket Number"
            name="ticketNo"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.ticketNo}
            onChange={handleChange}
            required
          />
          <TextField
            label="Contact Number"
            name="contactNo"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.contactNo}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email Address"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Submit
          </Button>
        </form>
      </Card>
    </Box>
  );
};

const Congratulations = () => {
  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 6,
        p: 4,
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 4,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" gutterBottom color="success.main">
        🎉 Congratulations! 🎉
      </Typography>
      <Typography variant="body1">
        You have successfully participated in the scheme. Thank you!
      </Typography>
    </Box>
  );
};

export default App;
