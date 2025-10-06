import React, { useEffect, useState } from "react";

const AboutUs = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5002/about")
      .then((res) => res.json())
      .then((info) => setData(info))
      .catch((err) => console.error("Error fetching about info:", err));
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>About Us</h1>
      <img
        src={data.photoUrl}
        alt={data.name}
        style={{ width: "250px", borderRadius: "50%", margin: "20px" }}
      />
      <h2>{data.name}</h2>
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "left" }}>
        {data.about.map((para, index) => (
          <p key={index} style={{ marginBottom: "20px" }}>
            {para}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
