import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PeopleService, Person } from '../../../services/people.service';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './people-list.component.html',
  styleUrl: './people-list.component.css'
})
export class PeopleListComponent implements OnInit {
  people: Person[] = [];
  errorMessage: string = '';
  isLoading = false;

  constructor(
    private peopleService: PeopleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.peopleService.getPeople().subscribe({
      next: (data) => {
        this.people = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load people. Please try again later.';
        this.isLoading = false;
        console.error('Error loading people:', error);
      }
    });
  }

  onEdit(id: string): void {
    this.router.navigate(['/people/edit', id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this person?')) {
      this.peopleService.deletePerson(id).subscribe({
        next: () => {
          this.people = this.people.filter(p => p.id !== id);
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to delete person. Please try again.';
          console.error('Error deleting person:', error);
        }
      });
    }
  }

  onAddNew(): void {
    this.router.navigate(['/people/add']);
  }

}
