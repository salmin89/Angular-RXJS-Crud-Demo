import { BehaviorSubject, combineLatest, from, merge,  Observable, zip } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  map,
  shareReplay,
  switchMap,
  tap
} from "rxjs/operators";
import { CrudInterface } from "../services/crud";

export class BaseQueryableComponent {

  apiService: CrudInterface;

  DEFAULT_LIMIT = 10;

  loading = true;

  reloadItemsDefault = {
    create: false,
    update: false,
    destroy: false,
    itemIndex: null,
    itemName: null
  };

  reloadItems$ = new BehaviorSubject(this.reloadItemsDefault);

  searchString$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  paginationOptions$ = new BehaviorSubject<any>({
    offset: 0,
    limit: this.DEFAULT_LIMIT
  });

  total$ = new BehaviorSubject({
    current: 0,
    all: 0
  });

  requestItems$: Observable<any> = combineLatest([
    this.searchString$.pipe(
      debounceTime(600),
      map(searchString => searchString.trim()),
      distinctUntilChanged()
    ),
    this.paginationOptions$.pipe(
      debounceTime(600),
      distinctUntilKeyChanged("offset")
    ),
  ]).pipe(
    tap(() => (this.loading = true)),
    switchMap(([searchString, paginationOptions]) => {
      return this.apiService.read(searchString, paginationOptions)
    }),
    shareReplay()
  );

  items$ = combineLatest(this.requestItems$, this.reloadItems$).pipe(
    map(([response,reloadItems]) => {
      if (this.pendingChanges && (reloadItems.create || reloadItems.update || reloadItems.destroy)) {
        
        if (reloadItems.create) response.data.unshift(reloadItems.itemName);
        if (reloadItems.update) response.data[reloadItems.itemIndex] = reloadItems.itemName;
        if (reloadItems.destroy) response.data.splice(reloadItems.itemIndex, 1);

        this.pendingChanges = false;
      }
      this.total$.next({
        current: response.data.length,
        all: response.total
      });
      this.loading = false;
      return response.data;
    }),
    shareReplay()
  )

  selectedItem: any;
  pendingChanges: boolean;

  // #region State Changes
  get getCurrentPage() {
    return this.paginationOptions$.value.offset / this.DEFAULT_LIMIT;
  }

  get hasNextPage() {
    return this.getCurrentPage + 1 * this.DEFAULT_LIMIT < this.total$.value.all;
  }

  constructor(_apiService: CrudInterface) {
    this.apiService = _apiService
  }

  handleSearch(event) {
   if (event.target.value?.trim()) {
      this.paginationOptions$.next({
      offset: 0,
      limit: this.DEFAULT_LIMIT
    });

    this.total$ = new BehaviorSubject({
      current: 0,
      all: 0
    });
   }

    this.searchString$.next(event.target.value);
  }

  prevPage() {
    this.paginationOptions$.next({
      offset: this.paginationOptions$.value.offset - this.DEFAULT_LIMIT,
      limit: this.DEFAULT_LIMIT
    });
  }

  nextPage() {
    this.paginationOptions$.next({
      offset: this.paginationOptions$.value.offset + this.DEFAULT_LIMIT,
      limit: this.DEFAULT_LIMIT
    });
  }

  toggleItemSelect(item) {
    if (this.selectedItem == item) {
      this.selectedItem = null;
    } else {
      this.selectedItem = item;
    }
  }
  // #endregion

  // #region CRUD Operations
  editItem(index, itemName) {
    itemName = prompt("Enter item name", itemName);

    if (itemName === null) {
      return;
    }
    this.loading = true;
    this.pendingChanges = true;

    this.apiService
      .update(this.paginationOptions$.value.offset + index, itemName)
      .subscribe((item) => this.reloadItems$.next({...this.reloadItemsDefault, update: true, itemIndex: index, itemName}));
  }

  deleteItem(index) {
    this.loading = true;
    this.pendingChanges = true;

    this.apiService
      .destroy(this.paginationOptions$.value.offset + index)
      .subscribe((item) => this.reloadItems$.next({...this.reloadItemsDefault, destroy: true, itemIndex: index}));
  }

  addNew() {
    const itemName = prompt("Enter item name");

    if (itemName === null) {
      return;
    }
    this.loading = true;
    this.pendingChanges = true;

    this.apiService
      .create(itemName)
      .subscribe((item) => this.reloadItems$.next({...this.reloadItemsDefault, create: true, itemName}));
  }
  // #endregion
}
