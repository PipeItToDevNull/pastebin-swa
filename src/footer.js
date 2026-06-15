// Footer with project link and retention notice.
import React, { useEffect } from 'react';

const Footer = () => {
  useEffect(() => {
    const repoUrl = import.meta.env.VITE_REPO_URL || '/';
    document.getElementById('repo_url').href = repoUrl;
  }, []);

  return (
    <footer>
      <p>All pastes are deleted after 24 hours</p>
      <p>Find the source for this project <a id="repo_url" href="#">on GitHub</a></p>
    </footer>
  );
};

export default Footer;
