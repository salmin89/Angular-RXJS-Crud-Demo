import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, from, Observable } from "rxjs";
import { AnonymousSubject } from "rxjs/internal/Rx";
import {
  debounce,
  debounceTime,
  distinctUntilChanged,
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

  // loading$ = new BehaviorSubject(true);
  loading = true;

  reloadItems$ = new BehaviorSubject(false);

  searchString$: AnonymousSubject<string> = new BehaviorSubject<string>(
    ""
  ).pipe(
    debounceTime(300),
    map(searchString => searchString.trim()),
    distinctUntilChanged()
  ) as AnonymousSubject<string>;

  paginationOptions$ = new BehaviorSubject<any>({
    offset: 0,
    limit: this.DEFAULT_LIMIT
  });

  total$ = new BehaviorSubject({
    current: 0,
    all: 0
  });

  items$: Observable<any[]> = combineLatest([
    this.searchString$,
    this.paginationOptions$,
    this.reloadItems$
  ]).pipe(
    tap(() => (this.loading = true)),
    switchMap(([searchString, paginationOptions]) => {
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
      .subscribe(() => this.reloadItems$.next(true));
  }

  deleteItem(index) {
    this.loading = true;

    this.queryService
      .remove(this.paginationOptions$.value.offset + index)
      .subscribe(() => this.reloadItems$.next(true));
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
      .subscribe(() => this.reloadItems$.next(true));
  }
  // #endregion
}
