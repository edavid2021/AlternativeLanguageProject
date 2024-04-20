const fs = require('fs');
const csv = require('csv-parser');
const path = 'cells.csv';
const readLine = require('readline');

// Create an interface for reading input from the console
const readline = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Cell {

    constructor (oem, model, launchAnnounced, launchStatus, bodyDimensions, bodyWeight, bodySim, displayType, displaySize, displayResolution, featuresSensors, platformOS) {
        this.oem = this.parseString(oem);
        this.model = this.parseString(model);
        this.launchAnnounced = launchAnnounced;
        this.launchStatus = launchStatus;
        this.bodyDimensions = this.parseString(bodyDimensions);
        this.bodyWeight = bodyWeight;
        this.bodySim = bodySim;
        this.displayType = this.parseString(displayType);
        this.displaySize = displaySize;
        this.displayResolution = this.parseString(displayResolution);
        this.featuresSensors = featuresSensors;
        this.platformOS = platformOS;
    }

    //Setter functions
    set oem(oem) {
        this._oem = oem;
    }
    set model(model) {
        this._model = model;
    }
    set launchAnnounced(launchAnnounced) {
        this._launchAnnounced = launchAnnounced;
    }
    set launchStatus(launchStatus) {
        this._launchStatus = launchStatus;
    }
    set bodyDimensions(bodyDimensions) {
        this._bodyDimensions = bodyDimensions;
    }
    set bodyWeight(bodyWeight) {
        this._bodyWeight = bodyWeight;
    }
    set bodySim(bodySim) {
        this._bodySim = bodySim;
    }
    set displayType(displayType) {
        this._displayType = displayType;
    }
    set displaySize(displaySize) {
        this._displaySize = displaySize;
    }
    set displayResolution(displayResolution) {
        this._displayResolution = displayResolution;
    }
    set featuresSensors(featuresSensors) {
        this._featuresSensors = featuresSensors;
    }
    set platformOS(platformOS) {
        this._platformOS = platformOS;
    }

    //Getter functions
    get oem() {
        return this._oem;
    }
    get model() {
        return this._model;
    }
    get launchAnnounced() {
        return this._launchAnnounced;
    }
    get launchStatus() {
        return this._launchStatus;
    }
    get bodyDimensions() {
        return this._bodyDimensions;
    }
    get bodyWeight() {
        return this._bodyWeight;
    }
    get bodySim() {
        return this._bodySim;
    }
    get displayType() {
        return this._displayType;
    }
    get displaySize() {
        return this._displaySize;
    }
    get displayResolution() {
        return this._displayResolution;
    }
    get featuresSensors() {
        return this._featuresSensors;
    }
    get platformOS() {
        return this._platformOS;
    }

    //Parsing functions
    parseString(str) {
        if (!str || str.length === 0 || str === "-") {
            return null;
        }
        return str.trim();
    }

    parseWeight(weightStr) {
        if (!weightStr || weightStr === '' || weightStr === '-') {
            return null;
        }
        const match = weightStr.match(/^\d+/);  // Regular expression to find the leading integer

        return match ? parseFloat(match[0]) : null;  // Parse the number as float
    }

    parseYear(yearStr) {
        const regex = /(\d{4})/; // Regular expression to match four-digit years
        const match = yearStr.match(regex);

        return match ? parseInt(match[0]) : null; // Parse the matched year as an integer or return null if no match
    }





    //Readme Questions

    //Question 1
    static highestAverageBodyWeight(cellsMap) {
        const weightOEM = new Map();
        const countByOEM = new Map();

        // Accumulate weights and count the number of models per OEM
        cellsMap.forEach(cell => {
            if (cell.bodyWeight !== null) {
                const weight = parseFloat(cell.bodyWeight);

                if (weightOEM.has(cell.oem)) {
                    weightOEM.set(cell.oem, weightOEM.get(cell.oem) + weight);
                } else {
                    weightOEM.set(cell.oem, weight);
                }
                if (countByOEM.has(cell.oem)) {
                    countByOEM.set(cell.oem, countByOEM.get(cell.oem) + 1);
                } else {
                    countByOEM.set(cell.oem, 1);
                }
            }
        });

        // Calculate average weight for each OEM
        const averageWeightOEM = new Map();

        weightOEM.forEach((sum, oem) => {
            const count = countByOEM.get(oem);
            averageWeightOEM.set(oem, sum / count);
        });

        // Find the OEM with the highest average weight
        let highestOEM;
        let maxAverage = -Infinity;

        averageWeightOEM.forEach((average, oem) => {
            if (average > maxAverage) {
                maxAverage = average;
                highestOEM = oem;
            }
        });

        return highestOEM;
    }

    //Question 2
    toString() {
        return `---> OEM: ${this.oem}, Model: ${this.model}`;

    }
    static phonesAnnouncedInOneYearReleasedInAnother(cellMap) {
        const mismatchedYears = [];

        cellMap.forEach((cell) => {
            const announcedYear = cell.parseYear(cell.launchAnnounced);
            const releasedYear = cell.parseYear(cell.launchStatus);

            if (announcedYear && releasedYear && announcedYear !== releasedYear) {
                mismatchedYears.push(cell.toString());
            }

        });

        //const out = console.log(mismatchedYears);

        return mismatchedYears.join('\n');
    }

    //Question 3
    static countPhonesWithOneFeatureSensor(cellMap) {
        let count = 0;
        cellMap.forEach((cell) => {
            if (cell.featuresSensors && cell.featuresSensors.trim() !== "" && cell.featuresSensors.trim() !== "-" && cell.featuresSensors.trim() !== "No") {
                const sensors = cell.featuresSensors.split(",");
                if (sensors.length === 1) {
                    count++;
                }
            }
        });
        return count;
    }

    //Question 4
    static yearWithMostPhonesLaunched(cellMap) {
        let yearCounts = new Map();

        // Count the number of phones launched per year
        cellMap.forEach((cell) => {
            const launchYear = cell.parseYear(cell.launchAnnounced); // Parse the launch year
            if (launchYear && launchYear > 1999) { // Ensure the launch year is valid
                if (yearCounts.has(launchYear)) {
                    yearCounts.set(launchYear, yearCounts.get(launchYear) + 1);
                } else {
                    yearCounts.set(launchYear, 1);
                }
            }
        });

        // Find the year with the most phones launched
        let maxCount = -1;
        let maxYear = null;
        yearCounts.forEach((count, year) => {
            if (count > maxCount) {
                maxCount = count;
                maxYear = year;
            }
        });

        return maxYear;
    }

    //Remaining 3 methods
    //Method to sort the phones by launch year
    static sortPhonesByLaunchYear(cellMap) {
        const phones = [];

        // Collect all phones into the 'phones' array
        cellMap.forEach((cell) => {
            phones.push(cell);
        });

        // Sort the phones by launch year
        const sortedPhones = phones.sort((a, b) => {
            const yearA = a.parseYear(a.launchAnnounced);
            const yearB = b.parseYear(b.launchAnnounced);
            return yearA - yearB;
        });

        return sortedPhones;
    }

    // Method to print details of a specific cell based on its number
    static printCellDetailsByNumber(cellMap) {

        // Prompt user to input the cell number
        readline.question('Enter the cell number you want to see: ', (answer) => {
            const cellNumber = parseInt(answer);

            if (isNaN(cellNumber) || cellNumber < 1 || cellNumber > cellMap.size) {
                console.log('\nInvalid cell number.');
            } else {
                const selectedCell = cellMap.get(cellNumber);

                console.log('Selected Cell Details -->\n');

                console.log(`OEM: ${selectedCell.oem}`);
                console.log(`Model: ${selectedCell.model}`);
                console.log(`Launch Announced: ${selectedCell.launchAnnounced}`);
                console.log(`Launch Status: ${selectedCell.launchStatus}`);
                console.log(`Body Dimensions: ${selectedCell.bodyDimensions}`);
                console.log(`Body Weight: ${selectedCell.bodyWeight}`);
                console.log(`Body Sim: ${selectedCell.bodySim}`);
                console.log(`Display Type: ${selectedCell.displayType}`);
                console.log(`Display Size: ${selectedCell.displaySize}`);
                console.log(`Display Resolution: ${selectedCell.displayResolution}`);
                console.log(`Features Sensors: ${selectedCell.featuresSensors}`);
                console.log(`Platform OS: ${selectedCell.platformOS}`);
            }

            readline.close();
        });
    }
}


function methodOptions() {

    readline.question('\nChoose which method you would like to see\n Select 1-4:\n 1. Sort by Year\n 2. Select Phone \n 3. TBD1\n 4. quit: ', (action) => {
        switch (action.trim().toLowerCase()) {
            case '1':
                //cell.sortPhonesByLaunchYear(cellMap);
                // Call the method and store the sorted phones
                const sortedPhones = Cell.sortPhonesByLaunchYear(cellMap);

                // Check if sortedPhones is not undefined
                if (sortedPhones) {
                    // Iterate over the sorted phones and print their details
                    sortedPhones.forEach((phone, index) => {
                        console.log(`${index + 1}: \n Model-> ${phone.model} \n Launch Year-> ${phone.launchAnnounced}`);
                    });
                } else {
                    console.log("No phones to display.");
                }

                methodOptions();  // Return to the main menu after sorting
                break;
            case '2':
                Cell.printCellDetailsByNumber(cellMap);

                methodOptions();  // Return to the main menu after deleting
                break;
            case '3':
                //listUniqueValues(cells);
                methodOptions()();  // Return to the main menu after listing
                break;
            case '4':
                readline.close();
                break;
            default:
                console.log('Invalid option. Select 1-4.');
                methodOptions();  // Recall the menu until a valid option or 'exit' is chosen
        }
    });
}


// Create a parser for the csv file
const parser = csv({
    delimiter: ',',
    columns: true,
    trim: true

}, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

// Read the file
var cellMap = new Map();
var ctr = 1;

fs.createReadStream(path).pipe(parser).on('data', (data) => {
    var cell = new Cell(data.oem, data.model, data.launch_announced, data.launch_status, data.body_dimensions, data.body_weight, data.body_sim, data.display_type, data.display_size, data.display_resolution, data.features_sensors, data.platform_os);
    cellMap.set(ctr, cell);
    ctr++;

}).on('end', () => {
    cellMap.forEach((value, key) => {
        console.log(key, value);
    });

    console.log("\nNumber of phones in the dataset:", cellMap.size);

    console.log("\n\n\n\nThe following are the results for the questions in the README.md file: \n");
    console.log("1. Company with the highest average body weight:", Cell.highestAverageBodyWeight(cellMap));
    console.log("\n2. Phones announced in one year and released in another:\n", Cell.phonesAnnouncedInOneYearReleasedInAnother(cellMap));
    console.log("\n3. Number of phones with only one feature sensor:", Cell.countPhonesWithOneFeatureSensor(cellMap));
    console.log("\n4. Year with the most phones launched:", Cell.yearWithMostPhonesLaunched(cellMap));

    methodOptions();

}).on('error', (err) => {
    console.log("Error occured while reading the file");
});
