// Footer with project link and retention notice.
import { useEffect } from 'react';

// Footer component with repository link and retention message.
const Footer = () => {
  useEffect(() => {
    const repoUrl = window.__CONFIG__?.REPO_URL || '/';
    document.getElementById('repo_url').href = repoUrl;
  }, []);

  const maxAgeHours = Number(window.__CONFIG__?.PASTE_MAX_AGE_HOURS) || 24;
  const retentionLabel = maxAgeHours === 1 ? '1 hour' : `${maxAgeHours} hours`;

  return (
    <footer>
      <p>All pastes are deleted after {retentionLabel}</p>
      <p>Find the source for this project <a id="repo_url" href="#">on GitHub</a></p>
    </footer>
  );
};

export default Footer;
