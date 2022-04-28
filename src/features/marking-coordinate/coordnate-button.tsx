import styled from "@emotion/styled"

import { ActionButton } from "~features/layouts/action-button"

export const MarkCoordinateButton = ActionButton

export const SendCoordinateButton = styled(ActionButton)`
  background: ${(p) =>
    p.disabled ? p.theme.colors.gray : p.theme.colors.darkPrimary};
  color: ${(p) => p.theme.colors.white};

  &:hover {
    background: ${(p) =>
      p.disabled ? p.theme.colors.gray : p.theme.colors.subtleGray};
  }
`
