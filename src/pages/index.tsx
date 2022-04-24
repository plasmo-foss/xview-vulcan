import styled from "@emotion/styled"
import type { NextPage } from "next"

const Heading = styled.h1`
  color: ${(p) => p.theme.colors.primary};

  transition: 0.2s ease-in-out;
  &:hover {
    color: ${(p) => p.theme.colors.secondary};
    transform: scale(1.1) translateY(-2px);
  }
`

const MainContainer = styled.main`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Home: NextPage = () => {
  return (
    <MainContainer>
      <Heading>No War PLS</Heading>
    </MainContainer>
  )
}

export default Home
