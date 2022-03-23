import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, catchError, combineLatest, map, merge, Observable,  scan,  Subject, tap, throwError } from 'rxjs';

import { Product } from './product';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = 'api/suppliers';

  //without spread operator

  // products$ = this.http.get<Product[]>(this.productsUrl)
  // .pipe(
  //   // map(item => item.price * 1.5),
  //   map(products => 
  //     products.map(product =>({
  //       id: product.id,
  //       productName: product.productName,
  //       productCode: product.productCode,
  //       description: product.description,
  //       price: product.price,
  //       searchKey: [product.productName]
  //     } as Product)       
  //   )),
  //   tap(data => console.log(JSON.stringify(data))),    
  //   catchError(this.handleError)
  // );

  //with spread UnaryOperator, copies all the properties to the new object

  // products$ = this.http.get<Product[]>(this.productsUrl)
  // .pipe(
  //   // map(item => item.price * 1.5),
  //   map(products => 
  //     products.map(product =>({
  //      ...product,
  //      price: product.price ? product.price * 1.5 : 0,
  //      searchKey: [product.productName]
  //     } as Product)       
  //   )),
  //   tap(data => console.log(JSON.stringify(data))),    
  //   catchError(this.handleError)
  // );

  

  products$ = this.http.get<Product[]>(this.productsUrl)
  .pipe(   
    tap(data => console.log(JSON.stringify(data))),    
    catchError(this.handleError)
  );

  productsWithCategory$ = combineLatest([//emitts one array containing the products array in the first element and the categories in the second
    this.products$,
    this.productCategoryService.productCategories$
  ]).pipe(
    map(([products, categories])=>
      products.map(product => ({
        ...product,
        price: product.price ? product.price * 1.5 : 0,
        category: categories.find(c => product.categoryId === c.id)?.name,
        searchKey: [product.productName]
      } as Product))    
    )
  )

  private productSelectedSubject = new BehaviorSubject<number>(0);
  productSelectedAction$ = this.productSelectedSubject.asObservable();

  selectedProduct$ = combineLatest([
    this.productsWithCategory$,
    this.productSelectedAction$
  ]).pipe(
    map(([products, selectedProductId]) =>
    products.find(product => product.id === selectedProductId)
    ),
    tap(product => console.log('selectedProduct', product))
  );


  productInsertedSubject = new Subject<Product>();  
  productInsertedAction$ = this.productInsertedSubject.asObservable();

  productsWithAdd$ = merge(
    this.productsWithCategory$,
    this.productSelectedAction$
  )
  .pipe(
     scan( (acc, value) =>       
        (value instanceof Array) ? [...value] : [...acc, value], [] as Product[])
  );
  


  constructor(private http: HttpClient, private productCategoryService: ProductCategoryService ) { }

  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.productsUrl)
  //     .pipe(
  //       tap(data => console.log('Products: ', JSON.stringify(data))),
  //       // catchError(error => {
  //       //   console.log(error);
  //       //   throw new Error('Could not retrieve');
  //       // })
  //       catchError(this.handleError)
  //     );
  // }

  selectedProductChanged(selectedProductId: number): void {
    this.productSelectedSubject.next(selectedProductId);
  }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30
    };
  }

  addProduct(newProduct?: Product){
    newProduct = newProduct || this.fakeProduct();
    this.productInsertedSubject.next(newProduct);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}
