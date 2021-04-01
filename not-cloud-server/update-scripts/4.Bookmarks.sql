CREATE TABLE bookmark_folders(
  id uuid PRIMARY KEY,
  name text NOT NULL,
  parent uuid
);

CREATE TABLE bookmarks(
  id uuid PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL,
  folder uuid,
  CONSTRAINT fk_folder FOREIGN KEY (folder) REFERENCES bookmark_folders(id)
);