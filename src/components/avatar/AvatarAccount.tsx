import { Avatar } from "@mui/material";
import { AVATARS } from "./Avatar";
import { CSSProperties } from "react";

interface Props {
  avatar: string;
  size?: number;
  style?: CSSProperties;
}

export const AvatarAccount = ({ avatar, size, style }: Props) => {
  const DEFAULT_SIZE = 30;

  const image = isNaN(Number(avatar)) ? avatar : AVATARS[Number(avatar)];
  return (
    <Avatar
      alt="Avatar"
      src={image}
      sx={{
        width: size ? size : DEFAULT_SIZE,
        height: size ? size : DEFAULT_SIZE,
      }}
      style={style}
    />
  );
};
