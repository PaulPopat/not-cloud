import React from "react";
import { GetFileLink } from "../../app/file-link";
import { Icon } from "../../common/atoms";

export const FileActionsContext = React.createContext({
  set_deleting: (value: string) => {},
  set_editing: (value: string) => {},
  share: (path: string) => {},
  un_share: (path: string) => {},
});

export const CardActions: React.FC<{
  file: {
    name: string;
    extension: string;
    type: "directory" | "file";
    created: number;
    edited: number;
    size: number;
    download_url: string;
    shared: boolean;
  };
}> = ({ file }) => {
  const { set_deleting, set_editing, share, un_share } = React.useContext(
    FileActionsContext
  );
  return (
    <>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          set_editing(file.name + file.extension);
        }}
      >
        <Icon is="edit" colour="dark" width="20" height="20" valign="sub" />
      </a>
      &nbsp;
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          set_deleting(file.download_url);
        }}
      >
        <Icon is="trash" colour="dark" width="20" height="20" valign="sub" />
      </a>
      &nbsp;
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          file.shared ? un_share(file.download_url) : share(file.download_url);
        }}
      >
        <Icon
          is={file.shared ? "user-cross" : "share"}
          colour={file.shared ? "primary" : "dark"}
          width="20"
          height="20"
          valign="sub"
        />
      </a>
    </>
  );
};
