import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchLandlord = async () => {
      const res = await fetch(`/api/user/${listing.userRef}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setLandlord(data);
    };
    fetchLandlord();
  }, [listing.userRef]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p className="">
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleChange}
            placeholder="Enter you message here..."
            className="w-full border p-3 rounded-lg "
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${landlord.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 "
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;
