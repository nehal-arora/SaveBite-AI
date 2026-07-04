import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "80vh",
          background: "#08131f",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <h1 style={{ fontSize: "56px", marginBottom: "20px" }}>
          SaveBite AI
        </h1>

        <p style={{ fontSize: "22px", maxWidth: "700px" }}>
          AI-powered expiry tracking, smart recipe generation, and food donation
          to reduce household food waste.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default Home;