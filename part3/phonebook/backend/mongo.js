const mongoose = require('mongoose')

if (process.argv.length < 5 && process.argv.length !== 3) {
  console.log('Usage: node mongo.js <password> <name> <number>')
  process.exit(1)
}


const pwd = process.argv[2]

const url = `mongodb+srv://fullstack:${pwd}@cluster0.8puucew.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // Display all resources in db
  console.log('Phonebook:')
  Person.find({}).then( res => {
    res.forEach( person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  // Save Person to db
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number
  })
  person.save().then(() => {
    console.log('Person added to phonebook!')
    mongoose.connection.close()
  })
}



