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
              
              this.dataSource.data = [{"name":"5GASP PORTAL","description":"Portal Web Component","apikey":"********","status":"UP","type":"SERVICE","mode":"ACTIVE","locationName":"Patras, GR","checkURL":"https://portal.5gasp.eu","latitude":"38.2466395","longitude":"21.734574","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":{"epochSecond":1658497627,"nano":817918163},"failoverThreshold":900,"onIssueNotificationProduct":"Platform","onIssueNotificationComponent":"Portal","issueRaised":false,"secondsDiffFromLastSeen":84,"lastSeenUTC":"2022-07-22T13:47:07.817918163Z UTC"},{"name":"PATRAS OSM","description":"UoP testbed","apikey":"********","status":"UP","type":"SERVICE","mode":"ACTIVE","locationName":"Patras, GR","checkURL":"http://10.10.10.84","latitude":"38.2883435","longitude":"21.7864151","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":{"epochSecond":1658497670,"nano":134599223},"failoverThreshold":1800,"onIssueNotificationProduct":"Infrastructures","onIssueNotificationComponent":"UoP testbed","issueRaised":false,"secondsDiffFromLastSeen":41,"lastSeenUTC":"2022-07-22T13:47:50.134599223Z UTC"},{"name":"IT-AV OSM","description":"ITaV testbed","apikey":"********","status":"UP","type":"SERVICE","mode":"ACTIVE","locationName":"Aveiro, PT","checkURL":"https://atnog-5gasposm.av.it.pt:9999","latitude":"40.6405055","longitude":"-8.6537539","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":null,"failoverThreshold":1800,"onIssueNotificationProduct":"Infrastructures","onIssueNotificationComponent":"ITaV testbed","issueRaised":false,"secondsDiffFromLastSeen":-31557014167219200,"lastSeenUTC":"NEVER"},{"name":"BRISTOL OSM","description":"Bristol testbed","apikey":"********","status":"DOWN","type":"SERVICE","mode":"ACTIVE","locationName":"Bristol, UK","checkURL":"http://172.16.16.17","latitude":"51.454513","longitude":"-2.58791","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":{"epochSecond":1658497668,"nano":468473429},"failoverThreshold":1800,"onIssueNotificationProduct":"Infrastructures","onIssueNotificationComponent":"Bristol testbed","issueRaised":false,"secondsDiffFromLastSeen":43,"lastSeenUTC":"2022-07-22T13:47:48.468473429Z UTC"},{"name":"ORO OSM","description":"ORO testbed","apikey":"********","status":"UP","type":"SERVICE","mode":"ACTIVE","locationName":"Bucuresti, RO","checkURL":"http://172.28.22.168","latitude":"44.4511569","longitude":"26.0864986","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":{"epochSecond":1658497591,"nano":594156127},"failoverThreshold":1800,"onIssueNotificationProduct":"Infrastructures","onIssueNotificationComponent":"ORO testbed","issueRaised":false,"secondsDiffFromLastSeen":120,"lastSeenUTC":"2022-07-22T13:46:31.594156127Z UTC"},{"name":"OdinS OSM","description":"OdinS testbed","apikey":"********","status":"UP","type":"SERVICE","mode":"ACTIVE","locationName":"Al Cantarilla, SP","checkURL":"http://5gasp-gaia5g.inf.um.es:10000","latitude":"37.9594503","longitude":"-1.210614","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":null,"failoverThreshold":1800,"onIssueNotificationProduct":"Infrastructures","onIssueNotificationComponent":"OdinS Testbed","issueRaised":false,"secondsDiffFromLastSeen":-31557014167219200,"lastSeenUTC":"NEVER"},{"name":"ININ OSM","description":"ININ testbed","apikey":"********","status":"DOWN","type":"SERVICE","mode":"ACTIVE","locationName":"Ljubljana, SI","checkURL":"http://172.20.3.100","latitude":"46.0448994","longitude":"14.487042","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":{"epochSecond":1658497540,"nano":934350722},"failoverThreshold":1800,"onIssueNotificationProduct":"Infrastructures","onIssueNotificationComponent":"ININ Testbed","issueRaised":false,"secondsDiffFromLastSeen":171,"lastSeenUTC":"2022-07-22T13:45:40.934350722Z UTC"},{"name":"PORTAL-IT-AV","description":"Connectivity between IT-AV and Portal","apikey":"********","status":"UP","type":"CONNECTIVITY","mode":"PASSIVE","locationName":"","checkURL":"","latitude":"38.2466395","longitude":"21.734574","linkEndLatitude":"40.6405055","linkEndLongitude":"-8.6537539","lastSeen":null,"failoverThreshold":1800,"onIssueNotificationProduct":"Platform","onIssueNotificationComponent":"Connectivity","issueRaised":false,"secondsDiffFromLastSeen":-31557014167219200,"lastSeenUTC":"NEVER"},{"name":"PORTAL-BRISTOL","description":"Connectivity between BRISTOL and Portal","apikey":"********","status":"DOWN","type":"CONNECTIVITY","mode":"PASSIVE","locationName":"","checkURL":"","latitude":"38.2466395","longitude":"21.734574","linkEndLatitude":"51.454513","linkEndLongitude":"-2.58791","lastSeen":{"epochSecond":1658496997,"nano":82974307},"failoverThreshold":1800,"onIssueNotificationProduct":"Platform","onIssueNotificationComponent":"Connectivity","issueRaised":false,"secondsDiffFromLastSeen":714,"lastSeenUTC":"2022-07-22T13:36:37.082974307Z UTC"},{"name":"PORTAL-ORO","description":"Connectivity between ORO and Portal","apikey":"********","status":"UP","type":"CONNECTIVITY","mode":"PASSIVE","locationName":"","checkURL":"","latitude":"38.2466395","longitude":"21.734574","linkEndLatitude":"44.4511569","linkEndLongitude":"26.0864986","lastSeen":{"epochSecond":1658497002,"nano":182667433},"failoverThreshold":1800,"onIssueNotificationProduct":"Platform","onIssueNotificationComponent":"Connectivity","issueRaised":false,"secondsDiffFromLastSeen":709,"lastSeenUTC":"2022-07-22T13:36:42.182667433Z UTC"},{"name":"PORTAL-OdinS","description":"Connectivity between ODinS and Portal","apikey":"********","status":"UP","type":"CONNECTIVITY","mode":"PASSIVE","locationName":"","checkURL":"","latitude":"38.2466395","longitude":"21.734574","linkEndLatitude":"37.9594503","linkEndLongitude":"-1.210614","lastSeen":null,"failoverThreshold":1800,"onIssueNotificationProduct":"Platform","onIssueNotificationComponent":"Connectivity","issueRaised":false,"secondsDiffFromLastSeen":-31557014167219200,"lastSeenUTC":"NEVER"},{"name":"PORTAL-ININ","description":"Connectivity between ININ and Portal","apikey":"********","status":"UP","type":"CONNECTIVITY","mode":"PASSIVE","locationName":"","checkURL":"","latitude":"38.2466395","longitude":"21.734574","linkEndLatitude":"46.0448994","linkEndLongitude":"14.487042","lastSeen":{"epochSecond":1658497007,"nano":295565311},"failoverThreshold":1800,"onIssueNotificationProduct":"Platform","onIssueNotificationComponent":"Connectivity","issueRaised":false,"secondsDiffFromLastSeen":704,"lastSeenUTC":"2022-07-22T13:36:47.295565311Z UTC"}]

              this.dataSource.data.forEach( (element:Components) => {
                if (element.latitude && element.longitude)
                {
                  if (element.type === 'SERVICE' || element.type === 'VIM') {
                    
                    if (element.name.toLowerCase().includes('portal')) {
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

var data1 = [{"name":"5GASP PORTAL","description":"Portal Web Component","apikey":"********","status":"UP","type":"SERVICE","mode":"ACTIVE","locationName":"Patras, GR","checkURL":"https://portal.5gasp.eu","latitude":"38.2466395","longitude":"21.734574","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":{"epochSecond":1658497627,"nano":817918163},"failoverThreshold":900,"onIssueNotificationProduct":"Platform","onIssueNotificationComponent":"Portal","issueRaised":false,"secondsDiffFromLastSeen":84,"lastSeenUTC":"2022-07-22T13:47:07.817918163Z UTC"},{"name":"PATRAS OSM","description":"UoP testbed","apikey":"********","status":"UP","type":"SERVICE","mode":"ACTIVE","locationName":"Patras, GR","checkURL":"http://10.10.10.84","latitude":"38.2883435","longitude":"21.7864151","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":{"epochSecond":1658497670,"nano":134599223},"failoverThreshold":1800,"onIssueNotificationProduct":"Infrastructures","onIssueNotificationComponent":"UoP testbed","issueRaised":false,"secondsDiffFromLastSeen":41,"lastSeenUTC":"2022-07-22T13:47:50.134599223Z UTC"},{"name":"IT-AV OSM","description":"ITaV testbed","apikey":"********","status":"UP","type":"SERVICE","mode":"ACTIVE","locationName":"Aveiro, PT","checkURL":"https://atnog-5gasposm.av.it.pt:9999","latitude":"40.6405055","longitude":"-8.6537539","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":null,"failoverThreshold":1800,"onIssueNotificationProduct":"Infrastructures","onIssueNotificationComponent":"ITaV testbed","issueRaised":false,"secondsDiffFromLastSeen":-31557014167219200,"lastSeenUTC":"NEVER"},{"name":"BRISTOL OSM","description":"Bristol testbed","apikey":"********","status":"DOWN","type":"SERVICE","mode":"ACTIVE","locationName":"Bristol, UK","checkURL":"http://172.16.16.17","latitude":"51.454513","longitude":"-2.58791","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":{"epochSecond":1658497668,"nano":468473429},"failoverThreshold":1800,"onIssueNotificationProduct":"Infrastructures","onIssueNotificationComponent":"Bristol testbed","issueRaised":false,"secondsDiffFromLastSeen":43,"lastSeenUTC":"2022-07-22T13:47:48.468473429Z UTC"},{"name":"ORO OSM","description":"ORO testbed","apikey":"********","status":"UP","type":"SERVICE","mode":"ACTIVE","locationName":"Bucuresti, RO","checkURL":"http://172.28.22.168","latitude":"44.4511569","longitude":"26.0864986","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":{"epochSecond":1658497591,"nano":594156127},"failoverThreshold":1800,"onIssueNotificationProduct":"Infrastructures","onIssueNotificationComponent":"ORO testbed","issueRaised":false,"secondsDiffFromLastSeen":120,"lastSeenUTC":"2022-07-22T13:46:31.594156127Z UTC"},{"name":"OdinS OSM","description":"OdinS testbed","apikey":"********","status":"UP","type":"SERVICE","mode":"ACTIVE","locationName":"Al Cantarilla, SP","checkURL":"http://5gasp-gaia5g.inf.um.es:10000","latitude":"37.9594503","longitude":"-1.210614","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":null,"failoverThreshold":1800,"onIssueNotificationProduct":"Infrastructures","onIssueNotificationComponent":"OdinS Testbed","issueRaised":false,"secondsDiffFromLastSeen":-31557014167219200,"lastSeenUTC":"NEVER"},{"name":"ININ OSM","description":"ININ testbed","apikey":"********","status":"DOWN","type":"SERVICE","mode":"ACTIVE","locationName":"Ljubljana, SI","checkURL":"http://172.20.3.100","latitude":"46.0448994","longitude":"14.487042","linkEndLatitude":null,"linkEndLongitude":null,"lastSeen":{"epochSecond":1658497540,"nano":934350722},"failoverThreshold":1800,"onIssueNotificationProduct":"Infrastructures","onIssueNotificationComponent":"ININ Testbed","issueRaised":false,"secondsDiffFromLastSeen":171,"lastSeenUTC":"2022-07-22T13:45:40.934350722Z UTC"},{"name":"PORTAL-IT-AV","description":"Connectivity between IT-AV and Portal","apikey":"********","status":"UP","type":"CONNECTIVITY","mode":"PASSIVE","locationName":"","checkURL":"","latitude":"38.2466395","longitude":"21.734574","linkEndLatitude":"40.6405055","linkEndLongitude":"-8.6537539","lastSeen":null,"failoverThreshold":1800,"onIssueNotificationProduct":"Platform","onIssueNotificationComponent":"Connectivity","issueRaised":false,"secondsDiffFromLastSeen":-31557014167219200,"lastSeenUTC":"NEVER"},{"name":"PORTAL-BRISTOL","description":"Connectivity between BRISTOL and Portal","apikey":"********","status":"DOWN","type":"CONNECTIVITY","mode":"PASSIVE","locationName":"","checkURL":"","latitude":"38.2466395","longitude":"21.734574","linkEndLatitude":"51.454513","linkEndLongitude":"-2.58791","lastSeen":{"epochSecond":1658496997,"nano":82974307},"failoverThreshold":1800,"onIssueNotificationProduct":"Platform","onIssueNotificationComponent":"Connectivity","issueRaised":false,"secondsDiffFromLastSeen":714,"lastSeenUTC":"2022-07-22T13:36:37.082974307Z UTC"},{"name":"PORTAL-ORO","description":"Connectivity between ORO and Portal","apikey":"********","status":"UP","type":"CONNECTIVITY","mode":"PASSIVE","locationName":"","checkURL":"","latitude":"38.2466395","longitude":"21.734574","linkEndLatitude":"44.4511569","linkEndLongitude":"26.0864986","lastSeen":{"epochSecond":1658497002,"nano":182667433},"failoverThreshold":1800,"onIssueNotificationProduct":"Platform","onIssueNotificationComponent":"Connectivity","issueRaised":false,"secondsDiffFromLastSeen":709,"lastSeenUTC":"2022-07-22T13:36:42.182667433Z UTC"},{"name":"PORTAL-OdinS","description":"Connectivity between ODinS and Portal","apikey":"********","status":"UP","type":"CONNECTIVITY","mode":"PASSIVE","locationName":"","checkURL":"","latitude":"38.2466395","longitude":"21.734574","linkEndLatitude":"37.9594503","linkEndLongitude":"-1.210614","lastSeen":null,"failoverThreshold":1800,"onIssueNotificationProduct":"Platform","onIssueNotificationComponent":"Connectivity","issueRaised":false,"secondsDiffFromLastSeen":-31557014167219200,"lastSeenUTC":"NEVER"},{"name":"PORTAL-ININ","description":"Connectivity between ININ and Portal","apikey":"********","status":"UP","type":"CONNECTIVITY","mode":"PASSIVE","locationName":"","checkURL":"","latitude":"38.2466395","longitude":"21.734574","linkEndLatitude":"46.0448994","linkEndLongitude":"14.487042","lastSeen":{"epochSecond":1658497007,"nano":295565311},"failoverThreshold":1800,"onIssueNotificationProduct":"Platform","onIssueNotificationComponent":"Connectivity","issueRaised":false,"secondsDiffFromLastSeen":704,"lastSeenUTC":"2022-07-22T13:36:47.295565311Z UTC"}]