import React from "react";

const GoogleMapComponent = () => {
  return (
    <div className="w-full h-auto">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125622.58154384297!2d123.74296027914063!3d10.28528201253374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99dadf0cb3aed%3A0x8464eb7a98416a00!2sTalisay%2C%20Cebu!5e0!3m2!1sen!2sph!4v1742109864666!5m2!1sen!2sph"        width="100%"
        height="520"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default GoogleMapComponent;