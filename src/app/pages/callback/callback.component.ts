import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-callback',
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="callback-container">
      <mat-spinner />
      <p>Authenticating...</p>
    </div>
  `,
  styles: `
    .callback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      gap: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallbackComponent {}