/*DATABASE*/
CREATE DATABASE oq_db;

/*TABLES*/

/* question */
CREATE TABLE IF NOT EXISTS `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ownerId` varchar(255) NOT NULL COMMENT 'owner ID',
  `contributorId` varchar(255) NOT NULL COMMENT 'contributor ID',
  `question` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
ALTER TABLE  `question` ADD INDEX (`id`);


/* response */
CREATE TABLE IF NOT EXISTS `response` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ownerId` varchar(255) NOT NULL COMMENT 'owner ID',
  `contributorId` varchar(255) NOT NULL COMMENT 'contributor ID',
  `response` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
ALTER TABLE  `response` ADD INDEX (`id`);


/* owner */
CREATE TABLE IF NOT EXISTS `owner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ownerId` varchar(255) NOT NULL COMMENT 'owner ID',
  `email` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
ALTER TABLE  `owner` ADD INDEX (`id`);

/* contributor */
CREATE TABLE IF NOT EXISTS `contributor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contributorId` varchar(255) NOT NULL COMMENT 'contributor ID',
  `email` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
ALTER TABLE  `contributor` ADD INDEX (`id`);
