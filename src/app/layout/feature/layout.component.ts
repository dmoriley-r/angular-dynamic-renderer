import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageHeaderService } from '../data-access/page-header.service';
import { NavBarComponent } from '../ui/navbar.component';
import { PageHeaderComponent } from '../ui/page-header.component';
import { FooterComponent } from '../ui/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NavBarComponent,
    PageHeaderComponent,
    FooterComponent,
  ],
  providers: [PageHeaderService],
})
export class LayoutComponent implements OnInit {
  constructor(protected pageHeaderService: PageHeaderService) {}

  ngOnInit() {}
}
