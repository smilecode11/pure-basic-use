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
import PhotoSphereViewer, { Viewer } from "photo-sphere-viewer";
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
      viewer = new Viewer({
        container: viewerRef.value,
        panorama: imgurl1,
        size: {
          width: "100vw",
          height: "60vh"
        },
        plugins: [
          [
            MarkersPlugin,
            {
              markers: [
                {
                  id: "circle",
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
                  id: "circle2",
                  tooltip: "A circle of radius 50",
                  circle: 50,
                  svgStyle: {
                    fill: "rgba(255,255,0,0.3)",
                    stroke: "red",
                    strokeWidth: "2px"
                  },
                  longitude: -1,
                  latitude: -0.5,
                  anchor: "center right"
                }
              ]
            }
          ],
          [
            GalleryPlugin,
            {
              visibleOnLoad: false, //  加载第一个全景图显示图库
              thumbnailSize: { width: 100, height: 50 }
            }
          ]
        ]
      });

      // 加载完成
      viewer.once("ready", () => {
        console.log("_viewer ready");
        // viewer
        //   .animate({
        //     longitude: -1.5,
        //     latitude: -0.28,
        //     speed: 1000
        //   })
        //   .then(() => {
        //     markersPlugin.showMarkerTooltip("circle");
        //   });
        const gallery = viewer.getPlugin(GalleryPlugin);
        gallery.setItems([
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
        ]);

        const markersPlugin = viewer.getPlugin(MarkersPlugin);
        markersPlugin.on("select-marker", (e, marker) => {
          markersPlugin.hideAllTooltips();
          markersPlugin.showMarkerTooltip(marker.id);
        });
      });

      // viewer.addEventListener("click", ({ data }) => {
      //   console.log("_viewer click", data);
      //   if (!data.rightclick) {
      //     markersPlugin.addMarker({
      //       id: "#" + Math.random(),
      //       position: { yaw: data.yaw, pitch: data.pitch },
      //       size: { width: 32, height: 32 },
      //       anchor: "bottom center",
      //       tooltip: "Generated pin",
      //       data: {
      //         generated: true
      //       }
      //     });
      //   }
      // });
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
