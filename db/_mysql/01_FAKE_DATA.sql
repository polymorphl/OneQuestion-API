/* TODO Fill it with basic data */

INSERT INTO question (owner_id, contributor_id, question, created_at) VALUES ("123", "456", "Test ?", "0000-00-00 00:00:00");

INSERT INTO response (owner_id, question_id, response, created_at) VALUES ("123", "1", "Yes test Mec", "0000-00-00 00:00:00");

INSERT INTO owner (owner_id, email, firstname, created_at) VALUES ("123", "stup@flip.fr", "King Ju", "0000-00-00 00:00:00");

INSERT INTO contributor (contributor_id, email, firstname, created_at) VALUES ("456", "bruno@candida.fr", "Bruno Candida", "0000-00-00 00:00:00");
