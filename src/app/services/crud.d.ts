import { Observable } from "rxjs";

export interface CrudInterface {
  create: (itemName: string) => Observable<{ data: any[]; total: number }>;
  read: (
    searchString: string,
    pagination: { offset: number; limit: number }
  ) => Observable<{ data: any[]; total: number }>;
  update: (itemIndex: number, itemName: string) => Observable<string>;
  destroy: (itemIndex: number) => Observable<string>;
}
