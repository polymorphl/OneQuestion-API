/* TODO Fill it with basic data */

INSERT INTO questions (owner_shortcode, share_shortcode, question, created_at) VALUES ("o123", "s456", "Test ?", "0000-00-00 00:00:00");
INSERT INTO owners (question_id, owner_shortcode, email, firstname, created_at) VALUES ("1", "o123", "stup@flip.fr", "King Ju", "0000-00-00 00:00:00");


INSERT INTO responses (question_id, contributor_shortcode, response, created_at) VALUES ("1", "c789", "Vla une rep", "0000-00-00 00:00:00");
INSERT INTO contributors (response_id, contributor_shortcode, email, firstname, created_at) VALUES ("1", "c789", "bruno@candida.fr", "Bruno Candida", "0000-00-00 00:00:00");
