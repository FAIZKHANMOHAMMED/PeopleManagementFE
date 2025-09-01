import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Person {
  id?: string; // maps to backend _id
  name: string;
  age: number;
  gender: string;
  mobile: string; // maps to backend mobileNumber
}

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private base = `${environment.apiBase}/person`;

  constructor(private http: HttpClient) { }

  private fromApi(doc: any): Person {
    return {
      id: doc._id,
      name: doc.name,
      age: doc.age,
      gender: doc.gender,
      mobile: doc.mobileNumber,
    };
  }

  private toApi(p: Omit<Person, 'id'> | Person): any {
    return {
      name: p.name,
      age: p.age,
      gender: p.gender,
      mobileNumber: p.mobile,
    };
  }

  getPeople(): Observable<Person[]> {
    return this.http.get<any[]>(this.base).pipe(
      map(arr => arr.map(d => this.fromApi(d)))
    );
  }

  getPerson(id: string): Observable<Person> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(
      map(d => this.fromApi(d))
    );
  }

  addPerson(person: Omit<Person, 'id'>): Observable<Person> {
    return this.http.post<any>(this.base, this.toApi(person)).pipe(
      map(d => this.fromApi(d))
    );
  }

  updatePerson(person: Person): Observable<Person> {
    if (!person.id) throw new Error('id is required for update');
    return this.http.put<any>(`${this.base}/${person.id}`, this.toApi(person)).pipe(
      map(d => this.fromApi(d))
    );
  }

  deletePerson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
