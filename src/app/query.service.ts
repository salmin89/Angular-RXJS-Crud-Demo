import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { take } from "rxjs/operators";
import { FakeApiService } from "./fake-api.service";

@Injectable()
export class QueryService {
  public getItems;
  public create;
  public update;
  public remove;

  constructor() {
    const fakeApiService = new FakeApiService();

    this.getItems = (searchString, paginationOptions) =>
      from(fakeApiService.getItems(searchString, paginationOptions));

    this.create = itemName =>
      from(fakeApiService.create(itemName)).pipe(take(1));

    this.update = (item, itemName) =>
      from(fakeApiService.update(item, itemName)).pipe(take(1));

    this.remove = index => from(fakeApiService.remove(index)).pipe(take(1));
  }
}
