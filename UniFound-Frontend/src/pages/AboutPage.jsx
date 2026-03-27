import Navbar from "../components/Navbar.jsx";

export default function AboutPage() {
  return (
    <div className="w-full pt-28 px-6 pb-16 bg-gray-50 min-h-screen flex flex-col gap-16">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto p-8 bg-white/30 backdrop-blur-xl rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-12">
        {/* Text */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            About UniFound
          </h1>
          <p className="text-gray-700 mb-4 text-lg md:text-xl leading-relaxed">
            UniFound is a smart campus solution designed to help students report, track, 
            and recover lost or found items quickly and efficiently. Our platform is secure, 
            AI-powered, and student-friendly.
          </p>
          <p className="text-gray-700 mb-4 text-lg md:text-xl leading-relaxed">
            Our mission is to reduce the hassle of lost items, foster a community of honesty, 
            and provide a reliable way for students to recover their belongings.
          </p>
        </div>

        {/* Image */}
        <div className="flex-1">
          <img
            src="/about-hero.png"
            alt="About UniFound"
            className="w-full h-auto rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          Our Team
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Team Member */}
          {[
            { name: "Rashmini Kavindya", role: "Frontend Developer", img: "/team1.png" },
            { name: "Minuri Sewmini", role: "Backend Developer", img: "/team2.png" },
            { name: "Rashan Fernando", role: "UI/UX Designer", img: "/team3.png" },
            { name: "Supun Perera", role: "Project Manager", img: "/team4.png" },
          ].map((member, idx) => (
            <div
              key={idx}
              className="bg-white/50 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-gray-100 text-center flex flex-col items-center gap-3 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover border-2 border-white shadow-md"
              />
              <h3 className="text-gray-900 font-semibold text-lg">{member.name}</h3>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto p-12 bg-blue-50/70 backdrop-blur-xl rounded-3xl shadow-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          To create a trustworthy and smart environment for students to manage their lost 
          and found items, improving campus life and fostering honesty and community 
          collaboration.
        </p>
      </section>
    </div>
  );
}