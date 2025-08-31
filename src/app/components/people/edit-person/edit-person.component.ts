import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PeopleService } from '../../../services/people.service';

@Component({
  selector: 'app-edit-person',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-person.component.html',
  styleUrl: './edit-person.component.css'
})
export class EditPersonComponent implements OnInit {
  personForm: FormGroup;
  errorMessage: string = '';
  isSubmitting = false;
  personId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.personId = +id;
        this.loadPerson(this.personId);
      }
    });
  }

  loadPerson(id: number): void {
    this.peopleService.getPerson(id).subscribe({
      next: (person) => {
        this.personForm.patchValue({
          name: person.name,
          age: person.age,
          gender: person.gender,
          mobile: person.mobile
        });
      },
      error: (error) => {
        this.errorMessage = 'Failed to load person details. Please try again.';
        console.error('Error loading person:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.personForm.invalid || this.isSubmitting || this.personId === null) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const updatedPerson = { ...this.personForm.value, id: this.personId };

    this.peopleService.updatePerson(updatedPerson).subscribe({
      next: () => {
        this.router.navigate(['/people']);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update person. Please try again.';
        console.error('Error updating person:', error);
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/people']);
  }

}
