import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Person {
  id?: number;
  name: string;
  age: number;
  gender: string;
  mobile: string;
}

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private people: Person[] = [
    { id: 1, name: 'John Doe', age: 30, gender: 'Male', mobile: '1234567890' },
    { id: 2, name: 'Jane Smith', age: 25, gender: 'Female', mobile: '0987654321' },
  ];
  private lastId = 2;

  constructor() { }

  getPeople(): Observable<Person[]> {
    return of([...this.people]).pipe(delay(300)); // Simulate network delay
  }

  getPerson(id: number): Observable<Person> {
    const person = this.people.find(p => p.id === id);
    if (person) {
      return of({...person}).pipe(delay(300));
    }
    return throwError(() => new Error('Person not found'));
  }

  addPerson(person: Omit<Person, 'id'>): Observable<Person> {
    const newPerson: Person = {
      ...person,
      id: ++this.lastId
    };
    this.people.push(newPerson);
    return of(newPerson).pipe(delay(300));
  }

  updatePerson(person: Person): Observable<Person> {
    const index = this.people.findIndex(p => p.id === person.id);
    if (index !== -1) {
      this.people[index] = person;
      return of({...person}).pipe(delay(300));
    }
    return throwError(() => new Error('Person not found'));
  }

  deletePerson(id: number): Observable<void> {
    const index = this.people.findIndex(p => p.id === id);
    if (index !== -1) {
      this.people.splice(index, 1);
      return of(undefined).pipe(delay(300));
    }
    return throwError(() => new Error('Person not found'));
  }
}
