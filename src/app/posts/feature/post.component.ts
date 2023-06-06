import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { PageHeaderService } from 'src/app/layout/data-access/page-header.service';

@Component({
  selector: 'app-post',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="pageData$ | async as pageData">
      <app-render-template [components]="pageData.children" />
    </ng-container>
  `,
})
export class PostComponent implements OnInit {
  pageData$ = this.activatedRoute.data.pipe(map(({ pageData }) => pageData));
  headerData$ = this.pageData$.pipe(
    map((data) => ({
      header: data.header,
      subheader: data.subheader,
      img: data.headerBg,
      metadata: data.metadata,
      type: data.type,
    }))
  );

  constructor(
    private pageHeaderService: PageHeaderService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    const headerData = await firstValueFrom(this.headerData$);
    this.pageHeaderService.setPageData(
      headerData.header,
      headerData.subheader,
      headerData.img,
      headerData.metadata,
      headerData.type
    );
  }
}
