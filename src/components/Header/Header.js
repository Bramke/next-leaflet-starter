import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { MenuWrapper, MenuButton, Menu, MenuItem, Modal, Text, EntityThumbnail, Entity, EntityField, Spacer, Toggle} from 'nextjs-components'

import HeaderContainer from '@components/HeaderContainer';

import styles from './Header.module.scss';
import { IconBike, IconBus, IconSettings } from '@tabler/icons-react';
import { useState } from 'react';
import Image from 'next/image';
import { useSettings } from '@components/Providers/SettingsProvider';

const SettingsToggle = () => {
  const { settings, setSettings } = useSettings()
  // ex settings: { microMobilityMode: true, publicTransit: true };
  return (
    <>
      <Entity
        //placeholder={!isMounted}
        thumbnail={
          <>
          <EntityThumbnail size={24}>
            <Toggle checked={settings.microMobilityMode} onChange={(value) => setSettings({ ...settings, microMobilityMode: value })}/>
            <IconBike size={21} style={{marginLeft: '15px'}}/>
          </EntityThumbnail>
          </>
        }
      >
        <EntityField title="Bike" description={"View rental bikes info"} />
        <EntityField right description=<><Image src={"/leaflet/images/bolt.png"} width={20} height={20}/><Image src={"/leaflet/images/dott.png"} width={20} height={20} className={styles.logo}/><Image src={"/leaflet/images/Donkey.png"} width={20} height={20} className={styles.logo}/><Image src={"/leaflet/images/bluebikelogo.png"} width={20} height={20} className={styles.logo}/></> />
      </Entity>

      <Spacer />

      <Entity
        //placeholder={!isMounted}
        thumbnail={
          <>
          <EntityThumbnail size={24}>
            <Toggle checked={settings.publicTransit} onChange={(value) => setSettings({ ...settings, publicTransit: value })}/>
            <IconBus size={21} style={{marginLeft: '15px'}}/>
          </EntityThumbnail>
          </>
        }
      >
        <EntityField title="Public Transit" description={"View public transit info"} />
        <EntityField right description=<><img alt={"delijnlogo"} src={"/leaflet/images/De_lijn.png"} width={20} height={20}/></> />
      </Entity>

    </>
  );
};

const SettingsModal = ({active, setActive}) => {
  return(
    <Modal.Modal active={active} onClickOutside={() => setActive(false)}>
        <Modal.Body>
          <Modal.Header>
            <Modal.Title>Settings</Modal.Title>
          </Modal.Header>
          <Text size={16} style={{margin: "10px"}}>Adjust display preferences using the toggles below.</Text>
          <SettingsToggle />
        </Modal.Body>
      </Modal.Modal>
  )
}

const Header = () => {
  const [active, setActive] = useState(false)
  return (
    <header className={styles.header}>
    <SettingsModal active={active} setActive={setActive} />
      <HeaderContainer className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Link href="/">
            Ghent rental bike visualisation
          </Link>
        </p>
        <IconSettings color='white' size={21} onClick={()=>setActive(true)}/>
      </HeaderContainer>
    </header>
  );
};

export default Header;
