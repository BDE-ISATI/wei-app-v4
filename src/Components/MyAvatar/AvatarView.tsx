import React from "react";
import {
  Stage,
  Layer,
  Rect,
  RegularPolygon,
  Circle,
  Image,
  Text,
} from "react-konva";
import { HeadShape, IAvatar } from ".";
import useImage from "use-image";
import { ReactSVG } from "react-svg";

interface Props {
  width: number;
  height: number;
  avatar: IAvatar;
}

export default function AvatarView({ width, height, avatar }: Props) {
  const headSize = height / 2;
  const [face] = useImage(
    "https://static.wikia.nocookie.net/roblox/images/3/35/Manface.png"
  );
  const [crown] = useImage(
    "https://images.emojiterra.com/google/android-12l/512px/1f451.png"
  );

  return (
    <Stage width={width} height={height}>
      <Layer>
        <Circle
          x={width / 2}
          y={height}
          width={headSize * 1.2}
          height={headSize * 1.2}
          fill="black"
        />
        {avatar.headShape === HeadShape.circle && (
          <Circle
            x={width / 2}
            y={height / 2}
            width={headSize}
            height={headSize}
            fill="red"
          />
        )}
        {avatar.headShape === HeadShape.square && (
          <Rect
            x={width / 2 - headSize / 2}
            y={height / 2 - headSize / 2}
            width={headSize}
            height={headSize}
            fill="red"
          />
        )}
        {avatar.headShape === HeadShape.triangle && (
          <RegularPolygon
            sides={3}
            radius={headSize * 1.33}
            x={width / 2}
            y={height / 2 + headSize * 0.17}
            width={headSize * 1.33}
            height={headSize * 1.33}
            fill="red"
          />
        )}
        <Image
          x={width / 2 - (headSize / 2) * 0.8}
          y={height / 2 - (headSize / 2) * 0.6}
          width={headSize * 0.8}
          height={headSize * 0.8}
          image={face}
        />
        <Image
          x={width / 2 - (headSize / 2) * 0.8}
          y={height / 2 - headSize * 1}
          width={headSize * 0.8}
          height={headSize * 0.8}
          image={crown}
        />
      </Layer>
    </Stage>
  );
}
