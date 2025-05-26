import React from 'react';
import { useContext } from 'react';
import UserContext from '../UserContext'; 
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaFilm, FaStar, FaHeart, FaQuoteLeft } from 'react-icons/fa';

function HomePage() {
  // Use the context directly
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const features = [
    {
      icon: <FaFilm size={40} className="text-primary mb-3" />,
      title: "Endless Movie Universe",
      description: "Dive into a vast library of classic and trending films across every genre imaginable.",
      img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      icon: <FaStar size={40} className="text-warning mb-3" />,
      title: "Authentic Ratings & Reviews",
      description: "Read real reviews, rate your favorites, and help others discover what’s worth watching.",
      img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      icon: <FaHeart size={40} className="text-danger mb-3" />,
      title: "Curated Watchlists",
      description: "Keep track of what you love. Create personal lists for any mood or occasion.",
      img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    }
  ];
  

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section bg-dark text-white py-5">
        <Container className="py-lg-5">
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
            <h1 className="display-3 fw-bold mb-4">Discover Your Next Favorite Movie</h1>
            <p className="lead mb-4">Explore, rate, and organize films from our extensive collection</p>
              <Button 
                className="btn px-4"
                style={{ backgroundColor: "#ffbe0b", color: "#1b263b", fontWeight: "bold" }}
                size="lg" 
                onClick={() => handleNavigation(user.token ? '/movies' : '/register')}
              >
                {user.token ? 'Browse Movies' : 'Join Now'}
              </Button>
            </Col>
            <Col lg={6}>
              <img 
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Movie theater" 
                className="img-fluid rounded shadow-lg"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 display-4 fw-bold text-custom-dark">Your Go-To Destination for All Things Film
            </h2>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} xs={12} md={6} lg={4}>
                <Card className="h-100 shadow-sm border-0 overflow-hidden">
                  <div className="feature-img-container" style={{ height: '200px', overflow: 'hidden' }}>
                    <Card.Img 
                      variant="top" 
                      src={feature.img} 
                      className="img-fluid h-100 w-100 object-fit-cover"
                    />
                  </div>
                  <Card.Body className="text-center p-4">
                    {feature.icon}
                    <Card.Title className="fs-4">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonial Section */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8} className="text-center">
              <div className="mb-5">
                <FaQuoteLeft className="text-primary" size={48} />
              </div>
              <blockquote className="blockquote">
                <p className="mb-4 fs-4 text-custom-dark">This movie catalog helped me discover so many hidden gems I would have never found otherwise. The community reviews are incredibly helpful!</p>
                <footer className="blockquote-footer mt-3">Michael Chen, <cite>Film Buff</cite></footer>
              </blockquote>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default HomePage;