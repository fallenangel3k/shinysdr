// Copyright 2014, 2015, 2016, 2017 Kevin Reid <kpreid@switchb.org>
//
// This file is part of ShinySDR.
//
// ShinySDR is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// ShinySDR is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with ShinySDR.  If not, see <http://www.gnu.org/licenses/>.

define(['map/map-core', 'widgets'], function(mapCore, widgets) {
  'use strict';

  var BlockSet = widgets.BlockSet;
  var Block = widgets.Block;
  var renderTrackFeature = mapCore.renderTrackFeature;

  var exports = {};

  function WSPRWidget(config) {
    Block.call(this, config, function (block, addWidget, ignore, setInsertion, setToDetails, getAppend) {
      addWidget('track', widgets.TrackWidget);
    }, false);
  }

  // TODO: Better widget-plugin system so we're not modifying should-be-static tables
  widgets['interface:shinysdr.plugins.mode_s.IWSPRStation'] = WSPRWidget;

  function addWSPRMapLayer(mapPluginConfig) {
    mapPluginConfig.addLayer('WSPR', {
      featuresCell: mapPluginConfig.index.implementing('shinysdr.plugins.wspr.telemetry.IWSPRStation'),
      featureRenderer: function renderWSPR(station, dirty) {
        var callsign = station.call.depend(dirty);
        if (callsign === null) {
          callsign = '?';
        }

        var f = renderTrackFeature(dirty, station.track, callsign);
        f.iconURL = '/client/plugins/shinysdr.plugins.wspr/w.svg';
        return f;
      }
    });
  }

  mapCore.register(addWSPRMapLayer);

  return Object.freeze(exports);
});
