defaultdb=> CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);
CREATE TABLE
defaultdb=> insert into blogs (author, url, title, likes) values ('andy', 'andyishere.com', 'from toy story', 100);
INSERT 0 1
defaultdb=> insert into blogs (url, title) values ('noauthororlikes.com', 'defaultis0');
INSERT 0 1
defaultdb=> select * from blogs;
 id | author |         url         |     title      | likes
----+--------+---------------------+----------------+-------
  1 | andy   | andyishere.com      | from toy story |   100
  2 |        | noauthororlikes.com | defaultis0     |     0
(2 rows)

defaultdb=>
