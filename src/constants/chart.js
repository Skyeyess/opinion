import i18n from '../language';
let maskImage = new Image();
maskImage.src = 'static/image/wordCloud.png';
export default {
    chartLine: {
        grid: {
            top: 35,
            left: 5,
            right: 25,
            bottom: 0,
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            enterable: true,
            axisPointer: {
                lineStyle: {
                    color: '#40c6f1'
                }
            }
        },
        xAxis: {
            type: 'category',
            axisLine: false,
            splitLine: false,
            axisLabel: {
                textStyle: {
                    color: '#333'
                },
                interval: 0
            },
            axisTick: false,
            boundaryGap: false,
            data: []
        },
        yAxis: {
            axisTick: false,
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#f1f1f1'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['#fff']
                }
            },
            axisLine: false,
            axisLabel: {
                textStyle: {
                    color: '#333'
                }
            },
            type: 'value'
        },
        series: [
            {
                name: i18n.t('opinion.mediaUnit'),
                type: 'line',
                smooth: true,
                smoothMonotone: 'x',
                itemStyle: {
                    normal: {
                        color: '#40c6f1',
                        lineStyle: {
                            color: '#40c6f1'
                        }
                    },
                    emphasis: {
                        color: '#40c6f1'
                    }
                },
                areaStyle: {
                    normal: {
                        color: '#e3f4fc'
                    }
                },
                data: [],
                markPoint: {
                    symbolSize: 20,
                    itemStyle: {
                        normal: {
                            color: '#4e87f9'
                        }
                    },
                    label: {
                        normal: {
                            position: 'top',
                            textStyle: {
                                fontSize: 8
                            }
                        }
                    },
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                }
            }
        ]
    },
    chartBar: {
        tooltip: {
            trigger: 'axis',
            enterable: true,
            axisPointer: {
                lineStyle: {
                    color: 'transparent'
                }
            }
        },
        grid: {
            top: 60,
            left: 25,
            right: 25,
            bottom: 60,
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                axisLine: false,
                splitLine: false,
                axisTick: false,
                axisLabel: {
                    interval: 0,
                    rotate: 80,
                    // formatter: function (e) {
                    //     if (e && e.split) {
                    //         return e.split('').join('\n')
                    //     } else {
                    //         return e;
                    //     }
                    // },
                    textStyle: {
                        color: '#333',
                        fontSize: '18px'
                    }
                },
                data: []
            }
        ],
        dataZoom: {
            show: true,
            type: 'inside',
            startValue: 0,
            endValue: 8
        },
        yAxis: [
            {
                axisTick: false,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#f1f1f1'
                    }
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['#fff']
                    }
                },
                axisLine: false,
                axisLabel: {
                    textStyle: {
                        color: '#333'
                    }
                },
                type: 'value'
            }
        ],
        series: [
            {
                name: i18n.t('opinion.spreadUnit'),
                type: 'bar',
                barWidth: 10,
                markPoint: {
                    symbolSize: 20,
                    label: {
                        normal: {
                            position: 'top',
                            textStyle: {
                                fontSize: 8
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#4e87f9'
                        }
                    },
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                itemStyle: {
                    normal: {
                        color: '#96dbef',
                        barBorderRadius: 50,
                        fontSize: 10,
                        lineStyle: {
                            color: '#40c6f1'
                        }
                    },
                    emphasis: {
                        color: '#fdbd26'
                    }
                },
                data: []
            }
        ]
    },
    chartPie: {
        tooltip: {
            trigger: 'item',
            enterable: true
        },
        color: ['#75b3f2', '#d9f2fd', '#5985ff'],
        series: [
            {
                name: i18n.t('opinion.attributes'),
                type: 'pie',
                data: [
                    { name: '正面', map: '', value: 0, media: 0 },
                    { name: '中性', map: '', value: 0, media: 1, labelLine: { normal: { lineStyle: { color: '#a1b4da' } } }, label: { normal: { textStyle: { color: '#a1b4da' } } } },
                    { name: '敏感', map: '负面', value: 0, media: 2 }
                ]
            }
        ]
    },
    chartHollow: {
        tooltip: {
            trigger: 'item',
            enterable: true
        },
        color: ['#5179f2', '#539ff5', '#69b0f5', '#52c1fe', '#85d5f9'],
        series: [
            {
                name: i18n.t('opinion.spreadUnit'),
                type: 'pie',
                radius: ['50%', '70%'],
                data: [],
                labelLine: {
                    normal: {
                        length: 5,
                        length2: 5
                    }
                }

            }
        ]
    },
    chartRadar: {
        tooltip: {
            trigger: 'item',
            enterable: true
        },
        radar: {
            nameGap: 10,
            name: {
                textStyle: {
                    color: '#a1b4da'
                }
            },
            splitArea: { show: false },
            splitLine: { lineStyle: { color: '#c1ccd1' } },
            indicator: [
                { name: '其他', axisLabel: { show: true, textStyle: { color: '#333' } }, max: 10 },
                { name: '社会责任', max: 10 },
                { name: '企业动态', max: 10 },
                { name: '营销活动', max: 10 }
            ]
        },
        series: [{
            type: 'radar',
            name: ['其他', '社会责任', '企业动态', '营销活动'],
            lineStyle: {
                normal: {
                    color: '#4e87f9'
                }
            },
            itemStyle: {
                normal: {
                    color: '#4e87f9'
                }
            },
            areaStyle: {
                normal: {
                    color: '#c3ecfd'
                }
            },
            data: [
                {
                    value: [0, 0, 0, 0],
                    name: i18n.t('opinion.spreadUnit')

                }
            ]
        }]
    },
    chartWord: {
        tooltip: {
            show: false
        },
        series: [{
            name: '权重分析',
            type: 'wordCloud',
            sizeRange: [12, 28],
            maskImage: maskImage,
            rotationRange: [0, 0],
            shape: 'pentagon',
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            textPadding: 0,
            autoSize: {
                enable: true,
                minSize: 6
            },
            textStyle: {
                normal: {
                    fontWeight: 'bold',
                    color: function (item) {
                        if (item.dataIndex < 13) {
                            return '#6d9dfb';
                        } else if (item.dataIndex < 25) {
                            return '#91a2c3'
                        } else if (item.dataIndex < 37) {
                            return '#c1cadc'
                        } else {
                            return '#b4c3e2'
                        }
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: []
        }]
    },
    chartGraph: {
        series: [{
            name: '',
            type: 'graph',
            layout: 'force',
            force: {
                initLayout: 'circular',
                repulsion: 300
            },
            data: [],
            links: [],
            focusNodeAdjacency: true,
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        fontSize: 14
                    }
                }
            },
            lineStyle: {
                normal: {
                    color: '#91a2c3',
                    curveness: 0,
                    type: 'solid'
                }
            }
        }]
    },
    barStaticData: {
        data: [' ']
    },
    hollowStaticData: {
        other: '其他',
        map: {
            'app': 'APP',
            'tieba': '贴吧',
            'weixin': '微信',
            'blog': '博客',
            'bbs': '论坛',
            'newspaper': '报纸',
            'micro-blog': '微博',
            'web': '网站',
            'magazine': '杂志'
        },
        data: [{ name: 'APP', value: 0, media: 'app' }, { name: '贴吧', value: 0, media: 'tieba' }, { name: '微信', value: 0, media: 'weixin' }, { name: '博客', value: 0, media: 'blog' }, { name: '论坛', value: 0, media: 'bbs' }, { name: '报纸', value: 0, media: 'newspaper' }, { name: '微博', value: 0, media: 'micro-blog' }, { name: '网站', value: 0, media: 'web' }, { name: '杂志', value: 0, media: 'magazine' }]
    }
}
