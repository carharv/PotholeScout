<template>
  <div>
    <div id="map">
      <div id="heatmap" v-show="heatmapMode">
        <LMap
          style="height: 500px; width: 800px"
          :zoom="13"
          :center="mapCenter"
        >
          <LTileLayer :url="mapUrl" :attribution="mapAttribution"></LTileLayer>
          <LCircleMarker
            v-for="pothole in displayPotholeArr"
            :key="pothole.id"
            :lat-lng="pothole.coordinates"
            :fillOpacity="0.5"
            :fillColor="`#ffa500`"
            :color="`#ffa500`"
            :radius="100"
          >
          </LCircleMarker>
        </LMap>
      </div>
      <div id="singlePointView" v-show="!heatmapMode">
        <LMap
          style="height: 500px; width: 800px"
          :zoom="13"
          :center="mapCenter"
        >
          <LTileLayer :url="mapUrl" :attribution="mapAttribution"></LTileLayer>
          <LMarker
            v-for="pothole in displayPotholeArr"
            :key="pothole.id"
            :lat-lng="pothole.coordinates"
          >
            <LIcon iconUrl="https://ik.imagekit.io/carharv/coneIcon"> </LIcon>
            ></LMarker
          >
        </LMap>
      </div>
    </div>
    <div id="tableDiv" v-show="displayPotholeArr[0] && showReportedCoords">
      <h2>Reported Coordinates</h2>
      <VTable :data="displayPotholeArr">
        <template #head>
          <th>Date</th>
          <th>UID</th>
          <th>lat</th>
          <th>lng</th>
        </template>
        <template #body="{ rows }">
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.dateCreated }}</td>
            <td>{{ row.creatorUID }}</td>
            <td>{{ row.coordinates.lat.slice(0, 8) }}</td>
            <td>{{ row.coordinates.lng.slice(0, 8) }}</td>
          </tr>
        </template>
      </VTable>
    </div>
  </div>
</template>

<script lang="ts">
/* 
To use this component you must first import the component

import DisplayMap from "../components/DisplayMap.vue";
@Component({ components: { DisplayMap } })

Then you must supply the component with the following props: displayPotholeArr (array of type pothole),
 mapCenter (array of number), and heatmapMode (boolean)
*/

import { Vue, Component, Prop } from "vue-property-decorator";
import { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import { Pothole } from "@/datatypes";

@Component({ components: { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } })
export default class DisplayMap extends Vue {
  @Prop() displayPotholeArr!: Array<Pothole>;
  @Prop() mapCenter!: Array<string>;
  @Prop() heatmapMode!: boolean;
  @Prop() showReportedCoords!: boolean;

  geoPos: { lat?: number; lng?: number } = {};
  coneIcon = "https://ik.imagekit.io/carharv/coneIcon";
  mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  mapAttribution =
    "&copy; <a target='_blank' href='http://osm.org/copyright'>OpenStreetMap</a>";
}
</script>

<style scoped>
#map {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#tableDiv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

table {
  margin-top: 8px;
}
table tr:nth-child(odd) {
  background-color: #697cad;
}
table tr:nth-child(even) {
  background-color: #699ead;
}

table tr > td {
  padding: 0.5em;
}
</style>
