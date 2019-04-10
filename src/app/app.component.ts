import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatSort } from '@angular/material';
import { timer } from 'rxjs';
// import 'rxjs/add/observable/timer'


import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';

  displayedColumns = ['name', 'type', 'location', 'status', 'last_sync', 'threshold'];
  dataSource = new MatTableDataSource()

  mapInit: L.MapOptions;
  mapLayers = []
  API: string

  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient) {}

  ngOnInit() {

    const openStreetMaps = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>' })
    this.mapInit = {
      layers: [openStreetMaps],
      zoom: 5,
      center: L.latLng(46.5540527621168, 9.328354404567692)
    }
    
    this.http.get<Config>('assets/config.json').subscribe(
      data => {this.API = data.API},
      error => {console.error("Cannot GET config file!")},
      () => {
        timer(0, 60000).subscribe( () => {
          this.http.get<Components[]>(this.API).subscribe(
            data => {
              this.dataSource.data = data
              this.dataSource.sort = this.sort;
            },
            error => console.error(error),
            () => {
              let popupDirection: Direction;
              let marker: L.Marker;
              this.mapLayers = []

              this.dataSource.data.forEach( (element:Components) => {
                if (element.latitude && element.longitude)
                {
                  if (element.type === 'SERVICE' || element.type === 'VIM') {
                    
                    if (element.name === 'OSM' || element.name === 'PORTAL') {
                      popupDirection = "bottom"
                    } else {
                      popupDirection = "top"
                    }

                    marker = L.marker(L.latLng(+element.latitude, +element.longitude), {
                      icon:L.icon ({
                        iconSize: [1,1],
                        // iconSize: [25,41],
                        iconAnchor: [13,41],
                        iconUrl: 'assets/marker-icon.png',
                        // shadowUrl: 'assets/marker-shadow.png'
                      })
                    }).bindTooltip(`<a>${element.name}</a></br><b><span style='height:8px; width:8px; background-color:${this.setStatusColor(element.status)}; border-radius:50%; display:inline-block; margin-right:3px'></span><span style='color:${this.setStatusColor(element.status)}'>${element.status}</span></b>`, {permanent:true, direction:popupDirection });

                    this.mapLayers.push(marker);
                  }

                  else if (element.type === "CONNECTIVITY") {
                    this.mapLayers.push(L.polyline([L.latLng(+element.latitude, +element.longitude), L.latLng(+element.linkEndLatitude, +element.linkEndLongitude)], {weight:3, color:this.setConnectivityStatusColor(element.status), dashArray: this.setConnectivityDashArray(element.status)}));
                  }
                }
              })
            }
          )
        })
      }
    )

  }

  setConnectivityStatusColor(status) {
    return this.setStatusColor(status)
  }

  setConnectivityDashArray(status) {
    if (status === "UP") {
      return '0'
    } else {
      return '30 20'
    }
  }

  setStatusColor (status) {
    let statusColor:string
    switch (status) {
      case 'UP':
      statusColor = 'green'
      break
      case 'WARNING':
      statusColor = 'orange'
      break
      case 'DOWN':
      statusColor = 'red'
    }
    return statusColor
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  setStatusClass(element) {
    return element.status.toLowerCase()
  }

  setRowClass (row) {
    if (row.status === 'FAIL' || row.status === 'DOWN')
    return 'error-row'
  }
}

export interface Config {
  API: string;
}

export interface Components {
  name: string
  description: string
  latitude: string
  longitude: string
  linkEndLatitude: string,
  linkEndLongitude: string,
  status: string
  type: string
  locationName: string
  failoverThreshold: number
  lastSeenUTC: string
}

export type Direction = 'right' | 'left' | 'top' | 'bottom' | 'center' | 'auto';
