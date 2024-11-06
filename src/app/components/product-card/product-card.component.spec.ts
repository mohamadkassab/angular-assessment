import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { By } from '@angular/platform-browser';


describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct = {
    title: 'Test Product',
    price: 29.99,
    description: 'This is a test product description that is very detailed.',
    image: 'test-image.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct; 
    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display product details', () => {
    const productTitle = fixture.debugElement.query(By.css('.product-title')).nativeElement;
    const productPrice = fixture.debugElement.query(By.css('.product-price')).nativeElement;
    const productDescription = fixture.debugElement.query(By.css('.product-description')).nativeElement;
    expect(productTitle.textContent).toContain(mockProduct.title);
    expect(productPrice.textContent).toContain('Price: $29.99'); 
    expect(productDescription.textContent).toContain(mockProduct.description.slice(0, 60) + '...'); 
  });

  it('should open the modal and display selected product details when "View Details" is clicked', () => {
    const viewDetailsButton = fixture.debugElement.query(By.css('.view-details-button'));
    viewDetailsButton.triggerEventHandler('click', null); 
    fixture.detectChanges(); 
    expect(component.selectedProduct).toEqual(mockProduct); 
    const modalTitle = fixture.debugElement.query(By.css('.model-title')).nativeElement;
    const modalPrice = fixture.debugElement.query(By.css('.product-price')).nativeElement;
    const modalDescription = fixture.debugElement.query(By.css('.modal-description')).nativeElement;
    expect(modalTitle.textContent).toContain(mockProduct.title);
    expect(modalPrice.textContent).toContain('Price: $29.99'); 
    expect(modalDescription.textContent).toContain(mockProduct.description);
  });

  it('should close the modal when clicking the close button or outside the modal', () => {
    component.openDetails(mockProduct);
    fixture.detectChanges(); 
    const closeButton = fixture.debugElement.query(By.css('.close-button'));
    closeButton.triggerEventHandler('click', null);
    fixture.detectChanges(); 
    expect(component.selectedProduct).toBeNull(); 
    component.openDetails(mockProduct);
    fixture.detectChanges(); 
    const modalBackground = fixture.debugElement.query(By.css('.modal'));
    modalBackground.triggerEventHandler('click', null);
    fixture.detectChanges(); 
    expect(component.selectedProduct).toBeNull(); 
  });
});
