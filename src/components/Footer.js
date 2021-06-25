import {memo} from 'react';
import {Twitter, GitHub, Instagram, Database, Mail, Send} from 'react-feather';
import {useTranslation} from 'react-i18next';

function Footer() {
  const {t} = useTranslation();

  return (
    <footer>
      <div className="link">
        <a
          href="https://github.com/19dungnd"
          target="_blank"
          rel="noopener noreferrer"
        >
          19dungnd
        </a>
      </div>

      <h5>{t('We stand with everyone fighting on the frontlines')}</h5>

      <div className="links">
        <a
          href="https://github.com/19dungnd/19dungnd-react"
          className="github"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHub />
        </a>

        <a
          className="api"
          href="https://api.19dungnd.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Database />
        </a>

        <a
          href="https://t.me/19dungndorg"
          className="telegram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Send />
        </a>

        <a
          href="https://twitter.com/19dungndorg"
          target="_blank"
          rel="noopener noreferrer"
          className="twitter"
        >
          <Twitter />
        </a>

        <a
          href="https://instagram.com/19dungndorg"
          target="_blank"
          rel="noopener noreferrer"
          className="instagram"
        >
          <Instagram />
        </a>

        <a
          href="mailto:hello@19dungnd.org"
          className="mail"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Mail />
        </a>
      </div>
    </footer>
  );
}

export default memo(Footer);
