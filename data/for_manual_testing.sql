/*best media_id for testing = 1,73 best professional_id for testing = 506, 3372
for names it is movies: 'Klebolin klebt alles','Halfaouine: Boy of the Terraces'
and for professionals = 'Lou Bedford', 'Fernando Trueba'
the password of each user is the same as the username*/

INSERT INTO user(user_id, username, password, first_name, last_name, birth_date, role, account_status) VALUES (1, 'user', '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb', 'Aggelos', 'Kastrinellis', '2024-01-01 00:00:00', 'user', 'active');
INSERT INTO user(user_id, username, password, first_name, last_name, birth_date, role, account_status) VALUES (2, 'angelkas123', '82b315475dd24a7ffe90c37080bc3ae9c5b654fea030285f316f71c41451d5a7', 'Aggelos', 'Kastrinellis', '2024-01-01 00:00:00', 'user', 'active');
INSERT INTO user(user_id, username, password, first_name, last_name, birth_date, role, account_status) VALUES (3, 'angelkas124', '281a881b365f14fb3bf2a91996e733df3b94cf6f051d2843af6401d4337c96c7', 'Aggelos', 'Kastrinellis', '2023-12-31 00:00:00', 'user', 'active');
INSERT INTO user(user_id, username, password, first_name, last_name, birth_date, role, account_status) VALUES (4, 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Spyros', 'Loukovitis',  '2002-08-23 00:00:00', 'admin', 'active');

INSERT INTO watch_later(user_id, media_id) VALUES(1, 1);
INSERT INTO watch_later(user_id, media_id) VALUES(1, 183);

INSERT INTO watched(user_id, media_id) VALUES(1, 1);
INSERT INTO watched(user_id, media_id) VALUES(1, 53);

INSERT INTO rates(media_id, user_id, rating, description) VALUES (1, 4, 8.7, 'Matrix = Perfection');
INSERT INTO rates(media_id, user_id, rating, description) VALUES (73, 4, 5.7, 'Not that great');
INSERT INTO rates(media_id, user_id, rating, description) VALUES (1, 2, 7.3, 'Keanu the best');
