import { Modal, Text, EntityThumbnail, Entity, EntityField, Spacer, Toggle, Button } from 'nextjs-components'

import styles from './Header.module.scss';
import { IconBike, IconBus, IconCurrentLocation, IconMoon, IconSettings, IconSun, IconWorld } from '@tabler/icons-react';
import { useState } from 'react';
import Image from 'next/image';
import { useSettings } from '@components/Providers/SettingsProvider';


const SettingsToggle = () => {
  const { settings, setSettings } = useSettings()
  return (
    <>
      <Entity
        thumbnail={
          <>
            <EntityThumbnail size={24}>
              {settings.mapMode == 'light' ? <IconSun size={21} style={{ marginLeft: '15px' }} /> : settings.mapMode == 'dark' ? <IconMoon size={21} style={{ marginLeft: '15px' }} /> : <IconWorld size={21} style={{ marginLeft: '15px' }} />}
            </EntityThumbnail>
          </>
        }
      >
        <EntityField title="Mode" description={"Toggle between light and dark mode"} />
        <EntityField right description=<><IconSun
          size={21}
          style={{ marginLeft: '15px' }}
          color={settings.mapMode === 'light' ? 'green' : 'black'}
          onClick={() => setSettings({ ...settings, mapMode: 'light' })}
        />
          <IconMoon
            size={21}
            style={{ marginLeft: '15px' }}
            color={settings.mapMode === 'dark' ? 'green' : 'black'}
            onClick={() => setSettings({ ...settings, mapMode: 'dark' })}
          />
          <IconWorld
            size={21}
            style={{ marginLeft: '15px' }}
            color={settings.mapMode === 'world' ? 'green' : 'black'}
            onClick={() => setSettings({ ...settings, mapMode: 'world' })}
          /></> />
      </Entity>


      <Spacer />
      <Entity
        //placeholder={!isMounted}
        thumbnail={
          <>
            <EntityThumbnail size={24}>
              <Toggle checked={settings.microMobilityMode} onChange={(value) => setSettings({ ...settings, microMobilityMode: value })} />
              <IconBike size={21} style={{ marginLeft: '15px' }} />
            </EntityThumbnail>
          </>
        }
      >
        <EntityField title="Bike" description={"View rental bikes info"} />
        <EntityField right description=<><Image src={"/leaflet/images/bolt.png"} alt="Bolt Logo" width={20} height={20} style={{ filter: settings.microMobilityMode.bolt ? 'none' : 'grayscale(100%)' }} onClick={() => setSettings({ ...settings, microMobilityMode: { ...settings.microMobilityMode, bolt: !settings.microMobilityMode.bolt } })} /><Image src={"/leaflet/images/dott.png"} alt="Dott Logo" width={20} height={20} className={styles.logo} style={{ filter: settings.microMobilityMode.dott ? 'none' : 'grayscale(100%)' }} onClick={() => setSettings({ ...settings, microMobilityMode: { ...settings.microMobilityMode, dott: !settings.microMobilityMode.dott } })} /><Image src={"/leaflet/images/Donkey.png"} alt="Donkey Logo" width={20} height={20} className={styles.logo} style={{ filter: settings.microMobilityMode.donkey ? 'none' : 'grayscale(100%)' }} onClick={() => setSettings({ ...settings, microMobilityMode: { ...settings.microMobilityMode, donkey: !settings.microMobilityMode.donkey } })} /><Image src={"/leaflet/images/bluebikelogo.png"} alt="Blue Bike Logo" width={20} height={20} className={styles.logo} style={{ filter: settings.microMobilityMode.bluebike ? 'none' : 'grayscale(100%)' }} onClick={() => setSettings({ ...settings, microMobilityMode: { ...settings.microMobilityMode, bluebike: !settings.microMobilityMode.bluebike } })} /></> />
      </Entity>

      <Spacer />

      <Entity
        //placeholder={!isMounted}
        thumbnail={
          <>
            <EntityThumbnail size={24}>
              <Toggle checked={settings.publicTransit} onChange={(value) => setSettings({ ...settings, publicTransit: value })} />
              <IconBus size={21} style={{ marginLeft: '15px' }} />
            </EntityThumbnail>
          </>
        }
      >
        <EntityField title="Public Transit" description={"View public transit info"} />
        <EntityField right description=<><Image alt={"nmbs"} src={"/leaflet/images/nmbs.jpeg"} width={20} height={20} style={{ filter: settings.publicTransit.nmbs ? 'none' : 'grayscale(100%)' }} onClick={() => setSettings({ ...settings, publicTransit: { ...settings.publicTransit, nmbs: !settings.publicTransit.nmbs } })} /><Image alt={"de_lijn"} src={"/leaflet/images/delijn.jpeg"} width={20} height={20} className={styles.logo} style={{ filter: settings.publicTransit.delijn ? 'none' : 'grayscale(100%)' }} onClick={() => setSettings({ ...settings, publicTransit: { ...settings.publicTransit, delijn: !settings.publicTransit.delijn } })} /><Image alt={"flibco"} src={"/leaflet/images/flibco.png"} width={20} height={20} className={styles.logo} style={{ filter: settings.publicTransit.flibco ? 'none' : 'grayscale(100%)' }} onClick={() => setSettings({ ...settings, publicTransit: { ...settings.publicTransit, flibco: !settings.publicTransit.flibco } })} /><Image alt={"flixbus"} src={"/leaflet/images/flixbus.png"} width={20} height={20} className={styles.logo} style={{ filter: settings.publicTransit.flixbus ? 'none' : 'grayscale(100%)' }} onClick={() => setSettings({ ...settings, publicTransit: { ...settings.publicTransit, flixbus: !settings.publicTransit.flixbus } })} /><Image alt={"eurolines"} src={"/leaflet/images/eurolines.png"} width={20} height={20} className={styles.logo} style={{ filter: settings.publicTransit.eurolines ? 'none' : 'grayscale(100%)' }} onClick={() => setSettings({ ...settings, publicTransit: { ...settings.publicTransit, eurolines: !settings.publicTransit.eurolines } })} /></> />
      </Entity>

    </>
  );
};

const SettingsModal = ({ active, setActive }) => {
  return (
    <Modal.Modal active={active} onClickOutside={() => setActive(false)}>
      <Modal.Body>
        <Modal.Header>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Text size={16} style={{ margin: "10px" }}>
          Click on the logos to toggle the display of data
        </Text>
        <SettingsToggle />
      </Modal.Body>
    </Modal.Modal>
  )
}

const Header = () => {
  const [active, setActive] = useState(false)
  const { setSettings } = useSettings()
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("position", position)
        const location = {
          long: position.coords.longitude,
          lat: position.coords.latitude,
        };
        setSettings((prevSettings) => ({
          ...prevSettings,
          userLocation: location,
        }));
      }, (error) => {
        console.error('Error getting user location:', error);
      });
    } else {
      console.error('Geolocation is not supported by your browser.');
    }
  }
  return (
    <header className={styles.header}>
      <SettingsModal active={active} setActive={setActive} />
      {/* <HeaderContainer className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Link href="/">
            Ghent rental bike visualisation
          </Link>
        </p>
        <IconSettings color='white' size={21} onClick={()=>setActive(true)}/>
      </HeaderContainer> */}
      <Button shape="square" size="large">
        <IconSettings color='white' size={21} onClick={() => setActive(true)} />
      </Button>
      {/* TODO: FIX or remove
      
      <Button style={{marginTop: '10px'}} shape="square" size="large" onClick={handleGetLocation}>
        <IconCurrentLocation  color='white' size={21} />
      </Button> */}
    </header>
  );
};

export default Header;
