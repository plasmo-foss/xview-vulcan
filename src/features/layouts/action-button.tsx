import styled from "@emotion/styled"
import { rgba } from "polished"

export const ActionButton = styled.button<{
  active?: boolean
}>`
  background: ${(p) =>
    p.active ? p.theme.colors.secondary : p.theme.colors.white};

  color: ${(p) => (p.active ? p.theme.colors.white : p.theme.colors.primary)};

  width: 44px;
  height: 44px;

  border: none;

  border-radius: 100%;

  transition: 0.2s ease-in-out;

  &:hover {
    background: ${(p) =>
      p.active ? p.theme.colors.primary : rgba(p.theme.colors.gray, 0.8)};
    color: ${(p) => p.theme.colors.white};
  }

  &:active {
    transform: scale(1.1);
  }
`

export const PrimaryButton = styled(ActionButton)`
  background: ${(p) =>
    p.disabled ? p.theme.colors.gray : p.theme.colors.darkPrimary};
  color: ${(p) => p.theme.colors.white};

  &:hover {
    background: ${(p) =>
      p.disabled ? p.theme.colors.gray : p.theme.colors.subtleGray};
  }
`
