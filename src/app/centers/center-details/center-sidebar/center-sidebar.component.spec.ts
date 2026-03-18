import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterSidebarComponent } from './center-sidebar.component';

describe('CenterSidebarComponent', () => {
  let component: CenterSidebarComponent;
  let fixture: ComponentFixture<CenterSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
