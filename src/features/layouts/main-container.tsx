import styled from "@emotion/styled"
import Image from "next/image"
import Link from "next/link"
import { rgba } from "polished"

import packageJson from "~/../package.json"
import { useViewDamage } from "~features/view-damage/use-view-damage"

export const MainContainer = styled.main`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`

export const FooterContainer = styled.footer`
  position: absolute;
  bottom: 0;
  right: 0;

  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  gap: 4px;

  a {
    display: flex;
    justify-content: center;
    align-items: center;

    gap: 2px;
    font-size: 10px;

    height: 16px;
    padding: 2px 4px;

    color: ${(p) => p.theme.colors.white};
    background: ${(p) => rgba(p.theme.colors.gray, 0.8)};

    cursor: pointer;
    transition: 0.2s ease-in-out;

    &:hover {
      background: ${(p) => rgba(p.theme.colors.gray, 1.0)};
    }
  }
`

const currentYear = new Date().getFullYear()

export const Footer = () => (
  <FooterContainer>
    <Link href="https://www.plasmo.com">
      <a target="_blank" rel="noopener noreferrer">
        <Image src="/plasmo.png" alt="Plasmo Logo" width={12} height={12} />
        {`© ${currentYear} Plasmo - www.plasmo.com`}
      </a>
    </Link>

    <Link href="https://louisgv.github.io">
      <a target="_blank" rel="noopener noreferrer">
        <span role="img">❤️☮️🤚</span>
      </a>
    </Link>

    <Link href="https://github.com/plasmo-foss/xview-vulcan">
      <a target="_blank" rel="noopener noreferrer">
        <Image
          src="/dove-icon.png"
          alt="xView Vulcan Logo"
          width={12}
          height={12}
        />
        {`${packageJson.name}@${packageJson.version}`}
      </a>
    </Link>
  </FooterContainer>
)

const TopAttributionContainer = styled(FooterContainer)`
  top: 0px;
  bottom: auto;
`

export const TopAttribution = () => {
  const viewDamage = useViewDamage()

  return (
    <TopAttributionContainer as="header">
      {viewDamage?.damageLayer ? (
        <Link href="https://www.planet.com/">
          <a target="_blank" rel="noopener noreferrer">
            {`Imagery © ${currentYear} Planet Labs PBC`}
          </a>
        </Link>
      ) : (
        <Link href="https://deck.gl/">
          <a target="_blank" rel="noopener noreferrer">
            {`deck.gl`}
          </a>
        </Link>
      )}
      <Link href="https://www.mapbox.com/">
        <a target="_blank" rel="noopener noreferrer">
          {`© Mapbox`}
        </a>
      </Link>

      <Link href="https://www.openstreetmap.org/">
        <a target="_blank" rel="noopener noreferrer">
          {`© Open Street Map`}
        </a>
      </Link>
    </TopAttributionContainer>
  )
}
