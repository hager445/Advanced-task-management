import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewCategoryComponent } from './create-new-category.component';

describe('CreateNewCategoryComponent', () => {
  let component: CreateNewCategoryComponent;
  let fixture: ComponentFixture<CreateNewCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
