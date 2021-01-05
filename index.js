/*
 * =================导航条===================*/
{
  let nav = document.getElementById("nav");
  let child = nav.children;
  nav.addEventListener("click", (e) => {
    e = e || event;
    let target = e.target || e.srcElement;
    if (target.nodeName.toLocaleLowerCase() === "a") {
      for (let i = 0; i < child.length; ++i) {
        child[i].classList.remove("active");
      }
      target.parentNode.classList.add("active");
    }
  });
}

/*
 * =================轮播图===================*/
{
  const slider = document.getElementById("slider");
  let items = slider.children[0].children;
  let itemsLen = items.length;
  const itemW = items[0].clientWidth;
  let points = slider.children[1].children;

  let nowIdx = 0;
  for (let i = 0; i < itemsLen; ++i) {
    if (i === 0) {
      items[i].style.left = 0;
      points[i].classList.add("active");
    } else {
      items[i].style.left = itemW + "px";
    }
    points[i].setAttribute("value", i);
  }

  let timer = setInterval(next, 1000);

  function next() {
    animate(items[nowIdx], "left", -itemW);
    nowIdx = ++nowIdx > itemsLen - 1 ? 0 : nowIdx;
    items[nowIdx].style.left = itemW + "px";
    animate(items[nowIdx], "left", 0);

    lightPoint();
  }

  function prev() {
    animate(items[nowIdx], "left", itemW);
    nowIdx = --nowIdx < 0 ? items.length - 1 : nowIdx;
    items[nowIdx].style.left = -itemW + "px";
    animate(items[nowIdx], "left", 0);

    lightPoint();
  }

  function lightPoint() {
    for (let i = 0; i < points.length; ++i) {
      points[i].classList.remove("active");
    }
    points[nowIdx].classList.add("active");
  }

  let times = new Date();
  document.getElementById("prev").addEventListener("click", () => {
    if (new Date() - times > 500) {
      times = new Date();
      prev();
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    if (new Date() - times > 500) {
      times = new Date();
      next();
    }
  });

  slider.addEventListener("mouseenter", () => {
    clearInterval(timer);
  });
  slider.addEventListener("mouseleave", () => {
    timer = setInterval(next, 1000);
  });

  slider.children[1].addEventListener("click", (e) => {
    e = e || event;
    let target = e.target || e.srcElement;
    if (target.nodeName.toLocaleLowerCase() === "li") {
      let index = target.getAttribute("value");
      if (index > nowIdx) {
        items[index].style.left = itemW + "px";
        animate(items[nowIdx], "left", -itemW);
        animate(items[index], "left", 0);
        nowIdx = index;
      }
      if (index < nowIdx) {
        items[index].style.left = -itemW + "px";
        animate(items[nowIdx], "left", itemW);
        animate(items[index], "left", 0);
        nowIdx = index;
      }
      lightPoint();
    }
  });

  function animate(obj, attr, target) {
    clearInterval(obj.timer);
    let finished = true;

    obj.timer = setInterval(() => {
      let curVal = parseInt(getComputedStyle(obj, false)[attr]);

      let speed = (target - curVal) / 2;
      speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

      if (curVal !== target) {
        finished = false;
      } else {
        finished = true;
      }

      obj.style[attr] = curVal + speed + "px";

      if (finished) {
        clearInterval(obj.timer);
      }
    }, 30);
  }
}

const getData = (url) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      }
    };
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();
  });
  return promise;
};

/*
 * =================曲线图===================*/
{
  getData("https://edu.telking.com/api/?type=month").then((json) => {
    console.log(json);
    let { xAxis, series } = json.data;
    var dom = document.getElementById("secTwo");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
      title: {
        text: "曲线图数据展示",
        left: "center",
        top: "30px",
        textStyle: {
          fontSize: 20,
          fontWeight: "500",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      grid: {
        top: "100px",
      },
      xAxis: {
        type: "category",
        data: xAxis,
      },
      yAxis: {
        type: "value",
        axisLabel: { formatter: "{value} 人" },
      },
      series: [
        {
          data: series,
          type: "line",
          smooth: true,
          areaStyle: { color: "rgba(73,173,240,0.1)" },
          itemStyle: {
            normal: {
              label: { show: true },
              lineStyle: { color: "rgb(73,173,240)" },
            },
          },
        },
      ],
    };
    if (option && typeof option === "object") {
      myChart.setOption(option, true);
    }
  });
}

/*
 * =================饼状图===================*/
{
  getData("https://edu.telking.com/api/?type=week").then((json) => {
    let data = json.data;
    let len = data.series.length;
    let arr = [];
    for (let i = 0; i < len; ++i) {
      let obj = {};
      obj.name = data.xAxis[i];
      obj.value = data.series[i];
      arr.push(obj);
    }
    var dom = document.getElementById("secThree");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
      title: {
        text: "饼状图数据展示",
        left: "center",
        top: "42px",
        textStyle: {
          fontSize: 20,
          fontWeight: "500",
        },
      },
      grid: {
        top: "100px",
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: arr,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    if (option && typeof option === "object") {
      myChart.setOption(option, true);
    }
  });
}

/*
 * =================饼状图===================*/
{
  getData("https://edu.telking.com/api/?type=week").then((json) => {
    let { xAxis, series } = json.data;

    var dom = document.getElementById("secFour");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
      title: {
        text: "柱状图数据展示",
        left: "center",
        top: "42px",
        textStyle: {
          fontSize: 20,
          fontWeight: "500",
        },
      },
      color: ["rgb(69,135,240)"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        top: "107px",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: xAxis,
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: { show: false },
          axisTick: { show: false },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "商品数",
          axisLine: { show: false },
          axisTick: { show: false },
        },
      ],
      series: [
        {
          name: "直接访问",
          type: "bar",
          barWidth: "60%",
          data: series,
        },
      ],
    };
    if (option && typeof option === "object") {
      myChart.setOption(option, true);
    }
  });
}
