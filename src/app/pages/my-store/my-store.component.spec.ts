import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyStoreComponent } from './my-store.component';
import { MyStoreService } from '../../services/my-store/my-store.service';
import { SignalService } from '../../services/signal/signal.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductModel } from '../../models/product.model';
import { CommonModule } from '@angular/common';

describe('MyStoreComponent', () => {
  let component: MyStoreComponent;
  let fixture: ComponentFixture<MyStoreComponent>;
  let myStoreServiceSpy: jasmine.SpyObj<MyStoreService>;
  let signalServiceSpy: jasmine.SpyObj<SignalService>;

  beforeEach(async () => {
    const myStoreSpy = jasmine.createSpyObj('MyStoreService', ['getProducts']);
    const signalSpy = jasmine.createSpyObj('SignalService', ['_myStoreData', 'updateCurrentPage$']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ProductCardComponent, MyStoreComponent],
      providers: [
        { provide: MyStoreService, useValue: myStoreSpy },
        { provide: SignalService, useValue: signalSpy }
      ]
    }).compileComponents();

    myStoreServiceSpy = TestBed.inject(MyStoreService) as jasmine.SpyObj<MyStoreService>;
    signalServiceSpy = TestBed.inject(SignalService) as jasmine.SpyObj<SignalService>;
    fixture = TestBed.createComponent(MyStoreComponent);
    component = fixture.componentInstance;

    const mockProducts: ProductModel[] = [
      { id: 1, title: 'Product 1', price: 100, description: 'desc', category: 'cat', image: 'image' },
      { id: 2, title: 'Product 2', price: 100, description: 'desc', category: 'cat', image: 'image' },
    ];

    signalServiceSpy._myStoreData.and.returnValue(mockProducts);
    signalServiceSpy.updateCurrentPage$.and.returnValue(undefined);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set products on initialization', () => {
    fixture.detectChanges();  
    expect(component.products.length).toBeGreaterThan(0);
    expect(component.products).toEqual(signalServiceSpy._myStoreData());
  });

  it('should call updateCurrentPage$ on ngOnInit', () => {
    fixture.detectChanges();
    expect(signalServiceSpy.updateCurrentPage$).toHaveBeenCalled();
  });

  it('should call fetchProducts on ngOnInit', () => {
    component.ngOnInit();
    expect(myStoreServiceSpy.getProducts).toHaveBeenCalled();
  });
});
