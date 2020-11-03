import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, from, Observable } from "rxjs";
import { AnonymousSubject } from "rxjs/internal/Rx";
import {
  debounce,
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  map,
  shareReplay,
  switchMap,
  tap
} from "rxjs/operators";
import { FakeApiService } from "../fake-api.service";
import { QueryService } from "../query.service";

@Component({
  selector: "app-base-queryable",
  templateUrl: "./base-queryable.component.html",
  styleUrls: ["./base-queryable.component.css"]
})
export class BaseQueryableComponent {
  private queryService = new QueryService();
  DEFAULT_LIMIT = 10;

  loading = true;

reloadItemsDefault = {
    create: false,
    update: false,
    destroy: false,
    item: null,
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

  items$: Observable<any[]> = combineLatest([
    this.searchString$.pipe(
      debounceTime(300),
      map(searchString => searchString.trim()),
      distinctUntilChanged()
    ),
    this.paginationOptions$.pipe(
      debounceTime(300),
      distinctUntilKeyChanged("offset")
    ),
    this.reloadItems$
  ]).pipe(
    tap(() => (this.loading = true)),
    switchMap(([searchString, paginationOptions, reloadItems]) => {
      return this.queryService.getItems(searchString, paginationOptions);
    }),
    map((res: { data: string[]; total: number }) => {
      this.total$.next({
        current: res.data.length,
        all: res.total
      });
      this.loading = false;

      return res.data;
    }),
    shareReplay()
  );

  selectedItem: any;

  // #region State Changes
  get getCurrentPage() {
    return this.paginationOptions$.value.offset / this.DEFAULT_LIMIT;
  }

  get hasNextPage() {
    return this.getCurrentPage + 1 * this.DEFAULT_LIMIT < this.total$.value.all;
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
    this.loading = true;
    itemName = prompt("Enter item name", itemName);

    if (itemName === null) {
      this.loading = true;
      return;
    }

    this.queryService
      .update(this.paginationOptions$.value.offset + index, itemName)
      .subscribe((item) => this.reloadItems$.next({...this.reloadItemsDefault, update: true, item}));
  }

  deleteItem(index) {
    this.loading = true;

    this.queryService
      .remove(this.paginationOptions$.value.offset + index)
      .subscribe((item) => this.reloadItems$.next({...this.reloadItemsDefault, destroy: true, item}));
  }

  addNew() {
    this.loading = true;
    const itemName = prompt("Enter item name");
    if (itemName === null) {
      this.loading = true;
      return;
    }

    this.queryService
      .create(itemName)
      .subscribe((item) => this.reloadItems$.next({...this.reloadItemsDefault, create: true, item}));
  }
  // #endregion
}
