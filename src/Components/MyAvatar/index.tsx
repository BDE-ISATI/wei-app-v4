enum HeadShape {
  square,
  triangle,
  circle,
}

interface IAvatar {
  headShape: HeadShape;
}

export { default as AvatarView } from "./AvatarView";
export { HeadShape };
export type { IAvatar };
