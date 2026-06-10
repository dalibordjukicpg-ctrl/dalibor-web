ALTER TABLE `home_service_cards`
  ADD COLUMN `slug` varchar(128) NULL AFTER `href`;

CREATE UNIQUE INDEX `home_service_cards_slug_unique` ON `home_service_cards` (`slug`);

ALTER TABLE `home_service_card_translations`
  ADD COLUMN `body` text NULL AFTER `description`;
