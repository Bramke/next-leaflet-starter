import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { MenuWrapper, MenuButton, Menu, MenuItem } from 'nextjs-components'

import HeaderContainer from '@components/HeaderContainer';

import styles from './Header.module.scss';
import { IconSettings } from '@tabler/icons-react';

const SettingsMenu = () => {
  return(
    <MenuWrapper>
  <MenuButton variant="unstyled">
    <IconSettings size={20} color='white' /><p>LOL</p>
  </MenuButton>
  <Menu width={200}>
    <MenuItem>One</MenuItem>
    <MenuItem>Two</MenuItem>
    <MenuItem>Three</MenuItem>
  </Menu>
</MenuWrapper>
  )
}

const Header = () => {
  return (
    <header className={styles.header}>
      <HeaderContainer className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Link href="/">
            Ghent rental bike visualisation
          </Link>
        </p>

          <SettingsMenu />
      </HeaderContainer>
    </header>
  );
};

export default Header;
