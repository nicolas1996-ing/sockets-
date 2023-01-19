class Users {
  constructor() {
    this.persons = [];
  }

  addPerson(id, name, room) {
    let person = { id, name, room };
    this.persons.push(person);
    return this.persons;
  }

  getPersonById = (id) => this.persons.find((p) => p.id === id);

  getPersons = () => this.persons;

  getPersonsByRoom = (room) => this.persons.filter((p) => p.room === room);

  deletePerson = (id) => {
    const personIdx = this.persons.findIndex((p) => p.id === id);
    let personDelete;

    if (personIdx !== -1) {
      personDelete = this.getPersonById(id);
      this.persons.splice(personIdx, 1);
      return personDelete;
    }
  };
}

module.exports = {
  Users,
};
