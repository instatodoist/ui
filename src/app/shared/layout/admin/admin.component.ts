declare var mdc: any
import { Component, OnInit } from '@angular/core';
// import { Store, select } from '@ngrx/store';
// import { ErrorState } from 'src/app/ngrx/reducers/error.reducer';
import { UtilityService } from './../../../service/utility.service'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  snachBar: any;
  constructor(private utilityService: UtilityService) { }

  ngOnInit(): void {
    const drawer = new mdc.drawer.MDCDrawer.attachTo(
      document.querySelector(".mdc-drawer")
    );
    drawer.open = true;
    const topAppBar = new mdc.topAppBar.MDCTopAppBar(
      document.getElementById("app-bar")
    );
    topAppBar.setScrollTarget(document.getElementById("main-content"));
    topAppBar.listen("MDCTopAppBar:nav", () => {
      drawer.open = !drawer.open;
    });

    // subscribe to error store state
    // this.store.pipe(select('error')).subscribe((data: any) => {
    //   (data && data.statusText) ? this.utilityService.toastrError(data.statusText): undefined
    // })
  }

}
