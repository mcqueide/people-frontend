import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PeopleService } from '../../services/people.service';
import { PersonResponse } from '../../models/person.model';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class PeopleListComponent implements OnInit {
  private peopleService = inject(PeopleService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  people = signal<PersonResponse[]>([]);
  currentPage = signal(0);
  pageSize = signal(20);
  loading = signal(false);
  
  displayedColumns = ['name', 'birthday', 'address', 'phone', 'actions'];

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.loading.set(true);
    
    this.peopleService.list(this.currentPage(), this.pageSize()).subscribe({
      next: (people) => {
        this.people.set(people);
        this.loading.set(false);
      },
      error: (err) => {
        this.snackBar.open('Failed to load people', 'Close', { duration: 3000 });
        this.loading.set(false);
        console.error('Error loading people:', err);
      }
    });
  }

  onEdit(id: string): void {
    this.router.navigate(['/people', id, 'edit']);
  }

  onDelete(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      this.peopleService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Person deleted successfully', 'Close', { duration: 3000 });
          this.loadPeople();
        },
        error: (err) => {
          this.snackBar.open('Failed to delete person', 'Close', { duration: 3000 });
          console.error('Error deleting person:', err);
        }
      });
    }
  }

  onNextPage(): void {
    this.currentPage.update(page => page + 1);
    this.loadPeople();
  }

  onPreviousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(page => page - 1);
      this.loadPeople();
    }
  }

  onCreateNew(): void {
    this.router.navigate(['/people', 'new']);
  }
}
