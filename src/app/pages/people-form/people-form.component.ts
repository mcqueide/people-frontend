import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PeopleService } from '../../services/people.service';
import { PersonRequest } from '../../models/person.model';

@Component({
  selector: 'app-people-form',
  templateUrl: './people-form.component.html',
  styleUrls: ['./people-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class PeopleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private peopleService = inject(PeopleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  personForm: FormGroup;
  isEditMode = signal(false);
  personId = signal<string | null>(null);
  loading = signal(false);

  constructor() {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      birthday: [''],
      address: [''],
      phone: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.personId.set(id);
      this.loadPerson(id);
    }
  }

  loadPerson(id: string): void {
    this.loading.set(true);

    this.peopleService.get(id).subscribe({
      next: (person) => {
        this.personForm.patchValue({
          name: person.name,
          birthday: person.birthday || '',
          address: person.address || '',
          phone: person.phone || ''
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.snackBar.open('Failed to load person', 'Close', { duration: 3000 });
        this.loading.set(false);
        console.error('Error loading person:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const personData: PersonRequest = {
      name: this.personForm.value.name,
      birthday: this.personForm.value.birthday || undefined,
      address: this.personForm.value.address || undefined,
      phone: this.personForm.value.phone || undefined
    };

    const operation = this.isEditMode()
      ? this.peopleService.update(this.personId()!, personData)
      : this.peopleService.create(personData);

    operation.subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open(
          `Person ${this.isEditMode() ? 'updated' : 'created'} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.router.navigate(['/people']);
      },
      error: (err) => {
        this.snackBar.open(
          `Failed to ${this.isEditMode() ? 'update' : 'create'} person`,
          'Close',
          { duration: 3000 }
        );
        this.loading.set(false);
        console.error('Error saving person:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/people']);
  }
}
