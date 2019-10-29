const SerialPort = require('serialport')

// SerialPort.list().then(
//     ports => {
//         ports.forEach(port => {
//         console.log(`${port.comName}\t${port.pnpId || ''}\t${port.manufacturer || ''}`)
//         })
//     },
//     err => {
//         console.error('Error listing ports', err)
//     }
// )

// var SerialPort = require('serialport')
SerialPort.list().then(
  ports => {
        console.log('Listing ports')
        ports.forEach(console.log)
    },
  err => console.error(err)
)