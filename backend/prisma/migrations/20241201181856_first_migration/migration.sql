-- CreateTable
CREATE TABLE `WeatherData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `highTemp` DOUBLE NOT NULL,
    `lowTemp` DOUBLE NOT NULL,
    `weather` VARCHAR(191) NOT NULL,
    `windSpeed` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `queryId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeatherQueries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `query` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserToWeatherQueries` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserToWeatherQueries_AB_unique`(`A`, `B`),
    INDEX `_UserToWeatherQueries_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WeatherData` ADD CONSTRAINT `WeatherData_queryId_fkey` FOREIGN KEY (`queryId`) REFERENCES `WeatherQueries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserToWeatherQueries` ADD CONSTRAINT `_UserToWeatherQueries_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserToWeatherQueries` ADD CONSTRAINT `_UserToWeatherQueries_B_fkey` FOREIGN KEY (`B`) REFERENCES `WeatherQueries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
