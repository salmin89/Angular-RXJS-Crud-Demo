import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { NotificationPoliciesComponent } from "./notification-policies/notification-policies.component";
import { QueryService } from "./services/query.service";
import { FakeApiService } from "./services/fake-api.service";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, NotificationPoliciesComponent],
  bootstrap: [AppComponent],
  providers: [QueryService, FakeApiService]
})
export class AppModule {}
