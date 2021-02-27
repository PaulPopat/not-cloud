CREATE TABLE Passwords (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  description TEXT NOT NULL
);
CREATE TABLE Password_Tags (id TEXT PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE Password_Tag_Matches (
  id TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  tag TEXT NOT NULL,
  FOREIGN KEY (password) REFERENCES Passwords(id),
  FOREIGN KEY (tag) REFERENCES Password_Tags(id)
)