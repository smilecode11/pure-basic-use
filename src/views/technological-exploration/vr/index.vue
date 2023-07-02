<template>
  <div class="container">
    <div id="viewer" ref="viewerRef" />
  </div>
</template>

<script lang="ts">
/**
 * [掘金参考] https://juejin.cn/post/6943125751700914213#heading-2
 * [官方参考 v4] https://photo-sphere-viewer-4.netlify.app/plugins/#import-official-plugins
 */

import { defineComponent, ref, onMounted } from "vue";
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers";
import { GalleryPlugin } from "photo-sphere-viewer/dist/plugins/gallery";
import "photo-sphere-viewer/dist/plugins/markers.css";
import "photo-sphere-viewer/dist/plugins/gallery.css";

import imgUrl from "./images/1.jpg";
import imgUrl2 from "./images/2.jpg";
import imgUrl3 from "./images/3.jpg";

export default defineComponent({
  setup() {
    const viewerRef = ref("");
    let viewer = ref("") as any;
    const imgurl1 = imgUrl;

    const init = async () => {
      const markers = [
        {
          id: "point1",
          tooltip: "A circle of radius 30",
          circle: 30,
          svgStyle: {
            fill: "rgba(255,255,0,0.3)",
            stroke: "yellow",
            strokeWidth: "2px"
          },
          longitude: -1.5,
          latitude: -0.28,
          anchor: "center right"
        },
        {
          id: "point2",
          tooltip: "A point2 of radius 40",
          circle: 40,
          svgStyle: {
            fill: "rgba(255,255,0,0.3)",
            stroke: "red",
            strokeWidth: "2px"
          },
          longitude: -2.5,
          latitude: -0.28,
          anchor: "center right"
        },
        {
          id: "point3",
          tooltip: "A point3 of radius 80",
          circle: 80,
          svgStyle: {
            fill: "rgba(255,255,0,0.3)",
            stroke: "green",
            strokeWidth: "4px"
          },
          longitude: 0,
          latitude: 0,
          anchor: "center right"
        }
      ];

      viewer = new Viewer({
        container: viewerRef.value,
        panorama: imgurl1,
        size: {
          width: "100vw",
          height: "80vh"
        },
        // navbar: [],
        plugins: [
          [
            MarkersPlugin,
            {
              markers
            }
          ],
          [
            GalleryPlugin,
            {
              visibleOnLoad: false, //  加载第一个全景图显示图库
              thumbnailSize: { width: 100, height: 50 },
              items: [
                {
                  id: "pano-1",
                  name: "Panorama 1",
                  panorama: imgUrl,
                  thumbnail: imgUrl
                },
                {
                  id: "pano-2",
                  name: "Panorama 2",
                  panorama: imgUrl2,
                  thumbnail: imgUrl2
                },
                {
                  id: "pano-3",
                  name: "Panorama 3",
                  panorama: imgUrl3,
                  thumbnail: imgUrl3
                }
              ]
            }
          ]
        ]
      });

      // 加载完成
      viewer.once("ready", () => {
        viewer.animate({
          longitude: -1.5,
          latitude: -0.28,
          speed: 1000,
          zoom: 0
        });
        const gallery = viewer.getPlugin(GalleryPlugin);
        console.log("_gallery", gallery);

        const markersPlugin = viewer.getPlugin(MarkersPlugin);

        /** 显示指定 markerids, 隐藏其它*/
        const showMarkersWithIdsAndHideAnthor = (ids: string[]) => {
          const showMarkers = markers.filter(marker => ids.includes(marker.id));
          const hideMarkers = markers.filter(
            marker => !ids.includes(marker.id)
          );
          showMarkers.forEach(marker => markersPlugin.showMarker(marker.id));
          hideMarkers.forEach(marker => markersPlugin.hideMarker(marker.id));
        };

        showMarkersWithIdsAndHideAnthor(["point1"]);
        markersPlugin.on("select-marker", (e, marker) => {
          markersPlugin.showMarkerTooltip(marker.id);

          switch (marker.id) {
            case "point1": {
              viewer
                .animate({
                  longitude: marker.config.longitude,
                  latitude: marker.config.latitude,
                  zoom: 100,
                  speed: "-10rpm"
                })
                .then(() => {
                  showMarkersWithIdsAndHideAnthor(["point2"]);
                  viewer.setPanorama(imgUrl2).then(() => {
                    viewer.animate({
                      zoom: 0,
                      speed: "10rpm"
                    });
                  });
                });
              break;
            }
            case "point2": {
              viewer
                .animate({
                  longitude: marker.config.longitude,
                  latitude: marker.config.latitude,
                  zoom: 100,
                  speed: "-10rpm"
                })
                .then(() => {
                  showMarkersWithIdsAndHideAnthor(["point3"]);
                  viewer.setPanorama(imgUrl3).then(() => {
                    viewer.animate({
                      zoom: 0,
                      speed: 800
                    });
                  });
                });

              break;
            }
            case "point3": {
              viewer
                .animate({
                  longitude: marker.config.longitude,
                  latitude: marker.config.latitude,
                  zoom: 100,
                  speed: "-10rpm"
                })
                .then(() => {
                  showMarkersWithIdsAndHideAnthor(["point1"]);
                  viewer.setPanorama(imgUrl).then(() => {
                    viewer.animate({
                      zoom: 10,
                      speed: 800
                    });
                  });
                });

              break;
            }
            default:
              console.log("_未设置 marker", marker);
          }
        });
      });
      // markersPlugin.clearMarkers();
      // markersPlugin.addMarkers();
    };

    onMounted(() => {
      init();
    });

    return {
      viewer,
      viewerRef,
      imgurl1
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  margin: 0 !important;
}
</style>
