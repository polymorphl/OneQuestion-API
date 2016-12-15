/*DATABASE*/
CREATE DATABASE IF NOT EXISTS oq_db;

/*
  TABLES
*/

/* questions */
CREATE TABLE IF NOT EXISTS `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'question ID',
  `owner_shortcode` varchar(32) NOT NULL COMMENT 'owner Shortcode',
  `share_shortcode` varchar(32) NOT NULL COMMENT 'share Shortcode',
  `question` varchar(255) NOT NULL,
  `state` int(11) NOT NULL DEFAULT 1 COMMENT '0:inactive|1:active',
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
ALTER TABLE  `questions` ADD INDEX (`id`);

/* responses */
CREATE TABLE IF NOT EXISTS `responses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL COMMENT 'question ID',
  `contributor_shortcode` varchar(32) NOT NULL COMMENT 'contributor Shortcode',
  `response` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `state` int(11) NOT NULL DEFAULT 1 COMMENT '0:inactive|1:active',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
ALTER TABLE  `responses` ADD INDEX (`id`);

/* owners */
CREATE TABLE IF NOT EXISTS `owners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL COMMENT 'question ID',
  `owner_shortcode` varchar(32) NOT NULL COMMENT 'owner Shortcode',
  `firstname` VARCHAR(32) NOT NULL DEFAULT "" COMMENT 'First Name',
  `email` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
ALTER TABLE  `owners` ADD INDEX (`id`);

/* contributors */
CREATE TABLE IF NOT EXISTS `contributors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `response_id` int(11) NOT NULL COMMENT 'response ID',
  `contributor_shortcode` varchar(32) NOT NULL COMMENT 'contributor Shortcode',
  `email` varchar(255) NOT NULL,
  `firstname` VARCHAR(32) NOT NULL DEFAULT "" COMMENT 'First Name',
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
ALTER TABLE  `contributors` ADD INDEX (`id`);
