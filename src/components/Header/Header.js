import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

import HeaderContainer from '@components/HeaderContainer';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <HeaderContainer className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Link href="/">
            Ghent rental bike visualisation
          </Link>
        </p>
         <ul className={styles.headerLinks}>
          <li>
            <a href="https://github.com/bramke" rel="noreferrer">
              <FaGithub />
            </a>
          </li>
        </ul>
      </HeaderContainer>
    </header>
  );
};

export default Header;
