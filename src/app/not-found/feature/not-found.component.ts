import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageHeaderService } from 'src/app/layout/data-access/page-header.service';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>Maybe try going back to the home page and looking around</div>
  `,
})
export class NotFoundComponent implements OnInit {
  constructor(private pageHeaderService: PageHeaderService) {}

  ngOnInit() {
    this.pageHeaderService.setPageData(
      "I'm sorry to tell you this",
      "but the page you're looking for doesn't exist",
      'frustrated.webp'
    );
  }
}
