import React from "react";
import {
  Accordion,
  Card,
  Form,
  Button,
  Image,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import "./Entrepreneur.css";

const EntrepreneurProfile = () => {
  const profileData = {
    imageurl : "/public/images/person1.png",
    name: "Meena Sharma",
    email: "meena@example.com",
    phone: "9876543210",
    linkedIn: "https://linkedin.com/in/meena",
    education: "MBA, IIM Bangalore",
    experience: "5 years in product management and startup operations.",
    bio: "Passionate entrepreneur building solutions for rural commerce.",
    startupName: "RuralConnect",
    industry: "Rural",
    stage: "MVP",
    description: "Connecting rural artisans with online markets.",
    vision: "Empowering rural communities through tech and trade.",
    website: "https://ruralconnect.in",
    teamSize: 12,
    fundingGoal: "5000000",
    investmentType: ["Equity", "Mentorship"],
    raisedSoFar: "1500000",
    useOfFunds: "Team hiring, product development, and marketing.",
    pitchDeckLink: "https://drive.com/deck",
    videoPitch: "https://youtube.com/videopitch",
    startupstatus:"pending"
  };

  return (
    <div className="container mt-5 mb-5">
      <Card className="p-4 shadow-lg">
        <div className="text-center mb-4">
          <Image
            src={profileData.imageurl}
            roundedCircle
            className="profile-img mb-3"
          />
          <h3>{profileData.name}</h3>
          <p className="text-muted mb-1">{profileData.email}</p>
          <p className="text-muted">{profileData.phone}</p>
          {/* <Button className="custom-btn" disabled>My Profile</Button> */}
        </div>

        <Accordion defaultActiveKey="0" className="custom-accordion">

          {/* Personal Info */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>Personal Info</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>LinkedIn</Form.Label>
                    <Form.Control
                       type="url"
                       name="linkedIn"
                      defaultValue={profileData.linkedIn}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Education</Form.Label>
                    <Form.Control
            type="text"
            name="education"
            value={profileData.education}
            disabled
          />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
            as="textarea"
            name="experience"
            rows={2}
            value={profileData.bio}
            disabled
          />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Experience</Form.Label>
                     <Form.Control
            as="textarea"
            name="experience"
            rows={2}
            value={profileData.experience}
            disabled
          />
                  </Form.Group>
                </Col>
                 <Row className="mt-3">
  <Col md={4} className="mx-auto">
    <Button className="btn-purple w-100" type="submit">
      Update Info
    </Button>
  </Col>
</Row>

              </Row>
            </Accordion.Body>
          </Accordion.Item>

          {/* Startup Info */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>Startup Info</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Startup Name</Form.Label>
                    <Form.Control
            type="text"
            name="experience"
            rows={2}
            value={profileData.startupName}
            disabled
          />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Industry</Form.Label>
                    <Form.Control
           type="text"
            name="experience"
            rows={2}
            value={profileData.industry}
            disabled
          />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Stage</Form.Label>
                     <Form.Control
            type="text"
            name="experience"
            rows={2}
            value={profileData.experience}
            disabled
          />
                  </Form.Group>

                   <Form.Group className="mb-3">
                    <Form.Label>Startup Status From Admin</Form.Label>
                     <Form.Control
            type="text"
            name="experience"
            rows={2}
            value={profileData.startupstatus}
            disabled
          />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                   <Form.Control
            type="text"
            name="education"
            value={profileData.description}
            disabled
          />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Vision</Form.Label>
                     <Form.Control
            type="textarea"
            rows={2}
            name="vision"
            value={profileData.vision}
            disabled
          />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
            type="url"
            name="website"
            value={profileData.website}
            disabled
          />
                  </Form.Group>
                </Col>
                <Row className="mt-3">
  <Col md={4} className="mx-auto">
    <Button className="btn-purple w-100" type="submit">
      Update Info
    </Button>
  </Col>
</Row>

              </Row>
            </Accordion.Body>
          </Accordion.Item>

          {/* Funding Info */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>Funding Info</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Funding Goal (₹)</Form.Label>
                    <Form.Control
            type="text"
            name="fudingGoal"
            value={profileData.fundingGoal}
            disabled
          />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Investment Types</Form.Label>
                    <div>
                      {profileData.investmentType.map((type, idx) => (
                        <Badge key={idx} bg="secondary" className="me-2 p-2">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Raised So Far (₹)</Form.Label>
                     <Form.Control
            type="number"
            name="raisedSoFar"
            value={profileData.raisedSoFar}
            disabled
          />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Use of Funds</Form.Label>
                     <Form.Control
            type="textarea"
            rows={2}
            name="useOfFunds"
            value={profileData.useOfFunds}
            disabled
          />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pitch Deck</Form.Label>
                     <Form.Control
            type="url"
            name="pitchLink"
            value={profileData.pitchDeckLink}
            disabled
          />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Video Pitch</Form.Label>
                     <Form.Control
            type="url"
            name="videoPitch"
            value={profileData.videoPitch}
            disabled
          />
                  </Form.Group>
                </Col>
               <Row className="mt-3">
  <Col md={4} className="mx-auto">
    <Button className="btn-purple w-100" type="submit">
      Update Info
    </Button>
  </Col>
</Row>

              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
    </div>
  );
};

export default EntrepreneurProfile;
