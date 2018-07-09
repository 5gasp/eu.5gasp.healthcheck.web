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
    timer(0, 1800000).subscribe( () => {
      this.http.get<Config>('assets/config.json').subscribe(
        data => {this.API = data.API},
        error => {console.error("Cannot GET config file!")},
        () => {
          this.http.get<any>(this.API).subscribe(
            data => {
              this.dataSource.data = data
              this.dataSource.sort = this.sort;
            },
            error => console.error(error),
            () => {
              this.dataSource.data.forEach( (element) => {
                if (element["type"] == 'SERVICE' || element["type"] == 'VIM') {

                  if (element["name"] == 'OSM' || element["name"] == 'PORTAL') {
                    var marker = L.marker(L.latLng(element["latitude"], element["longitude"]), {
                      icon:L.icon ({
                        iconSize: [1,1],
                        // iconSize: [25,41],
                        iconAnchor: [13,41],
                        iconUrl: 'assets/marker-icon.png',
                        // shadowUrl: 'assets/marker-shadow.png'
                      })
                    }).bindTooltip(`<a>${element["name"]}</a></br><b><span style='height:8px; width:8px; background-color:${this.setStatusColor(element["status"])}; border-radius:50%; display:inline-block; margin-right:3px'></span><span style='color:${this.setStatusColor(element["status"])}'>${element["status"]}</span></b>`, {permanent:true, direction:'bottom' });
                  } else {

                    var marker = L.marker(L.latLng(element["latitude"], element["longitude"]), {
                      icon:L.icon ({
                        iconSize: [1,1],
                        // iconSize: [25,41],
                        iconAnchor: [13,41],
                        iconUrl: 'assets/marker-icon.png',
                        // shadowUrl: 'assets/marker-shadow.png'
                      })
                    }).bindTooltip(`<a>${element["name"]}</a></br><b><span style='height:8px; width:8px; background-color:${this.setStatusColor(element["status"])}; border-radius:50%; display:inline-block; margin-right:3px'></span><span style='color:${this.setStatusColor(element["status"])}'>${element["status"]}</span></b>`, {permanent:true, direction:'top' });
                  }


                  this.mapLayers.push(marker);
                }
              })

              let PORTAL_OSM = L.polyline([L.latLng(38.2466395, 21.734574), L.latLng(40.4167754, -3.7037902)], {weight:3, color:this.setConnectivityStatusColor('PORTAL_OSM')})
              let OSM_5TONIC = L.polyline([L.latLng(40.4167754, -3.7037902), L.latLng(40.4167754, -3.7037902)], {weight:3, color:this.setConnectivityStatusColor('OSM_5TONIC')})
              let OSM_EHEALTH = L.polyline([L.latLng(40.4167754, -3.7037902), L.latLng(52.406374, 16.9251681)], {weight:3, color:this.setConnectivityStatusColor('OSM_EHEALTH')})
              let OSM_IT_AV = L.polyline([L.latLng(40.4167754, -3.7037902), L.latLng(40.6405055, -8.6537539)], {weight:3, color:this.setConnectivityStatusColor('OSM_IT_AV')})
              let OSM_BRISTOL = L.polyline([L.latLng(40.4167754, -3.7037902), L.latLng(51.454513, -2.58791)], {weight:3, color:this.setConnectivityStatusColor('OSM_BRISTOL')})
              let OSM_WINGS = L.polyline([L.latLng(40.4167754, -3.7037902), L.latLng(53.3498053, -6.2603097)], {weight:3, color:this.setConnectivityStatusColor('OSM_WINGS')})
              let OSM_5G_VINO = L.polyline([L.latLng(40.4167754, -3.7037902), L.latLng(39.3621896, 22.942159)], {weight:3, color:this.setConnectivityStatusColor('OSM_5G_VINO')})
              let OSM_UFU = L.polyline([L.latLng(40.4167754, -3.7037902), L.latLng(-18.9127534, -48.275484)], {weight:3, color:this.setConnectivityStatusColor('OSM_UFU')})

              this.mapLayers.push(PORTAL_OSM, OSM_5TONIC, OSM_EHEALTH, OSM_IT_AV, OSM_BRISTOL, OSM_WINGS, OSM_5G_VINO, OSM_UFU)
            }
          )
        }
      )
    })


    let openStreetMaps = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>' })
    this.mapInit = {
      layers: [openStreetMaps],
      zoom: 5,
      center: L.latLng(46.5540527621168, 9.328354404567692)
    };
  }

  setConnectivityStatusColor(link_name) {
    let status = this.dataSource.data.find((element) => { return element['name'] == link_name.replace(/_/g,"-")})['status']
    return this.setStatusColor(status)
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
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  setStatusClass(element) {
    return element.status.toLowerCase()
  }

  setRowClass (row) {
    if (row.status == 'FAIL' || row.status == 'DOWN')
    return 'error-row'
  }
}

export interface Config {
  API: string;
}


// export interface HealthTable {
//     name: string;
//     type: string;
//     location: string;
//     status: string;
//     last_sync: Date;
//     threshold: string;
//     coordinates?: L.LatLng
// }

// const ELEMENT_DATA: HealthTable[] = [
//     {name:'PORTAL', type:'SERVICE', location:'Patras, GR', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '30', coordinates: L.latLng(38.2466395, 21.734574)},
//     {name:'OSM', type:'SERVICE', location:'Madrid, SP', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '30', coordinates: L.latLng(40.4167754, -3.7037902)},
//     {name:'VNF_TEST_DEPLOYMENT', type:'PROCESS', location:'', status:'PASS', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '30'},
//     {name:'MSD_TEST_DEPLOYMENT', type:'PROCESS', location:'', status:'FAIL', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '30'},
//     {name:'5TONIC', type:'INFRASTRUCTURE', location:'Madrid, SP', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '30', coordinates: L.latLng(40.4167754, -3.7037902)},
//     {name:'EHEALTH', type:'INFRASTRUCTURE', location:'Poznan, PL', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '30', coordinates: L.latLng(52.406374, 16.9251681)},
//     {name:'IT-AV', type:'INFRASTRUCTURE', location:'Aveiro, PT', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '30', coordinates: L.latLng(40.6405055, -8.6537539)},
//     {name:'BRISTOL', type:'INFRASTRUCTURE', location:'Bristol, UK', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '30', coordinates: L.latLng(51.454513, -2.58791)},
//     {name:'NITOS', type:'INFRASTRUCTURE', location:'Volos, GR', status:'DOWN', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '30', coordinates: L.latLng(39.3621896, 22.942159)},
//     {name:'WINS', type:'INFRASTRUCTURE', location:'Dublin, IR', status:'DOWN', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '30', coordinates: L.latLng(53.3498053, -6.2603097)},
//     {name:'UFU', type:'INFRASTRUCTURE', location:'Uberlândia, BR', status:'DOWN', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '30', coordinates: L.latLng(-18.9127534, -48.275484)},
//
//     {name:'PORTAL-OSM', type:'LINK', location:'', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '60'},
//     {name:'OSM-5TONIC', type:'LINK', location:'', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '60'},
//     {name:'OSM-EHEALTH', type:'LINK', location:'', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '60'},
//     {name:'OSM-IT-AV', type:'LINK', location:'', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '60'},
//     {name:'OSM-BRISTOL', type:'LINK', location:'', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '60'},
//     {name:'OSM-NITOS', type:'LINK', location:'', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '60'},
//     {name:'OSM-WINS', type:'LINK', location:'', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '60'},
//     {name:'OSM-UFU', type:'LINK', location:'', status:'ALIVE', last_sync:new Date(2018, 5, 21, 10, 28, 33), threshold: '60'}
// ];
