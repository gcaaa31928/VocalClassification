import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';

import {RouterModule, Routes} from "@angular/router";
import {AppComponent} from "./app.component";
import { NgUploaderModule } from "ngx-uploader";


const appRoutes: Routes = [
];


@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes, {useHash: true}),
        HttpModule,
        NgUploaderModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}