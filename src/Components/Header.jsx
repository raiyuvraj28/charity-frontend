// import React from "react";

// function Header() {
//   return (
//     <header className="site-header">
//       <div className="container">
//         <div className="row">

//           {/* Left Section */}
//           <div className="col-lg-8 col-12 d-flex flex-wrap fixed">
//             <p className="d-flex me-4 mb-0">
//               <i className="bi-geo-alt me-2"></i>
//               Akershusstranda 20, 0150 Oslo, Norway
//             </p>

//             <p className="d-flex mb-0">
//               <i className="bi-envelope me-2"></i>
//               <a href="mailto:info@company.com">
//                 info@company.com
//               </a>
//             </p>
//           </div>

//           {/* Right Section (Social Icons) */}
//           <div className="col-lg-3 col-12 ms-auto d-lg-block d-none">
//             <ul className="social-icon">
//               <li className="social-icon-item">
//                 <a href="#" className="social-icon-link bi-twitter"></a>
//               </li>
//               <li className="social-icon-item">
//                 <a href="#" className="social-icon-link bi-facebook"></a>
//               </li>
//               <li className="social-icon-item">
//                 <a href="#" className="social-icon-link bi-instagram"></a>
//               </li>
//               <li className="social-icon-item">
//                 <a href="#" className="social-icon-link bi-youtube"></a>
//               </li>
//               <li className="social-icon-item">
//                 <a href="#" className="social-icon-link bi-whatsapp"></a>
//               </li>
//             </ul>
//           </div>

//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;
function TopBar() {
  return (
    <div className="top-bar bg-success text-white py-2">
      <div className="container d-flex justify-content-between">
        <small>📍 Karimpur, Punjab</small>
        <small>📞 +91 9876543210</small>
      </div>
    </div>
  );
}

export default TopBar;