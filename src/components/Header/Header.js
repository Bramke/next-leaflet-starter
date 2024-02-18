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
        <EntityField right description=<><Image src={"/leaflet/images/bolt.png"} alt="Bolt Logo" width={20} height={20}/><Image src={"/leaflet/images/dott.png"} alt="Dott Logo" width={20} height={20} className={styles.logo}/><Image src={"/leaflet/images/Donkey.png"} alt="Donkey Logo" width={20} height={20} className={styles.logo}/><Image src={"/leaflet/images/bluebikelogo.png"} alt="Blue Bike Logo" width={20} height={20} className={styles.logo}/></> />
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
        <EntityField right description=<><Image alt={"nmbs"} src={"/leaflet/images/nmbs.jpeg"} width={20} height={20}/><Image alt={"de_lijn"} src={"/leaflet/images/de_lijn.png"} width={20} height={20} className={styles.logo}/><Image alt={"flibco"} src={"/leaflet/images/flibco.png"} width={20} height={20} className={styles.logo}/><Image alt={"flixbus"} src={"/leaflet/images/flixbus.png"} width={20} height={20} className={styles.logo}/><Image alt={"eurolines"} src={"/leaflet/images/eurolines.png"} width={20} height={20} className={styles.logo}/></> />
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
