(function() {
    "use strict";
    var a = this,
        b = a.Chart,
        c = b.helpers,
        d = {
            scaleBeginAtZero: !0,
            scaleShowGridLines: !0,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            barShowStroke: !0,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
        };
    b.Type.extend({
        name: "Bar",
        defaults: d,
        initialize: function(a) {
            var d = this.options;
            this.ScaleClass = b.Scale.extend({
                offsetGridLines: !0,
                calculateBarX: function(a, b, c) {
                    var e = this.calculateBaseWidth(),
                        f = this.calculateX(c) - e / 2,
                        g = this.calculateBarWidth(a);
                    return f + g * b + b * d.barDatasetSpacing + g / 2
                },
                calculateBaseWidth: function() {
                    return this.calculateX(1) - this.calculateX(0) - 2 * d.barValueSpacing
                },
                calculateBarWidth: function(a) {
                    var b = this.calculateBaseWidth() - (a - 1) * d.barDatasetSpacing;
                    return b / a
                }
            }), this.datasets = [], this.options.showTooltips && c.bindEvents(this, this.options.tooltipEvents, function(a) {
                var b = "mouseout" !== a.type ? this.getBarsAtEvent(a) : [];
                this.eachBars(function(a) {
                    a.restore(["fillColor", "strokeColor"])
                }), c.each(b, function(a) {
                    a.fillColor = a.highlightFill, a.strokeColor = a.highlightStroke
                }), this.showTooltip(b)
            }), this.BarClass = b.Rectangle.extend({
                strokeWidth: this.options.barStrokeWidth,
                showStroke: this.options.barShowStroke,
                ctx: this.chart.ctx
            }), c.each(a.datasets, function(b, d) {
                var e = {
                    label: b.label || null,
                    fillColor: b.fillColor,
                    strokeColor: b.strokeColor,
                    bars: []
                };
                this.datasets.push(e), c.each(b.data, function(c, d) {
                    e.bars.push(new this.BarClass({
                        value: c,
                        label: a.labels[d],
                        datasetLabel: b.label,
                        strokeColor: b.strokeColor,
                        fillColor: b.fillColor,
                        highlightFill: b.highlightFill || b.fillColor,
                        highlightStroke: b.highlightStroke || b.strokeColor
                    }))
                }, this)
            }, this), this.buildScale(a.labels), this.BarClass.prototype.base = this.scale.endPoint, this.eachBars(function(a, b, d) {
                c.extend(a, {
                    width: this.scale.calculateBarWidth(this.datasets.length),
                    x: this.scale.calculateBarX(this.datasets.length, d, b),
                    y: this.scale.endPoint
                }), a.save()
            }, this), this.render()
        },
        update: function() {
            this.scale.update(), c.each(this.activeElements, function(a) {
                a.restore(["fillColor", "strokeColor"])
            }), this.eachBars(function(a) {
                a.save()
            }), this.render()
        },
        eachBars: function(a) {
            c.each(this.datasets, function(b, d) {
                c.each(b.bars, a, this, d)
            }, this)
        },
        getBarsAtEvent: function(a) {
            for (var b, d = [], e = c.getRelativePosition(a), f = function(a) {
                d.push(a.bars[b])
            }, g = 0; g < this.datasets.length; g++)
                for (b = 0; b < this.datasets[g].bars.length; b++)
                    if (this.datasets[g].bars[b].inRange(e.x, e.y)) return c.each(this.datasets, f), d;
            return d
        },
        buildScale: function(a) {
            var b = this,
                d = function() {
                    var a = [];
                    return b.eachBars(function(b) {
                        a.push(b.value)
                    }), a
                },
                e = {
                    templateString: this.options.scaleLabel,
                    height: this.chart.height,
                    width: this.chart.width,
                    ctx: this.chart.ctx,
                    textColor: this.options.scaleFontColor,
                    fontSize: this.options.scaleFontSize,
                    fontStyle: this.options.scaleFontStyle,
                    fontFamily: this.options.scaleFontFamily,
                    valuesCount: a.length,
                    beginAtZero: this.options.scaleBeginAtZero,
                    integersOnly: this.options.scaleIntegersOnly,
                    calculateYRange: function(a) {
                        var b = c.calculateScaleRange(d(), a, this.fontSize, this.beginAtZero, this.integersOnly);
                        c.extend(this, b)
                    },
                    xLabels: a,
                    font: c.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
                    lineWidth: this.options.scaleLineWidth,
                    lineColor: this.options.scaleLineColor,
                    gridLineWidth: this.options.scaleShowGridLines ? this.options.scaleGridLineWidth : 0,
                    gridLineColor: this.options.scaleShowGridLines ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
                    padding: this.options.showScale ? 0 : this.options.barShowStroke ? this.options.barStrokeWidth : 0,
                    showLabels: this.options.scaleShowLabels,
                    display: this.options.showScale
                };
            this.options.scaleOverride && c.extend(e, {
                calculateYRange: c.noop,
                steps: this.options.scaleSteps,
                stepValue: this.options.scaleStepWidth,
                min: this.options.scaleStartValue,
                max: this.options.scaleStartValue + this.options.scaleSteps * this.options.scaleStepWidth
            }), this.scale = new this.ScaleClass(e)
        },
        addData: function(a, b) {
            c.each(a, function(a, c) {
                this.datasets[c].bars.push(new this.BarClass({
                    value: a,
                    label: b,
                    x: this.scale.calculateBarX(this.datasets.length, c, this.scale.valuesCount + 1),
                    y: this.scale.endPoint,
                    width: this.scale.calculateBarWidth(this.datasets.length),
                    base: this.scale.endPoint,
                    strokeColor: this.datasets[c].strokeColor,
                    fillColor: this.datasets[c].fillColor
                }))
            }, this), this.scale.addXLabel(b), this.update()
        },
        removeData: function() {
            this.scale.removeXLabel(), c.each(this.datasets, function(a) {
                a.bars.shift()
            }, this), this.update()
        },
        reflow: function() {
            c.extend(this.BarClass.prototype, {
                y: this.scale.endPoint,
                base: this.scale.endPoint
            });
            var a = c.extend({
                height: this.chart.height,
                width: this.chart.width
            });
            this.scale.update(a)
        },
        draw: function(a) {
            var b = a || 1;
            this.clear();
            this.chart.ctx;
            this.scale.draw(b), c.each(this.datasets, function(a, d) {
                c.each(a.bars, function(a, c) {
                    a.hasValue() && (a.base = this.scale.endPoint, a.transition({
                        x: this.scale.calculateBarX(this.datasets.length, d, c),
                        y: this.scale.calculateY(a.value),
                        width: this.scale.calculateBarWidth(this.datasets.length)
                    }, b).draw())
                }, this)
            }, this)
        }
    })
}).call(this);