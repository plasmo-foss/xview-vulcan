import styled from "@emotion/styled"

export const GetCoordinateButton = styled.button<{
  active?: boolean
}>`
  background: ${(p) =>
    p.active ? p.theme.colors.secondary : p.theme.colors.white};

  color: ${(p) => (p.active ? p.theme.colors.white : p.theme.colors.primary)};

  width: 44px;
  height: 44px;

  border: none;

  border-radius: 100%;
  position: absolute;
  top: 22px;
  right: 22px;

  transition: 0.2s ease-in-out;

  &:hover {
    background: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.white};
  }

  &:active {
    transform: scale(1.1);
  }
`
