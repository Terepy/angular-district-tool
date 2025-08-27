import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import * as geojson from 'geojson'
import { MapMarkerService } from '../services/map-marker.service';
import { MapShapeService } from '../services/map-shape.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-district-map',
  standalone: true,
  imports: [],
  templateUrl: './district-map.component.html',
  styleUrl: './district-map.component.css'
})
export class DistrictMapComponent implements AfterViewInit {
  private map: L.Map | undefined;
  private states: geojson.GeoJSON | undefined;

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.791000, -86.148003],
      zoom: 12
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map)
  }

  constructor (private markerService: MapMarkerService, private shapeService: MapShapeService) {
    this.map = undefined
    this.states = undefined
  }

  private highlightFeature(e: L.LeafletMouseEvent) {
  const layer = e.target;

  layer.setStyle({
    weight: 10,
    opacity: 1.0,
    color: '#DFA612',
    fillOpacity: 1.0,
    fillColor: '#FAE042'
  });
}

private resetFeature(e: L.LeafletMouseEvent) {
  const layer = e.target;

  layer.setStyle({
    weight: 3,
    opacity: 0.5,
    color: '#008f68',
    fillOpacity: 0.8,
    fillColor: '#6DB65B'
  });
}

  private initStatesLayer() {
    if (this.states && this.map) {
      const stateLayer = L.geoJSON(this.states, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B'
      }),
      onEachFeature: (feature, layer) => (
      layer.on({
        mouseover: (e) => (this.highlightFeature(e)),
        mouseout: (e) => (this.resetFeature(e)),
      })
    )
    });

    this.map.addLayer(stateLayer);
    stateLayer.bringToBack();
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
    if (this.map) {
      this.markerService.makeCapitalCircleMarkers(this.map);
      this.shapeService.getStateShapes().subscribe(states => {
      this.states = states as geojson.GeoJSON;
      this.initStatesLayer()
    });
    }
  }
}
