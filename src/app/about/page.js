export const metadata = { title: "About · Sporty" };

// Add a photo by putting the file in /public/team and setting img, e.g. img: "/team/sokcheat.jpg".
// Without a photo, the person's initials are shown instead.
const mentor = { name: "Srorng Sokcheat", role: "Mentor", img: "" };

const members = [
  { name: "Puthy Lyhong", role: "Member", img: "" },
  { name: "Hor Kimchheng", role: "Member", img: "" },
  { name: "Kao Sengheang", role: "Member", img: "" },
  { name: "Borey Sothearith", role: "Member", img: "" },
  { name: "Dy Chhean", role: "Member", img: "" },
  { name: "Eam Sambath", role: "Member", img: "" },
];

const initialsOf = (name) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

function Person({ name, role, img, className = "" }) {
  return (
    <div className={`card person-card ${className}`}>
      <div className="photo">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={name} loading="lazy" />
        ) : (
          <span className="initials" aria-hidden="true">{initialsOf(name)}</span>
        )}
      </div>
      <div className="body">
        <h3>{name}</h3>
        <span className="tag">{role}</span>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <section className="wrap page">
      <p className="kicker">About Us</p>
      <h1>
        The team behind <em>Sporty</em>
      </h1>
      <p className="lead">
        Sporty is built by a small team as part of our coursework project,
        guided by our mentor.
      </p>

      <h2 className="about-section">Mentor</h2>
      <div className="grid team-grid">
        <Person {...mentor} className="mentor-card" />
      </div>

      <h2 className="about-section">Members</h2>
      <div className="grid team-grid">
        {members.map((m) => (
          <Person key={m.name} {...m} />
        ))}
      </div>
    </section>
  );
}
