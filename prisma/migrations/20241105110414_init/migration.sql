-- CreateTable
CREATE TABLE `VideoSource` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `onvif` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `rtsp` VARCHAR(191) NULL,

    UNIQUE INDEX `VideoSource_onvif_key`(`onvif`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Face` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `embeddedFace` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Face_embeddedFace_key`(`embeddedFace`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `videoId` INTEGER NOT NULL,
    `faceId` INTEGER NOT NULL,
    `datetime` DATETIME(3) NOT NULL,
    `cropImage` VARCHAR(191) NOT NULL,
    `inandout` ENUM('IN', 'OUT') NULL,
    `sex` ENUM('MAN', 'WOMAN') NULL,

    INDEX `Event_datetime_idx`(`datetime`),
    INDEX `Event_datetime_videoId_idx`(`datetime`, `videoId`),
    INDEX `Event_datetime_faceId_idx`(`datetime`, `faceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_faceId_fkey` FOREIGN KEY (`faceId`) REFERENCES `Face`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `VideoSource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
