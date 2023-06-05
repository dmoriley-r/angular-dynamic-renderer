import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <header
      class="masthead"
      style="background-image: url('assets/img/{{ img }}')"
    >
      <div class="container position-relative px-4 px-lg-5">
        <div class="row gx-4 gx-lg-5 justify-content-center">
          <div class="col-md-10 col-lg-8 col-xl-7">
            <div class="site-heading">
              <h1>{{ title }}</h1>
              <span *ngIf="subheader" class="subheading">{{ subheader }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class PageHeaderComponent {
  @Input({
    required: true,
  })
  title: string;
  @Input() subheader: string | null;
  @Input() img: string | null;
}
