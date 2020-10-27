import { Component, OnInit } from "@angular/core";
import { BaseQueryableComponent } from "../base-queryable/base-queryable.component";
import { QueryService } from "../query.service";

@Component({
  selector: "app-notification-policies",
  templateUrl: "./notification-policies.component.html",
  styleUrls: ["./notification-policies.component.css"]
})
export class NotificationPoliciesComponent extends BaseQueryableComponent {
  constructor() {
    super();
  }
}
