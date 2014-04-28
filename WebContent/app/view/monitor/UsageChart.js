// for OP
Ext.define('Ecfa.view.monitor.UsageChart', {
	extend : 'Ecfa.ux.chart.Highcharts',
	alias : 'widget.usageChart',
	layout : 'fit',
	// store : 'monitor.Cpu',
	hostId : null,
	hostname : null,
	chartTitle : null,
	maxYaxis : null,
	unitFormatLabel : '',
	interval : null,
	timer : null,
	seriesData : [ {
		name : null,
		data : [],
		dataIndex : null
	} ],
	addPointSeries : null,
	legendOn : false,
	initialPointNum : 10,

	initComponent : function() {
		var me = this;

		me.series = me.seriesData;

		me.chartConfig = {
			chart : {
				defaultSeriesType : 'line',
				marginLeft : 100,
				marginRight : 130,
				marginBottom : 120,
				// zoomType : 'x',
				animation : Highcharts.svg,
				events : {
					load : function() {
						// set up the updating of the chart each interval
						// clear old series
						for ( var i = 0; i < this.series.length; i++) {
							this.series[i].setData([], true);
						}
						// console.log('load',me.hostId);
						me.addPointSeries = this.series;
						if (me.hostId != null) {
							me.getInitialPoints(me.addPointSeries);
							//me.getPoint(me.addPointSeries, 0, 1);
						}
					}
				}
			},
			title : {
				text : me.chartTitle,
				x : -20
			},
			subtitle : {
				x : -20
			},
			rangeSelector : {
				buttons : [ {
					count : 1,
					type : 'minute',
					text : '1M'
				}, {
					count : 5,
					type : 'minute',
					text : '5M'
				}, {
					type : 'all',
					text : 'All'
				} ],
				inputEnabled : false,
				selected : 0
			},
			xAxis : [ {
				title : {
					text : 'Time',
					type : 'datetime',
					tickPixelInterval : 150,
					tickInterval : 1
				},
				labels : {
					formatter : function() {
						return Ext.util.Format.date(new Date(this.value), "H:i:s");
					}
				}
			} ],
			yAxis : {
				title : {
					text : 'Usage'
				},
				min : 0,
				max : me.maxYaxis,
				labels : {
					formatter : function() {
						return Math.round(this.value) + ' ' + me.unitFormatLabel;
					}
				},
				plotLines : [ {
					value : 0,
					width : 5,
					color : '#808080'
				} ]
			},
			tooltip : {
				formatter : function() {
					var dt = Ext.Date.parse(parseInt(this.x) / 1000, "U");
					return '<b>' + this.series.name + ' : ' + this.y + '</b><br>' + Ext.Date.format(dt, "H:i:s");
				}
			}, // area
			plotOptions : {
				area : {
					fillColor : {
						linearGradient : {
							x1 : 0,
							y1 : 0,
							x2 : 0,
							y2 : 1
						},
						stops : [ [ 0, Highcharts.getOptions().colors[0] ],
								[ 1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba') ] ]
					},
					lineWidth : 1,
					marker : {
						enabled : true
					},
					shadow : false,
					states : {
						hover : {
							lineWidth : 1
						}
					},
					threshold : null
				}
			},
			legend : {
				enabled : me.legendOn,
				layout : 'vertical',
				align : 'right',
				verticalAlign : 'top',
				x : -10,
				y : 100,
				borderWidth : 0
			}
		},

		me.callParent(arguments);

		Ecfa.event.HostUsageChart.on({
			destroyed : function() {
				me.load(me.hostId);
			},
			created : function(rec, op) {
				me.load(me.hostId);
			},
			updated : function(rec, op) {
				me.load(me.hostId);
			},
			fail : function(rec, op) {

			},
			running : function(isRunning) {
				me.setLoading(isRunning);
			}
		});
	},

	load : function(hostId, name) {
		var me = this;

		me.hostId = hostId;
		me.setSubTitle(name + '-' + Locale.getMsg('view.monitor.interval') + ':' + (me.interval / 1000) + Locale.getMsg('view.common.sec'));
		me.series.name = name;
	},
	setTimer : function() {
		var me = this;
		//console.log('setTimer', me.hostId);
		var maxSamples = 8, count = 0;
		me.timer = setInterval(function() { me.getPoint(me.addPointSeries, ++count, maxSamples); }, me.interval);		
	},
	stopTimer : function() {
		var me = this;
		//console.log('stopTimer', me.timer);
		clearInterval(me.timer);
		me.clearChart();
	},
	clearChart : function() {
		var me = this;
		me.setSubTitle(null);
		me.series.name = null;
		// me.hostId = null;
	},
	getInitialPoints : function(series) {
		var me = this;
		var x = null, y = null;
		//console.log('initialPoints');

		Ecfa.Restful.request({
			record : me.hostId,
			method : 'GET',
			url : me.store.getProxy().url + '/history/' + me.hostId,
			success : function(rec, op) {
				if (this.record === me.hostId && series != null) { // Prevent series becomes undefined when switching host
					for ( var i = 0; i < rec.target.length; i++) {
						x = rec.target[i].time;
						y = rec.target[i].amount;						
						if (rec.target.length > me.initialPointNum){ // Network
							//console.log('* network : x,y', x, y, i % 2);
							series[i % 2].addPoint([ x, y ]);
						}
						else {//CPU
							//console.log('* CPU : x,y', x, y);
							y = Math.round(y);
							series[0].addPoint([ x, y ]);
						}
					}
				}
			},
			failure : function(rec, op) {
				console.log('fail', rec, op);
				Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.monitor.hostUsage.fail'), rec.error));
			}
		});
	},
	getPoint : function(series, count, maxSamples) {
		var me = this;
		var x = null, y = null;

		Ecfa.Restful.request({
			record : me.hostId,
			method : 'GET',
			url : me.store.getProxy().url + '/' + me.hostId,
			success : function(rec, op) {
				// console.log('success',rec,op);

				if (this.record === me.hostId) { // Prevent series becomes undefined when switching host
					if (Ext.isArray(rec.target)) {// Network
						for ( var i = 0; i < rec.target.length; i++) {
							x = rec.target[i].time;
							y = rec.target[i].amount;
							console.log('network : x,y', x, y, series[i], typeof (series[i]));
							if (typeof (series[i]) != 'undefined') {
								//series[i].addPoint([ x, y ], true, (count >= maxSamples));
								series[i].addPoint([ x, y ],true , true);
							}
						}
					} else { // CPU
						x = rec.target.time;
						y = Math.round(rec.target.amount);
						console.log('cpu : x,y', x, y, series[0], typeof (series[0]));
						if (typeof (series[0]) != 'undefined') {
							//series[0].addPoint([ x, y ], true, (count >= maxSamples));
							series[0].addPoint([ x, y ],true , true);
						}
					}
				}
			},
			failure : function(rec, op) {
				console.log('fail', rec, op);
				Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.monitor.hostUsage.fail'), rec.error));
			}
		});
	}
});
