CREATE TABLE passwords (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  description text NOT NULL
);
CREATE TABLE password_tags (id uuid PRIMARY KEY, name text NOT NULL);
CREATE TABLE password_tag_matches (
  id uuid PRIMARY KEY,
  password uuid NOT NULL,
  tag uuid NOT NULL,
  CONSTRAINT fk_password FOREIGN KEY (password) REFERENCES passwords(id),
  CONSTRAINT fk_tag FOREIGN KEY (tag) REFERENCES password_tags(id)
)