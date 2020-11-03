import { Injectable } from "@angular/core";

@Injectable()
export class FakeApiService {
  names = [
    "Liam",
    "Noah",
    "William",
    "James",
    "Oliver",
    "Benjamin",
    "Elijah",
    "Lucas",
    "Mason",
    "Logan",
    "Alexander",
    "Ethan",
    "Jacob",
    "Michael",
    "Daniel",
    "Henry",
    "Jackson",
    "Sebastian",
    "Aiden",
    "Matthew",
    "Samuel",
    "David",
    "Joseph",
    "Carter",
    "Owen",
    "Wyatt",
    "John",
    "Jack",
    "Luke",
    "Jayden",
    "Dylan",
    "Grayson",
    "Levi",
    "Issac",
    "Gabriel",
    "Julian",
    "Mateo",
    "Anthony",
    "Jaxon",
    "Lincoln",
    "Joshua",
    "Christopher",
    "Andrew",
    "Theodore",
    "Caleb",
    "Ryan",
    "Asher",
    "Nathan",
    "Thomas",
    "Leo",
    "Isaiah",
    "Charles",
    "Josiah",
    "Hudson",
    "Christian",
    "Hunter",
    "Connor",
    "Eli",
    "Ezra",
    "Aaron",
    "Landon",
    "Adrian",
    "Jonathan",
    "Nolan",
    "Jeremiah",
    "Easton",
    "Elias",
    "Colton",
    "Cameron",
    "Carson",
    "Robert",
    "Angel",
    "Maverick",
    "Nicholas",
    "Dominic",
    "Jaxson",
    "Greyson",
    "Adam",
    "Ian",
    "Austin",
    "Santiago",
    "Jordan",
    "Cooper",
    "Brayden",
    "Roman",
    "Evan",
    "Ezekiel",
    "Xavier",
    "Jose",
    "Jace",
    "Jameson",
    "Leonardo",
    "Bryson",
    "Axel",
    "Everett",
    "Parker",
    "Kayden",
    "Miles",
    "Sawyer",
    "Jason"
  ];

  getItems(
    searchString,
    { offset, limit }
  ): Promise<{ data: string[]; total: number }> {
    console.log("FAKE API CALL");
    return new Promise(resolve => {
      setTimeout(() => {
        const itemsSubset =
          searchString.trim() !== ""
            ? this.names.filter(item =>
                item.toLowerCase().includes(searchString.toLowerCase())
              )
            : this.names;
        resolve({
          data: itemsSubset.slice(offset, offset + limit),
          total: itemsSubset.length
        });
      }, 1000);
    });
  }

  create(item): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.names.unshift(item);
        resolve(item);
      }, 800);
    });
  }

  update(index, itemName): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.names[index] = itemName;
        resolve(this.names[index]);
      }, 700);
    });
  }

  remove(index): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        const itemToRemove = this.names[index];
        this.names.splice(index, 1);
        resolve(itemToRemove);
      }, 300);
    });
  }
}
