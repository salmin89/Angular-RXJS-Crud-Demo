import { Injectable } from "@angular/core";
import { from } from "rxjs";
import { take } from "rxjs/operators";
import { FakeApiService } from "./fake-api.service";

@Injectable({
  providedIn: "root"
})
export class QueryService {
  public create;
  public read;
  public update;
  public destroy;

  constructor(private fakeApiService: FakeApiService) {
    this.create = itemName =>
      from(this.fakeApiService.create(itemName)).pipe(take(1));

    this.read = (searchString, paginationOptions) =>
      from(this.fakeApiService.getItems(searchString, paginationOptions));

    this.update = (item, itemName) =>
      from(this.fakeApiService.update(item, itemName)).pipe(take(1));

    this.destroy = index =>
      from(this.fakeApiService.remove(index)).pipe(take(1));
  }
}