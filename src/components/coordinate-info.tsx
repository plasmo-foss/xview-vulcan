import styled from "@emotion/styled"
import { rgba } from "polished"

export const CoordinateInfo = styled.div`
  color: ${(p) => p.theme.colors.white};
  background: ${(p) => rgba(p.theme.colors.gray, 0.4)};

  position: absolute;
  bottom: 22px;
  right: 22px;

  transition: 0.2s ease-in-out;

  text-align: right;

  padding: 4px 8px;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;

  &:hover {
    background: ${(p) => rgba(p.theme.colors.gray, 0.8)};
  }
`

export const CoordinateGroup = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;

  gap: 8px;
  transition: 0.2s ease-in-out;

  border-bottom: 1px solid ${(p) => p.theme.colors.white};
  padding: 8px 0;

  &:last-child {
    border-bottom: none;
  }
`
