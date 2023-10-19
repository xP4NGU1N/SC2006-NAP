const fs = require('fs')
const csv = require('fast-csv')
const { Carpark } = require('../model/entity/carpark')

async function importCarparksFromCSV(fileLocation) {
    const stream = fs.createReadStream(fileLocation)
    const csvStream = csv.parse({ headers: true })

    stream.pipe(csvStream)

    csvStream.on('data', async (row) => {
        // Process the row and create a new Carpark record (CSV header already matches column name)
        try {
            await Carpark.create({ 
                carparkNo: row["carparkNo"], 
                address: row["address"], 
                xCoord: row["xCoord"],
                yCoord: row["yCoord"],
                carparkType: row["carparkType"],
                paymentSystem: row["paymentSystem"] 
            })
        } catch (error) {
            console.error('Error creating Carpark record:', error)
        }
    })

    csvStream.on('end', () => {
        console.log('CSV import completed.')
    })
}

module.exports = { importCarparksFromCSV }