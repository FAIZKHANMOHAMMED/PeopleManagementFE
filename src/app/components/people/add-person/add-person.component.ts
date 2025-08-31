import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PeopleService, Person } from '../../../services/people.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-person',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent implements OnInit {
  personForm: FormGroup;
  errorMessage: string = '';
  isSubmitting = false;
  genders = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private peopleService: PeopleService,
    private router: Router
  ) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.personForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const personData: Omit<Person, 'id'> = {
        name: this.personForm.value.name,
        age: Number(this.personForm.value.age),
        gender: this.personForm.value.gender,
        mobile: this.personForm.value.mobile
      };

      this.peopleService.addPerson(personData).subscribe({
        next: () => {
          this.router.navigate(['/people']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to add person. Please try again.';
          this.isSubmitting = false;
          console.error('Error adding person:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation messages
      Object.keys(this.personForm.controls).forEach(key => {
        this.personForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/people']);
  }

  // Helper method to check if a form control has an error
  hasError(controlName: string, errorType: string): boolean {
    const control = this.personForm.get(controlName);
    return control ? control.hasError(errorType) && (control.dirty || control.touched) : false;
  }
}
