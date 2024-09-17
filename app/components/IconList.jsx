import {FaFacebook, FaInstagram, FaTiktok} from 'react-icons/fa'; // Import icons from react-icons
export default function IconList() {
  return (
    <div>
      <div className="flex justify-center space-x-4 mt-4">
        <a
          href="https://www.facebook.com/profile.php?id=100077670514447&ref=pages_you_manage"
          className="text-current hover:opacity-75"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook size={24} color="black" />
        </a>
        <a
          href="https://www.instagram.com/be.deesse/"
          className="text-current hover:opacity-75"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={24} color="black" />
        </a>
        <a
          href="https://www.tiktok.com/@be.deesse"
          className="text-current hover:opacity-75"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTiktok size={24} color="black" />
        </a>
      </div>
      <p className="flex justify-center space-x-4 mt-4">
        {' '}
        Copyright © 2024 déesse collection. All rights reserved.
      </p>
    </div>
  );
}
