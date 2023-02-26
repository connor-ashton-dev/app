import React from 'react';
import { createContext, SetStateAction, Dispatch } from 'react';

type CameraProps = {
  viewCamera: boolean;
  setViewCamera: Dispatch<SetStateAction<boolean>>;
  user: string | null;
  setUser: Dispatch<SetStateAction<string>>;
  viewPictures: boolean;
  setViewPictures: Dispatch<SetStateAction<boolean>>;
};

export const BonsaiContext = createContext<CameraProps>({
  viewCamera: false,
  setViewCamera: () => {},
  user: '',
  setUser: () => {},
  viewPictures: false,
  setViewPictures: () => {},
});
